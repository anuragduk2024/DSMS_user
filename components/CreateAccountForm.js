import { useState } from 'react';

export default function CreateAccountForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email, 
        username, 
        password, 
        phone_number: phone,
        user_role: 'user'
      })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Registration failed');
      setLoading(false);
      return;
    }
    setSuccess('Account created successfully!');
    setEmail('');
    setUsername('');
    setPassword('');
    setPhone('');
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{maxWidth:400,margin:'0 auto',background:'#fff',padding:24,borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}}>
      <h2 style={{textAlign:'center',marginBottom:16}}>Create Account</h2>
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required style={{width:'100%',padding:10,marginBottom:10,borderRadius:8,border:'1px solid #ccc'}} />
      <input type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" required style={{width:'100%',padding:10,marginBottom:10,borderRadius:8,border:'1px solid #ccc'}} />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required style={{width:'100%',padding:10,marginBottom:10,borderRadius:8,border:'1px solid #ccc'}} />
      <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone Number" style={{width:'100%',padding:10,marginBottom:10,borderRadius:8,border:'1px solid #ccc'}} />
      {error && <div style={{color:'#d32f2f',marginBottom:8,textAlign:'center'}}>{error}</div>}
      {success && <div style={{color:'#1db954',marginBottom:8,textAlign:'center'}}>{success}</div>}
      <button type="submit" disabled={loading} style={{width:'100%',padding:12,background:'#1db954',color:'#fff',border:'none',borderRadius:8,fontWeight:'bold',fontSize:'1rem',cursor:'pointer'}}>
        {loading ? 'Creating...' : 'Create Account'}
      </button>
    </form>
  );
} 