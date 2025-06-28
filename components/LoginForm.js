import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginForm() {
  const [role, setRole] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    // Send id as 'email' for compatibility with backend
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: id, password, user_role: role })
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMessage(data.message || 'Login successful!');
      if (typeof window !== 'undefined' && data.user && data.user.id) {
        localStorage.setItem('user_id', data.user.id);
      }
      if (role === 'admin') {
        router.push('/adminportal');
      } else if (role === 'vendor') {
        router.push('/vendorpage');
      } else {
        router.push('/hello');
      }
    } else {
      setMessage(data.error || 'Login failed.');
    }
  };

  const getIdLabel = () => {
    if (role === 'user') return 'User ID';
    if (role === 'vendor') return 'Vendor ID';
    if (role === 'admin') return 'Admin ID';
    return 'ID';
  };

  const getIdPlaceholder = () => {
    if (role === 'user') return 'Enter your User ID';
    if (role === 'vendor') return 'Enter your Vendor ID';
    if (role === 'admin') return 'Enter your Admin ID';
    return 'Enter your ID';
  };

  if (!role) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: '16px 0'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '20px',
          textAlign: 'center',
          color: '#059669'
        }}>Select Role</h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
          maxWidth: '280px'
        }}>
          <button
            style={{
              width: '100%',
              backgroundColor: '#dcfce7',
              color: '#166534',
              fontWeight: '600',
              padding: '24px 16px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              fontSize: '1.25rem',
              transition: 'all 0.2s',
              border: '2px solid #86efac',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#bbf7d0';
              e.target.style.borderColor = '#22c55e';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#dcfce7';
              e.target.style.borderColor = '#86efac';
            }}
            onClick={() => setRole('user')}
          >
            User
          </button>
          <button
            style={{
              width: '100%',
              backgroundColor: '#dcfce7',
              color: '#166534',
              fontWeight: '600',
              padding: '24px 16px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              fontSize: '1.25rem',
              transition: 'all 0.2s',
              border: '2px solid #86efac',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#bbf7d0';
              e.target.style.borderColor = '#22c55e';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#dcfce7';
              e.target.style.borderColor = '#86efac';
            }}
            onClick={() => setRole('vendor')}
          >
            Vendor
          </button>
          <button
            style={{
              width: '100%',
              backgroundColor: '#dcfce7',
              color: '#166534',
              fontWeight: '600',
              padding: '24px 16px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              fontSize: '1.25rem',
              transition: 'all 0.2s',
              border: '2px solid #86efac',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#bbf7d0';
              e.target.style.borderColor = '#22c55e';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#dcfce7';
              e.target.style.borderColor = '#86efac';
            }}
            onClick={() => setRole('admin')}
          >
            Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '250px'
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '320px'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          marginBottom: '16px',
          textAlign: 'center',
          textTransform: 'capitalize'
        }}>{role} Login</h2>
        <div style={{ marginBottom: '12px' }}>
          <label style={{
            display: 'block',
            color: '#374151',
            marginBottom: '4px',
            fontSize: '0.875rem'
          }} htmlFor="id">{getIdLabel()}</label>
          <input
            id="id"
            type="text"
            style={{
              width: '100%',
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              outline: 'none',
              fontSize: '0.875rem'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#22c55e';
              e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
            value={id}
            onChange={e => setId(e.target.value)}
            placeholder={getIdPlaceholder()}
            required
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            color: '#374151',
            marginBottom: '4px',
            fontSize: '0.875rem'
          }} htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            style={{
              width: '100%',
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              outline: 'none',
              fontSize: '0.875rem'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#22c55e';
              e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            backgroundColor: '#22c55e',
            color: 'white',
            fontWeight: '600',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            fontSize: '0.875rem'
          }}
          onMouseOver={(e) => {
            if (!loading) e.target.style.backgroundColor = '#16a34a';
          }}
          onMouseOut={(e) => {
            if (!loading) e.target.style.backgroundColor = '#22c55e';
          }}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        {message && (
          <div style={{
            marginTop: '12px',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#374151'
          }}>{message}</div>
        )}
      </form>
    </div>
  );
}
