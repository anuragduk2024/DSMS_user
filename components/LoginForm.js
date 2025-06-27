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
      <div className="flex flex-col min-h-screen justify-center items-center">
        <h2 className="text-3xl font-bold mb-10 text-center">Select Role</h2>
        <div className="flex flex-col gap-8 w-full max-w-xs items-center justify-center">
          <button
            className="w-full bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-8 rounded-xl shadow-lg text-2xl transition duration-200 focus:outline-none border-2 border-green-300 hover:border-green-500"
            onClick={() => setRole('user')}
          >
            User
          </button>
          <button
            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-8 rounded-xl shadow-lg text-2xl transition duration-200 focus:outline-none border-2 border-blue-300 hover:border-blue-500"
            onClick={() => setRole('vendor')}
          >
            Vendor
          </button>
          <button
            className="w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold py-8 rounded-xl shadow-lg text-2xl transition duration-200 focus:outline-none border-2 border-yellow-300 hover:border-yellow-500"
            onClick={() => setRole('admin')}
          >
            Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center capitalize">{role} Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="id">{getIdLabel()}</label>
          <input
            id="id"
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={id}
            onChange={e => setId(e.target.value)}
            placeholder={getIdPlaceholder()}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        {message && (
          <div className="mt-4 text-center text-sm text-gray-700">{message}</div>
        )}
      </form>
    </div>
  );
}
