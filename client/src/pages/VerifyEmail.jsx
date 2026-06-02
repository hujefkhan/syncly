import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState(
    'Verifying your email...'
  );

  const hasVerified = useRef(false);

  
  useEffect(() => {

  if (hasVerified.current) return;
  hasVerified.current = true;
    const verify = async () => {
      try {
        const token = searchParams.get('token');

        await api.get(
          `/auth/verify-email?token=${token}`
        );

        setMessage(
          'Email verified successfully! Redirecting to login...'
        );

        setTimeout(() => {
          navigate('/login');
        }, 2500);

      } catch (err) {

        setMessage(
          err.response?.data?.message ||
          'Verification failed'
        );

      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold text-center">
        {message}
      </h1>
    </div>
  );
}