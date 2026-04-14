import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeSlash, UserPlus, SignIn, ArrowLeft, Key, EnvelopeSimple, CheckCircle } from '@phosphor-icons/react';
import { login, register, forgotPassword, resetPassword } from '../api';

function formatApiError(detail) {
  if (detail == null) return 'Something went wrong. Please try again.';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail))
    return detail.map(e => (e && typeof e.msg === 'string' ? e.msg : JSON.stringify(e))).filter(Boolean).join(' ');
  if (detail && typeof detail.msg === 'string') return detail.msg;
  return String(detail);
}

// ============ Login/Register Form ============
const AuthForm = ({ onForgotPassword }) => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let response;
      if (isRegister) {
        if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
        response = await register(email, password, name);
      } else {
        response = await login(email, password);
      }
      navigate('/dashboard', { state: { user: response.data }, replace: true });
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="text-[#A1A1AA] text-center mb-6 text-sm uppercase tracking-wide">
        {isRegister ? 'Create Your Account' : 'Sign In To Continue'}
      </p>

      {error && (
        <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/30 p-3 mb-4" data-testid="auth-error">
          <p className="text-xs text-[#FF3B30]">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <div>
            <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wide block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              data-testid="register-name-input"
              className="w-full bg-[#0A0A0A] border border-[#27272A] px-4 py-3 text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#FF3B30] transition-all duration-200 text-sm"
            />
          </div>
        )}

        <div>
          <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wide block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@gmail.com"
            required
            data-testid="email-input"
            className="w-full bg-[#0A0A0A] border border-[#27272A] px-4 py-3 text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#FF3B30] transition-all duration-200 text-sm"
          />
          {isRegister && (
            <p className="text-[10px] text-[#A1A1AA] mt-1">Only Gmail addresses (@gmail.com) are accepted</p>
          )}
        </div>

        <div>
          <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wide block mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              required
              minLength={6}
              data-testid="password-input"
              className="w-full bg-[#0A0A0A] border border-[#27272A] px-4 py-3 text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#FF3B30] transition-all duration-200 text-sm pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              data-testid="toggle-password-btn"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white"
            >
              {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {!isRegister && (
          <button
            type="button"
            onClick={onForgotPassword}
            data-testid="forgot-password-btn"
            className="text-[10px] text-[#007AFF] hover:text-white transition-colors uppercase tracking-wide"
          >
            Forgot Password?
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          data-testid={isRegister ? 'register-submit-btn' : 'login-submit-btn'}
          className="w-full bg-[#FF3B30] text-white font-bold py-3 px-6 uppercase tracking-[0.1em] text-sm flex items-center justify-center gap-2 hover:bg-[#D32F2F] transition-all duration-200 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {isRegister ? <UserPlus size={18} weight="bold" /> : <SignIn size={18} weight="bold" />}
              {isRegister ? 'Create Account' : 'Sign In'}
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => { setIsRegister(!isRegister); setError(''); }}
          data-testid="toggle-auth-mode-btn"
          className="text-xs text-[#A1A1AA] hover:text-white transition-colors uppercase tracking-wide"
        >
          {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
        </button>
      </div>
    </>
  );
};

// ============ Forgot Password Form ============
const ForgotPasswordForm = ({ onBack, onResetLinkGenerated }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      onResetLinkGenerated(res.data.reset_token, email);
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={onBack}
        data-testid="back-to-login-btn"
        className="flex items-center gap-1 text-xs text-[#A1A1AA] hover:text-white mb-4 transition-colors uppercase tracking-wide"
      >
        <ArrowLeft size={14} /> Back to Sign In
      </button>

      <div className="flex items-center gap-2 mb-2">
        <Key size={20} className="text-[#FF3B30]" />
        <h2 className="text-lg font-bold tracking-tight uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Forgot Password
        </h2>
      </div>
      <p className="text-[#A1A1AA] text-xs mb-6">
        Enter your email address and we'll generate a password reset link.
      </p>

      {error && (
        <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/30 p-3 mb-4" data-testid="forgot-error">
          <p className="text-xs text-[#FF3B30]">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wide block mb-1">Email Address</label>
          <div className="relative">
            <EnvelopeSimple size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@gmail.com"
              required
              data-testid="forgot-email-input"
              className="w-full bg-[#0A0A0A] border border-[#27272A] pl-10 pr-4 py-3 text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#FF3B30] transition-all duration-200 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          data-testid="forgot-submit-btn"
          className="w-full bg-[#FF3B30] text-white font-bold py-3 px-6 uppercase tracking-[0.1em] text-sm flex items-center justify-center gap-2 hover:bg-[#D32F2F] transition-all duration-200 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Key size={18} weight="bold" />
              Generate Reset Link
            </>
          )}
        </button>
      </form>
    </>
  );
};

