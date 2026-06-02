import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import { useAuth } from '../store/auth';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const nav = useNavigate();
  const login = useAuth(s => s.login);
  const googleLogin = useAuth(
  s => s.googleLogin
);
  const [identifier, setId] = useState('');
  const [password, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const isCozy =
  localStorage.getItem('colorTheme') === 'cozy';

  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try { await login(identifier, password); nav('/home'); }
    catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setBusy(false); }
  };

  return (
   <div
  className={`min-h-screen flex ${
    isCozy
      ? 'bg-[#eef5fc]'
      : 'bg-lavender'
  }`}
>
     <div
  className={`hidden lg:flex w-1/2 text-white p-12 flex-col justify-between ${
    isCozy
      ? 'bg-[linear-gradient(135deg,#6F8FB8_0%,#8EB6D9_100%)]'
      : 'bg-brand-gradient'
  }`}
>
        <Logo size={32} />
        <div>
          <h2 className="font-display font-extrabold text-5xl leading-tight">Reconnect with your people.</h2>
          <p className="mt-4 opacity-90 text-lg max-w-md">Pick up right where you left off — your community has been waiting.</p>
        </div>
        <div className="text-sm opacity-70">© 2026 Syncly Inc. Designed for the creators of tomorrow.</div>
      </div>
      <div className="flex-1 p-6 sm:p-12 flex flex-col">
        <Link to="/" className="inline-flex items-center gap-2 text-ink/60 hover:text-ink text-sm"><ArrowLeft size={16}/> Back to Start</Link>
        <div className="flex-1 grid place-items-center">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-6"><Logo /></div>
            <h1 className="font-display font-extrabold text-4xl">Welcome Back</h1>
            <p className="mt-2 text-ink/60">Reconnect with your community and see what you've missed.</p>
            <form onSubmit={submit} className="mt-8 space-y-5">
              <div>
                <label className="text-xs font-semibold tracking-wider text-ink/70">EMAIL OR USERNAME</label>
                <input value={identifier} onChange={e=>setId(e.target.value)} required placeholder="name@example.com" className="input mt-2"/>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold tracking-wider text-ink/70">PASSWORD</label>
                <Link
  to="/forgot-password"
 className={`text-xs hover:underline ${
  isCozy
    ? 'text-[#6F8FB8]'
    : 'text-brand-600'
}`}
>
  Forgot Password?
</Link>
                </div>
                <div className="relative mt-2">
                  <input value={password} onChange={e=>setPw(e.target.value)} required type={show?'text':'password'} placeholder="********" className="input pr-12"/>
                  <button type="button" onClick={()=>setShow(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40">
                    {show?<EyeOff size={18}/>:<Eye size={18}/>}
                  </button>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-ink/70">
               <input
  type="checkbox"
  className={`rounded ${
    isCozy
      ? 'text-[#8EB6D9]'
      : 'text-brand-600'
  }`}
/>Keep me logged in
              </label>
              <button disabled={busy} className="btn-primary w-full py-3.5">{busy?'Signing in…':'Sign In →'}</button>
            </form>
            <div className="my-6 flex items-center gap-3 text-xs text-ink/50"><div className="flex-1 h-px bg-brand-100"/>OR CONTINUE WITH<div className="flex-1 h-px bg-brand-100"/></div>
           <div className="space-y-3">

 <GoogleLogin
  onSuccess={async (credentialResponse) => {

    try {

      await googleLogin(
        credentialResponse.credential
      );

      toast.success(
        'Logged in successfully'
      );

      nav('/home');

    } catch (err) {

      toast.error(
        err?.response?.data?.message ||
        'Google login failed'
      );

    }

  }}
  onError={() => {
    toast.error('Google login failed');
  }}
/>

  <button className="btn-outline w-full">
    Continue with Apple
  </button>

</div>
            <p className="mt-6 text-sm text-center text-ink/60">Don't have an account? <Link to="/register" className={`font-semibold ${
  isCozy
    ? 'text-[#6F8FB8]'
    : 'text-brand-600'
}`}>Join Syncly now</Link></p>
          </div>
        </div>
        <div className="text-xs text-ink/40 flex gap-5 justify-center mt-6"><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms of Service</Link></div>
      </div>
    </div>
  );
}
