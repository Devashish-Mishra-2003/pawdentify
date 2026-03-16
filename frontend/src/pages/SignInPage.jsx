import { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function SignInPage() {
  const { t } = useTranslation();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      });
    } catch (err) {
      setError(err.errors?.[0]?.message || 'Authentication failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate('/');
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || 'Sign in failed');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#FAFAFA] dark:bg-[#050505] relative overflow-hidden transition-colors duration-300">
      <div className="bg-blob blob-purple top-[-10%] right-[-10%] opacity-10"></div>
      <div className="bg-blob blob-blue bottom-[-10%] left-[-10%] opacity-10"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bento-card bg-white dark:bg-[#111111] p-12 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
           <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <span className="text-2xl font-extrabold text-black dark:text-white tracking-tighter">Pawdentify</span>
           </Link>
           <h1 className="text-4xl font-extrabold text-black dark:text-white mb-3">Welcome Back</h1>
           <p className="text-gray-500 dark:text-gray-400 font-medium">Continue your journey with your furry friends</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-100 dark:border-red-900/30 font-semibold text-sm text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          className="w-full h-14 rounded-full border-2 border-gray-100 dark:border-white/10 flex items-center justify-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors mb-8 group"
        >
          <svg width="20" height="20" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
            <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
          </svg>
          <span className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest text-xs">Continue with Google</span>
        </button>

        <div className="relative mb-8">
           <hr className="border-gray-100 dark:border-white/10" />
           <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#111111] px-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">or email</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 px-1">Email Address</label>
               <input 
                 type="email" 
                 value={email} 
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full h-14 px-6 rounded-full bg-[#F9FAFB] dark:bg-white/5 border-2 border-transparent dark:border-white/10 text-black dark:text-white focus:border-[#30A7DB] focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-semibold placeholder-gray-400 dark:placeholder-gray-600"
                 placeholder="hello@example.com"
               />
           </div>
           <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 px-1">Password</label>
               <input 
                 type="password" 
                 value={password} 
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full h-14 px-6 rounded-full bg-[#F9FAFB] dark:bg-white/5 border-2 border-transparent dark:border-white/10 text-black dark:text-white focus:border-[#30A7DB] focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-semibold placeholder-gray-400 dark:placeholder-gray-600"
                 placeholder="********"
               />
           </div>
           
           <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => setIsResetting(true)}
                className="text-xs font-bold text-[#30A7DB] uppercase tracking-widest hover:underline"
              >
                Forgot?
              </button>
           </div>

           <button 
             type="submit"
             className="pill-button bg-[#111111] text-white w-full py-5 text-sm font-bold uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-transform"
           >
              Sign In
           </button>
        </form>

        <p className="mt-10 text-center font-semibold text-gray-500 dark:text-gray-400">
           Don't have an account? <Link to="/sign-up" className="text-[#8c52ff] hover:underline">Sign up for free</Link>
        </p>
      </motion.div>
    </div>
  );
}