// ============ Reset Link Generated View ============
const ResetLinkView = ({ token, email, onProceedToReset, onBack }) => {
  const [copied, setCopied] = useState(false);

  const resetUrl = `${window.location.origin}/login?reset_token=${token}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(resetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle size={24} className="text-[#34C759]" />
        <h2 className="text-lg font-bold tracking-tight uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Reset Link Ready
        </h2>
      </div>

      <div className="bg-[#34C759]/10 border border-[#34C759]/30 p-3 mb-4">
        <p className="text-xs text-[#34C759]">
          A password reset link has been generated for <strong>{email}</strong>
        </p>
      </div>

      <p className="text-[#A1A1AA] text-xs mb-3">
        In production, this link would be sent to your email. For now, you can use it directly:
      </p>

      <div className="bg-[#0A0A0A] border border-[#27272A] p-3 mb-4 break-all">
        <p className="text-[10px] text-[#A1A1AA] font-mono">{resetUrl}</p>
      </div>

      <div className="space-y-2">
        <button
          onClick={onProceedToReset}
          data-testid="proceed-reset-btn"
          className="w-full bg-[#FF3B30] text-white font-bold py-3 px-6 uppercase tracking-[0.1em] text-sm flex items-center justify-center gap-2 hover:bg-[#D32F2F] transition-all duration-200"
        >
          <Key size={18} weight="bold" />
          Reset Password Now
        </button>

        <button
          onClick={handleCopy}
          data-testid="copy-reset-link-btn"
          className="w-full bg-transparent border border-[#27272A] text-white font-bold py-3 px-6 uppercase tracking-[0.1em] text-sm hover:bg-[#1A1A1A] transition-all duration-200"
        >
          {copied ? 'Copied!' : 'Copy Link'}
        </button>

        <button
          onClick={onBack}
          data-testid="back-to-login-from-link-btn"
          className="w-full text-center text-xs text-[#A1A1AA] hover:text-white transition-colors uppercase tracking-wide py-2"
        >
          Back to Sign In
        </button>
      </div>
    </>
  );
};

// ============ Reset Password Form ============
const ResetPasswordForm = ({ token, onBack, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      onSuccess();
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={onBack}
        data-testid="back-from-reset-btn"
        className="flex items-center gap-1 text-xs text-[#A1A1AA] hover:text-white mb-4 transition-colors uppercase tracking-wide"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div className="flex items-center gap-2 mb-2">
        <Key size={20} className="text-[#007AFF]" />
        <h2 className="text-lg font-bold tracking-tight uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Set New Password
        </h2>
      </div>
      <p className="text-[#A1A1AA] text-xs mb-6">
        Enter your new password below.
      </p>

      {error && (
        <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/30 p-3 mb-4" data-testid="reset-error">
          <p className="text-xs text-[#FF3B30]">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wide block mb-1">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
              required
              minLength={6}
              data-testid="new-password-input"
              className="w-full bg-[#0A0A0A] border border-[#27272A] px-4 py-3 text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#FF3B30] transition-all duration-200 text-sm pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white"
            >
              {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wide block mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            required
            data-testid="confirm-password-input"
            className="w-full bg-[#0A0A0A] border border-[#27272A] px-4 py-3 text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#FF3B30] transition-all duration-200 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          data-testid="reset-password-submit-btn"
          className="w-full bg-[#FF3B30] text-white font-bold py-3 px-6 uppercase tracking-[0.1em] text-sm flex items-center justify-center gap-2 hover:bg-[#D32F2F] transition-all duration-200 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Key size={18} weight="bold" />
              Reset Password
            </>
          )}
        </button>
      </form>
    </>
  );
};

// ============ Success View ============
const ResetSuccessView = ({ onBackToLogin }) => (
  <>
    <div className="text-center py-4">
      <CheckCircle size={48} className="text-[#34C759] mx-auto mb-4" />
      <h2
        className="text-xl font-bold tracking-tight uppercase mb-2"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        Password Reset
      </h2>
      <p className="text-[#A1A1AA] text-sm mb-6">
        Your password has been successfully reset. You can now sign in with your new password.
      </p>
      <button
        onClick={onBackToLogin}
        data-testid="back-to-login-success-btn"
        className="w-full bg-[#34C759] text-white font-bold py-3 px-6 uppercase tracking-[0.1em] text-sm flex items-center justify-center gap-2 hover:bg-[#2EA84D] transition-all duration-200"
      >
        <SignIn size={18} weight="bold" />
        Sign In Now
      </button>
    </div>
  </>
);

// ============ Main Login Page ============
const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const resetTokenFromUrl = searchParams.get('reset_token');

  // Views: 'auth', 'forgot', 'link_generated', 'reset', 'success'
  const [view, setView] = useState(resetTokenFromUrl ? 'reset' : 'auth');
  const [resetToken, setResetToken] = useState(resetTokenFromUrl || '');
  const [resetEmail, setResetEmail] = useState('');

  const handleResetLinkGenerated = (token, email) => {
    setResetToken(token);
    setResetEmail(email);
    setView('link_generated');
  };

  const handleBackToLogin = () => {
    setView('auth');
    setResetToken('');
    setResetEmail('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://static.prod-images.emergentagent.com/jobs/642fb84d-8ee6-4082-a35e-cd6b395c1a21/images/b2572be2a2f05a88d4ef544957404491fec71fa8be5b4b233b851a9e4b0edf4e.png')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#111111] border border-[#27272A] p-8 w-full max-w-md"
        >
          <h1
            className="text-4xl sm:text-5xl font-black tracking-tighter uppercase text-center mb-2"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            FITNESS<span className="text-[#FF3B30]">AI</span>
          </h1>

          {view === 'auth' && (
            <AuthForm onForgotPassword={() => setView('forgot')} />
          )}

          {view === 'forgot' && (
            <ForgotPasswordForm
              onBack={handleBackToLogin}
              onResetLinkGenerated={handleResetLinkGenerated}
            />
          )}

          {view === 'link_generated' && (
            <ResetLinkView
              token={resetToken}
              email={resetEmail}
              onProceedToReset={() => setView('reset')}
              onBack={handleBackToLogin}
            />
          )}

          {view === 'reset' && (
            <ResetPasswordForm
              token={resetToken}
              onBack={() => setView(resetEmail ? 'link_generated' : 'auth')}
              onSuccess={() => setView('success')}
            />
          )}

          {view === 'success' && (
            <ResetSuccessView onBackToLogin={handleBackToLogin} />
          )}

          {view === 'auth' && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-[#FF3B30] rounded-full" />
                <p className="text-xs text-[#A1A1AA] uppercase tracking-wide">AI-Powered Guidance</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-[#007AFF] rounded-full" />
                <p className="text-xs text-[#A1A1AA] uppercase tracking-wide">Personalized Plans</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-[#34C759] rounded-full" />
                <p className="text-xs text-[#A1A1AA] uppercase tracking-wide">Track Your Progress</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
