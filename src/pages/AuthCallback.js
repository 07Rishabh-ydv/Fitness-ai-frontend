import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeSession } from '../api';

const AuthCallback = () => {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      const hash = window.location.hash;
      const sessionId = new URLSearchParams(hash.substring(1)).get('session_id');

      if (!sessionId) {
        navigate('/login');
        return;
      }

      try {
        const response = await exchangeSession(sessionId);
        navigate('/dashboard', {
          state: { user: response.data },
          replace: true
        });
      } catch (error) {
        console.error('Auth error:', error);
        navigate('/login');
      }
    };

    processSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#FF3B30] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#A1A1AA] uppercase tracking-wide text-sm">Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
