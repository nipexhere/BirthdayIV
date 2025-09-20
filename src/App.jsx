import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from './supabaseClient';
import './App.css';

function generateInviteCode(name) {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase();
  return initials + '-' + Date.now().toString().slice(-6);
}

function App() {
  const ADMIN_PASS = 'uncle2025'; 
  const [adminError, setAdminError] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminMode, setAdminMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registered, setRegistered] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [guests, setGuests] = useState([]);
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (adminMode === true) {
      setLoadingGuests(true);
      supabase
        .from('guests')
        .select('*')
        .then(({ data, error }) => {
          if (!error) {
            setGuests(data);
          }
          setLoadingGuests(false);
        });
    }
  }, [adminMode, registered]);

  // Registration handler
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email) return;
    const code = generateInviteCode(name);
    // Insert guest into Supabase
    const { data, error } = await supabase
      .from('guests')
      .insert([{ name, email, code }]);
    if (!error) {
      setInviteCode(code);
      setRegistered(true);
    } else {
      alert('Registration failed. Please try again.');
    }
  };

  // Delete guest from Supabase
  const handleDeleteGuest = async (guestId) => {
    await supabase.from('guests').delete().eq('id', guestId);
    // Refresh guest list
    supabase
      .from('guests')
      .select('*')
      .then(({ data, error }) => {
        if (!error) {
          setGuests(data);
        }
      });
  };
  return (
    <motion.div className="birthday-container"
  initial={{ y: 40 }}
  animate={{ y: 0 }}
  transition={{ duration: 2 }}
    >
      {/* Invitation Header */}
      <motion.header
        className="birthday-header"
  initial={{ y: -30 }}
  animate={{ y: [0, -10, 0, 10, 0] }}
  transition={{ duration: 2 }}
      >
        <motion.h1
          className="shhh"
    initial={{ scale: 0.8 }}
  animate={{ scale: 1, y: [0, -8, 0, 8, 0] }}
  transition={{ duration: 2 }}
        >Shhh...</motion.h1>
        <motion.h2
          className="surprise"
    initial={{ x: -50 }}
  animate={{ x: 0, y: [0, 10, 0, -10, 0] }}
  transition={{ duration: 2 }}
        >IT’S A SURPRISE!</motion.h2>
        <motion.p
          className="subtitle"
    initial={{ x: 50 }}
  animate={{ x: 0, y: [0, -6, 0, 6, 0] }}
  transition={{ duration: 2 }}
        >PLEASE JOIN US TO CELEBRATE</motion.p>
        <motion.h2
          className="celebrant"
    initial={{}}
  animate={{ y: [0, 12, 0, -12, 0] }}
  transition={{ duration: 1.2 }}
        >Babalola Olusegun Adisa’s 75th Birthday</motion.h2>

        <motion.div
          className="event-details"
    initial={{}}
  animate={{ y: [0, -10, 0, 10, 0] }}
  transition={{ duration: 3.8, delay: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        >
          <p><b>DRESS CODE:</b> Blue, White with a touch of Gold</p>
          <p><b>DATE:</b> October 18, 2025</p>
          <p><b>TIME:</b> 12:00pm</p>
          <p><b>VENUE:</b> Golden Click Hotel & Event Place,<br />
             16-18 Candos Road, Baruwa, Ipaja, Lagos</p>
          <p><b>RSVP:</b> Odun Babalola - 08166903924<br />
             Banji Babalola - 08080368950</p>
        </motion.div>
      </motion.header>

      {/* Admin access button */}
      {!adminMode && (
  <motion.div style={{ margin: '1rem 0' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
          <motion.button className="gold-button" whileHover={{ scale: 1.08 }} transition={{ duration: 0.3 }} onClick={() => setAdminMode('prompt')}>
            Admin
          </motion.button>
        </motion.div>
      )}

      {/* Admin password prompt */}
      {adminMode === 'prompt' && (
        <motion.form
          className="invite-form"
          style={{ maxWidth: 300, margin: '0 auto', marginBottom: '1rem' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}
          onSubmit={e => {
            e.preventDefault();
            if (adminPassword === ADMIN_PASS) {
              setAdminMode(true);
              setAdminError('');
            } else {
              setAdminError('Incorrect password');
            }
          }}
        >
          <h3>Admin Login</h3>
          <input
            type="password"
            placeholder="Enter admin password"
            value={adminPassword}
            onChange={e => setAdminPassword(e.target.value)}
            required
          />
          <motion.button type="submit" className="gold-button" whileHover={{ scale: 1.08 }} transition={{ duration: 0.3 }}>Login</motion.button>
          {adminError && <div style={{ color: 'red', marginTop: '0.5rem' }}>{adminError}</div>}
        </motion.form>
      )}

      {/* Admin view */}
      {adminMode === true && (
  <motion.div className="admin-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
          <h3>Registered Guests</h3>
          <input
            type="text"
            placeholder="Search by name or code"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #ffd700', fontSize: '1rem' }}
          />
          {loadingGuests ? (
            <p>Loading guests...</p>
          ) : guests.length === 0 ? (
            <p>No guests have registered yet.</p>
          ) : (
            <motion.table initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Invite Code</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {guests
                  .filter(g =>
                    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    g.code.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((g, idx) => (
                    <motion.tr key={g.id || idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                      <td>{g.name}</td>
                      <td>{g.code}</td>
                      {/* <td>
                        <motion.button
                          style={{ background: '#d72660', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem' }}
                          whileHover={{ scale: 1.1, backgroundColor: '#a61b46' }}
                          transition={{ duration: 0.3 }}
                          onClick={() => handleDeleteGuest(g.id)}
                        >
                          Delete
                        </motion.button>
                      </td> */}
                    </motion.tr>
                  ))}
              </tbody>
            </motion.table>
          )}
          <motion.button
            className="logout-button"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              setAdminMode(false);
              setAdminPassword('');
            }}
          >
            Logout
          </motion.button>
        </motion.div>
      )}

      {/* Registration form or Invite code */}
      {!registered ? (
  <motion.form className="invite-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} onSubmit={handleRegister}>
          <h3>Register to Attend</h3>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <motion.button type="submit" className="gold-button" whileHover={{ scale: 1.08 }} transition={{ duration: 0.3 }}>Get My Invite Code</motion.button>
        </motion.form>
      ) : (
  <motion.div className="invite-success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }}>
          <h3>Thank you for registering!</h3>
          <p>Your unique invite code:</p>
          <motion.div className="invite-code" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2 }}>{inviteCode}</motion.div>
          <p>Please show this code at the entrance.</p>
        </motion.div>
      )}

  <motion.footer className="birthday-footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.7 }}>
        <p>Made with 💙 & ✨ for Adisa’s 75th Birthday</p>
      </motion.footer>
    </motion.div>
  );
// ...existing code...
}

export default App;
