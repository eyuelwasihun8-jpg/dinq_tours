import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { DinqLogo } from '../../components/common/DinqLogo';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (error) {
      console.error(error);
      toast.error('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 p-4">
      <div className="absolute inset-0 bg-[url('https://ambaseltourandtravel.com/wp-content/uploads/2023/12/photo_6022772982541300334_w.jpg')] opacity-10 bg-cover bg-center mix-blend-overlay pointer-events-none" />
      
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl p-8 relative z-10">
        <div className="flex justify-center mb-8">
          <DinqLogo variant="light" size="lg" to={null} />
        </div>

        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl font-bold text-white mb-2">DINQ Control Center</h1>
          <p className="text-stone-400 text-sm font-light">Secure administrative access only.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-5 h-5 text-stone-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-[#C88A2E] focus:ring-1 focus:ring-[#C88A2E] transition-all"
                placeholder="zerihun@dinqethiopiatours.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-5 h-5 text-stone-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-[#C88A2E] focus:ring-1 focus:ring-[#C88A2E] transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C88A2E] hover:bg-[#b57a24] text-white font-bold rounded-xl py-3.5 transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate'}
          </button>
        </form>
      </div>
    </div>
  );
}