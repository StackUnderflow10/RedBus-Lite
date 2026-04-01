import React from 'react'
import { useState } from 'react'
import axios from 'axios';

const AuthModal = ({ isOpen, onClose, onSuccess, originRect }) => {
    const [mode, setMode] = useState('login')
    const [name,setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const reset = () => { setName(''); setEmail(''); setPassword(''); setError('');};
    const toggleMode = () => {setMode(m => m === 'login' ? 'register' :'login'); reset();};

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try{
            const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
            const payload = mode === 'login' ? {email, password} : { name, email, password };
            const res = await axios.post(`http://localhost:5000${endpoint}`, payload);
            onSuccess(res.data.user, res.data.token);
            reset();
        }
        catch(err){
            setError(err.response?.data?.error || 'Something went wrong. Try again');
        }
        finally{
            setLoading(false);
        }
    }
    const inputClasses = "w-full bg-[#1e1e1e] border border-[#2e2e2e] text-white p-3.5 rounded-xl text-[0.9rem] transition-all duration-200 outline-none placeholder:text-[#555] focus:border-[#505050] focus:bg-[#242424]";




  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Welcome back' : 'Create account'}
      originRect={originRect}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === 'register' && (
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
            className={inputClasses}
            required
            autoFocus
          />
        )}
 
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={inputClasses}
          required
          autoFocus={mode === 'login'}
        />
 
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={inputClasses}
          required
        />
 
        {error && (
          <div className="bg-red-900/20 border border-red-800/40 text-red-400 text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}
 
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-[#121212] p-3.5 rounded-xl text-sm font-bold mt-1 hover:bg-[#e8e8e8] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
              {mode === 'login' ? 'Signing in...' : 'Creating account...'}
            </>
          ) : (
            mode === 'login' ? 'Sign In →' : 'Create Account →'
          )}
        </button>
 
        <p className="text-center text-[#555] text-xs mt-1">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={toggleMode}
            className="text-[#aaa] hover:text-white transition-colors underline underline-offset-2"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </form>
    </Modal>
  )
}

export default AuthModal