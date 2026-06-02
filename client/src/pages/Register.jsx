import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import { useAuth } from '../store/auth';

export default function Register() {
  const nav = useNavigate();
  const register = useAuth(s => s.register);
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const isCozy =
  localStorage.getItem('colorTheme') === 'cozy';
  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try { await register(form); nav('/home'); toast.success('Welcome to Syncly!'); }
    catch (err) { toast.error(err.response?.data?.message || 'Could not register'); }
    finally { setBusy(false); }
  };
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

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
          <h2 className="font-display font-extrabold text-5xl leading-tight">Start your journey.</h2>
          <p className="mt-4 opacity-90 text-lg max-w-md">Designed for the creators of tomorrow. Free forever.</p>
        </div>
        <div className="text-sm opacity-70">© 2026 Syncly Inc.</div>
      </div>
      <div className="flex-1 p-6 sm:p-12 flex flex-col">
        <div className="flex items-center justify-between">
          <Link to="/"><Logo /></Link>
          <p className="text-sm text-ink/60">Already have an account? <Link to="/login" className={`font-semibold ${
  isCozy
    ? 'text-[#6F8FB8]'
    : 'text-brand-600'
}`}>Log in</Link></p>
        </div>
        <div className="flex-1 grid place-items-center">
          <div className="w-full max-w-md">
            <h1 className="font-display font-extrabold text-4xl">Start Your Journey</h1>
            <p className="mt-2 text-ink/60">Join a community designed for clarity, creativity, and connection.</p>
            <form onSubmit={submit} className="mt-8 space-y-4">
              <div>
                <label className="text-xs font-semibold tracking-wider text-ink/70">FULL NAME</label>
                <input value={form.fullName} onChange={set('fullName')} placeholder="Elena Vance" className="input mt-2"/>
              </div>
              <div>
                <label className="text-xs font-semibold tracking-wider text-ink/70">USERNAME</label>
                <input value={form.username} onChange={set('username')} required placeholder="elenav_design" className="input mt-2"/>
              </div>
              <div>
                <label className="text-xs font-semibold tracking-wider text-ink/70">EMAIL</label>
                <input value={form.email} onChange={set('email')} required type="email" placeholder="name@example.com" className="input mt-2"/>
              </div>
              <div>
                <label className="text-xs font-semibold tracking-wider text-ink/70">PASSWORD</label>
                <input value={form.password} onChange={set('password')} required type="password" placeholder="At least 6 characters" className="input mt-2"/>
              </div>
              <button disabled={busy} className="btn-primary w-full py-3.5">{busy?'Creating account…':'Create Account →'}</button>
            </form>
           <p
  className={`mt-5 text-xs text-center ${
    isCozy
      ? 'text-slate-500'
      : 'text-ink/50'
  }`}
>By signing up you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
       <div
  className={`text-xs flex gap-5 justify-center mt-6 ${
    isCozy
      ? 'text-slate-500'
      : 'text-ink/40'
  }`}
><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms of Service</Link></div>
      </div>
    </div>
  );
}
