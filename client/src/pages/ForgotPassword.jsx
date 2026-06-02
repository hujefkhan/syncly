import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import api from '../lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const isCozy =
  localStorage.getItem('colorTheme') === 'cozy';

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      await api.post('/auth/forgot-password', {
        email
      });

      toast.success('Password reset link sent');
      setEmail('');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        'Failed to send reset link'
      );
    } finally {
      setBusy(false);
    }
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
  className="hidden lg:flex w-1/2 text-white p-12 flex-col justify-between"
  style={
    isCozy
      ? {
          background:
            'linear-gradient(135deg,#6F8FB8 0%,#8EB6D9 100%)'
        }
      : {}
  }
>
        <Logo size={32} />

        <div>
          <h2 className="font-display font-extrabold text-5xl leading-tight">
            Recover your account.
          </h2>

          <p className="mt-4 opacity-90 text-lg max-w-md">
            Enter your email address and we'll send you a password reset link.
          </p>
        </div>

        <div className="text-sm opacity-70">
          © 2026 Syncly Inc.
        </div>
      </div>

      <div className="flex-1 p-6 sm:p-12 flex flex-col">

        <Link
          to="/login"
         className={`inline-flex items-center gap-2 text-sm ${
  isCozy
    ? 'text-[#6F8FB8]'
    : 'text-ink/60 hover:text-ink'
}`}
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
              Forgot Password
            </h1>

            <p className="mt-2 text-ink/60">
              We'll send you a secure reset link.
            </p>

            <form
              onSubmit={submit}
              className="mt-8 space-y-5"
            >

              <div>
                <label className="text-xs font-semibold tracking-wider text-ink/70">
                  EMAIL
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input mt-2"
                />
              </div>

              <button
  disabled={busy}
  className="btn-primary w-full py-3.5"
>
  {busy
    ? 'Sending...'
    : 'Send Reset Link →'}
</button>

<button
  type="button"
  onClick={async () => {
    try {
      await api.post(
        '/auth/resend-verification',
        { email }
      );

      toast.success(
        'Verification email sent'
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        'Failed to send verification email'
      );
    }
  }}
  className="btn-outline w-full py-3.5"
>
  Resend Verification Email
</button>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
}