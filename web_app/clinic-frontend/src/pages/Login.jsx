import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link import
import axios from 'axios';
import Button from '../components/Button';

export default function Login({ setAuth }) {
  const [nic, setNic] = useState(''); // Changed from username to nic
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to show clean error messages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Pointing to the new secure, bcrypt-backed authentication endpoint
      const res = await axios.post('http://localhost:5000/api/auth/login', { nic, password });
      
      if (res.data.user) {
        setAuth(true);
        navigate('/dashboard');
      }
    } catch (err) {
      // Captures the specific error message sent from your backend (e.g., "Invalid NIC or Password")
      setError(err.response?.data?.error || 'Login failed. Please check your network connection.');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-pink-50">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 border border-pink-100">
        <h2 className="text-3xl font-bold mb-2 text-center text-pink-900">Welcome Back</h2>
        <p className="text-center text-sm text-pink-600 mb-8">Maternity Clinic Portal</p>

        {/* Dynamic Error Banner */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-xs font-bold text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
  {/* Add an explicit text label above the input */}
  <label className="block text-xs font-bold text-pink-900 mb-1 uppercase tracking-wide px-1">
    Username / NIC Number
  </label>
  <input 
    required
    className="w-full border-2 border-pink-100 p-4 mb-4 rounded-2xl focus:border-pink-500 outline-none transition-all text-sm" 
    type="text" 
    placeholder="Enter your registered NIC" 
    value={nic}
    onChange={(e) => setNic(e.target.value)}
  />
  
  <label className="block text-xs font-bold text-pink-900 mb-1 uppercase tracking-wide px-1">
    Password
  </label>
  <input 
    required
    className="w-full border-2 border-pink-100 p-4 mb-6 rounded-2xl focus:border-pink-500 outline-none transition-all text-sm" 
    type="password" 
    placeholder="Enter your password" 
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  
  <Button type="submit" className="w-full text-base py-3.5">Login</Button>
</form>

        {/* Redirect link to signup form */}
        <p className="text-center text-xs text-gray-500 mt-6">
          New staff member?{' '}
          <Link to="/signup" className="text-pink-600 font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}