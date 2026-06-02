import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import api from '../lib/api';

export default function ResetPassword() {
  const nav = useNavigate();
  const [params] = useSearchParams();

  const token = params.get('token');

  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!token) {
      return toast.error('Invalid reset link');
    }

    setBusy(true);

    try {
      await api.post('/auth/reset-password', {
        token,
        password
      });

      toast.success('Password updated successfully');

      setTimeout(() => {
        nav('/login');
      }, 1500);

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        'Reset failed'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-lavender flex">

     <div
  className={`hidden lg:flex w-1/2 text-white p-12 flex-col justify-between ${
    isCozy
      ? 'bg-[linear-gradient(135deg,#6F8FB8_0%,#8EB6D9_100%)]'
      : 'bg-brand-gradient'
  }`}
>
        <Logo size={32} />

        <div>
          <h2 className="font-display font-extrabold text-5xl leading-tight">
            Create a new password.
          </h2>

          <p className="mt-4 opacity-90 text-lg max-w-md">
            Your new password should be secure and easy to remember.
          </p>
        </div>

        <div className="text-sm opacity-70">
          © 2024 Syncly Inc.
        </div>
      </div>

      <div className="flex-1 p-6 sm:p-12 flex flex-col">

        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-ink/60 hover:text-ink text-sm"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>

        <div className="flex-1 grid place-items-center">

          <div className="w-full max-w-md">

            <div className="lg:hidden mb-6">
              <Logo />
            </div>

          <h1
  className={`font-display font-extrabold text-4xl ${
    isCozy
      ? 'text-[#2F4057]'
      : ''
  }`}
>
              Reset Password
            </h1>

            <p className="mt-2 text-ink/60">
              Enter your new password below.
            </p>

            <form
              onSubmit={submit}
              className="mt-8 space-y-5"
            >

              <div>
                <label className="text-xs font-semibold tracking-wider text-ink/70">
                  NEW PASSWORD
                </label>

                <div className="relative mt-2">

                  <input
                    type={show ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="input pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40"
                  >
                    {show ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>

                </div>
              </div>

              <button
                disabled={busy}
                className="btn-primary w-full py-3.5"
              >
                {busy
                  ? 'Updating...'
                  : 'Reset Password →'}
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}