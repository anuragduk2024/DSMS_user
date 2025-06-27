import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, password, user_role } = req.body;
  if (!email || !password || !user_role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  // Debug: log incoming credentials
  console.log('Login attempt:', { username: email, password, user_role });
  const { data, error } = await supabase
    .from('users')
    .select('id, username, user_role')
    .eq('username', email)
    .eq('password', password)
    .eq('user_role', user_role)
    .single();
  // Debug: log query result
  console.log('Supabase query result:', { data, error });

  if (error || !data) {
    return res.status(401).json({ error: 'Invalid credentials or role.' });
  }
  return res.status(200).json({ message: 'Login successful!', user: data });
} 