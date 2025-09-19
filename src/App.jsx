import { useState } from 'react';
import './App.css';

function generateInviteCode(name) {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase();
  return initials + '-' + Date.now().toString().slice(-6);
}

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registered, setRegistered] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [guests, setGuests] = useState(() => {
    const saved = localStorage.getItem('birthdayGuests');
    return saved ? JSON.parse(saved) : [];
  });

  const [adminMode, setAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const ADMIN_PASS = 'uncle2025'; // change as needed

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    const code = generateInviteCode(name);
    const newGuest = { name, email, code };
    const updatedGuests = [...guests, newGuest];
    setGuests(updatedGuests);
    localStorage.setItem('birthdayGuests', JSON.stringify(updatedGuests));
    setInviteCode(code);
    setRegistered(true);
  };

  return (
    <div className="birthday-container">
      {/* Invitation Header */}
      <header className="birthday-header">
        <h1 className="shhh">Shhh...</h1>
        <h2 className="surprise">IT’S A SURPRISE!</h2>
        <p className="subtitle">PLEASE JOIN US TO CELEBRATE</p>
        <h2 className="celebrant">Babalola Olusegun Adisa’s 75th Birthday</h2>

        <div className="event-details">
          <p><b>DRESS CODE:</b> Blue, White with a touch of Gold</p>
          <p><b>DATE:</b> October 18, 2025</p>
          <p><b>TIME:</b> 12:00pm</p>
          <p><b>VENUE:</b> Golden Click Hotel & Event Place,<br />
             16-18 Candos Road, Baruwa, Ipaja, Lagos</p>
          <p><b>RSVP:</b> Odun Babalola - 08166903924<br />
             Banji Babalola - 08080368950</p>
        </div>
      </header>

      {/* Admin access button */}
      {!adminMode && (
        <div style={{ margin: '1rem 0' }}>
          <button className="gold-button" onClick={() => setAdminMode('prompt')}>
            Admin Login
          </button>
        </div>
      )}

      {/* Admin password prompt */}
      {adminMode === 'prompt' && (
        <form
          className="invite-form"
          style={{ maxWidth: 300, margin: '0 auto', marginBottom: '1rem' }}
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
          <button type="submit" className="gold-button">Login</button>
          {adminError && <div style={{ color: 'red', marginTop: '0.5rem' }}>{adminError}</div>}
        </form>
      )}

      {/* Admin view */}
      {adminMode === true && (
        <div className="admin-view">
          <h3>Registered Guests</h3>
          {guests.length === 0 ? (
            <p>No guests have registered yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Invite Code</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((g, idx) => (
                  <tr key={idx}>
                    <td>{g.name}</td>
                    <td>{g.email}</td>
                    <td>{g.code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button
            className="logout-button"
            onClick={() => {
              setAdminMode(false);
              setAdminPassword('');
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* Registration form or Invite code */}
      {!registered ? (
        <form className="invite-form" onSubmit={handleRegister}>
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
          <button type="submit" className="gold-button">Get My Invite Code</button>
        </form>
      ) : (
        <div className="invite-success">
          <h3>Thank you for registering!</h3>
          <p>Your unique invite code:</p>
          <div className="invite-code">{inviteCode}</div>
          <p>Please show this code at the entrance.</p>
        </div>
      )}

      <footer className="birthday-footer">
        <p>Made with 💙 & ✨ for Adisa’s 75th Birthday</p>
      </footer>
    </div>
  );
}

export default App;
