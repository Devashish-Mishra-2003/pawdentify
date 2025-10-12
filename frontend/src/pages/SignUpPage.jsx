import { useState } from 'react';
import { useSignUp } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function SignUpPage() {
  const { t } = useTranslation();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      });
    } catch (err) {
      setError(err.errors?.[0]?.message || t('auth.errors.generic'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
      setError('');
    } catch (err) {
      setError(err.errors?.[0]?.message || t('auth.errors.generic'));
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        navigate('/');
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || t('auth.errors.invalidCode'));
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center py-12 px-4"
      style={{ background: 'var(--color-auth-page-bg)' }}
    >
      <div 
        className="w-full max-w-md p-8 rounded-2xl"
        style={{ 
          backgroundColor: 'var(--color-auth-card-bg)',
          boxShadow: 'var(--color-auth-card-shadow)',
          border: '1px solid var(--color-auth-card-border)'
        }}
      >
        {!pendingVerification ? (
          <>
            <h1 
              className="text-3xl mb-2"
              style={{ color: 'var(--color-auth-title)' }}
            >
              {t('auth.signUp.title')}
            </h1>
            <p 
              className="mb-6"
              style={{ color: 'var(--color-auth-subtitle)' }}
            >
              {t('auth.signUp.subtitle')}
            </p>

            {error && (
              <div 
                className="mb-4 p-3 rounded-lg"
                style={{ 
                  backgroundColor: 'var(--color-upload-error-bg)',
                  color: 'var(--color-upload-error-text)',
                  border: '1px solid var(--color-upload-error-border)'
                }}
              >
                {error}
              </div>
            )}

            {/* Google Sign Up Button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full py-3 rounded-lg font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 mb-4"
              style={{
                backgroundColor: 'var(--color-auth-social-btn-bg)',
                border: '2px solid var(--color-auth-social-btn-border)',
                color: 'var(--clerk-color-text-primary)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
                <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
              </svg>
              {t('auth.signUp.googleButton')}
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div 
                className="flex-1 h-px"
                style={{ backgroundColor: 'var(--color-auth-divider)' }}
              ></div>
              <span 
                className="px-4 text-sm"
                style={{ color: 'var(--color-auth-subtitle)' }}
              >
                {t('auth.signUp.divider')}
              </span>
              <div 
                className="flex-1 h-px"
                style={{ backgroundColor: 'var(--color-auth-divider)' }}
              ></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--color-auth-title)' }}
                  >
                    {t('auth.signUp.firstName')}
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: 'var(--clerk-color-input-bg)',
                      color: 'var(--clerk-color-text-primary)',
                      border: '1px solid var(--clerk-color-input-border)'
                    }}
                  />
                </div>
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--color-auth-title)' }}
                  >
                    {t('auth.signUp.lastName')}
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: 'var(--clerk-color-input-bg)',
                      color: 'var(--clerk-color-text-primary)',
                      border: '1px solid var(--clerk-color-input-border)'
                    }}
                  />
                </div>
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-auth-title)' }}
                >
                  {t('auth.signUp.email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--clerk-color-input-bg)',
                    color: 'var(--clerk-color-text-primary)',
                    border: '1px solid var(--clerk-color-input-border)'
                  }}
                  placeholder={t('auth.signUp.emailPlaceholder')}
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-auth-title)' }}
                >
                  {t('auth.signUp.password')}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--clerk-color-input-bg)',
                    color: 'var(--clerk-color-text-primary)',
                    border: '1px solid var(--clerk-color-input-border)'
                  }}
                  placeholder={t('auth.signUp.passwordPlaceholder')}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(to right, #8c52ff, #6b21a8)',
                  boxShadow: '0 4px 14px rgba(140, 82, 255, 0.4)'
                }}
              >
                {t('auth.signUp.submitButton')}
              </button>
            </form>

            <p 
              className="mt-6 text-center text-sm"
              style={{ color: 'var(--color-auth-subtitle)' }}
            >
              {t('auth.signUp.alreadyHaveAccount')}{' '}
              <Link 
                to="/sign-in"
                style={{ color: 'var(--color-auth-link)' }}
                className="font-semibold hover:underline"
              >
                {t('auth.signUp.signInLink')}
              </Link>
            </p>
          </>
        ) : (
          <>
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: 'var(--color-auth-title)' }}
            >
              {t('auth.signUp.verifyTitle')}
            </h1>
            <p 
              className="mb-6"
              style={{ color: 'var(--color-auth-subtitle)' }}
            >
              {t('auth.signUp.verifySubtitle')} {email}
            </p>

            {error && (
              <div 
                className="mb-4 p-3 rounded-lg"
                style={{ 
                  backgroundColor: 'var(--color-upload-error-bg)',
                  color: 'var(--color-upload-error-text)',
                  border: '1px solid var(--color-upload-error-border)'
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-auth-title)' }}
                >
                  {t('auth.signUp.verificationCode')}
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all text-center text-2xl tracking-widest"
                  style={{
                    backgroundColor: 'var(--clerk-color-input-bg)',
                    color: 'var(--clerk-color-text-primary)',
                    border: '1px solid var(--clerk-color-input-border)'
                  }}
                  placeholder={t('auth.signUp.verificationPlaceholder')}
                  maxLength="6"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(to right, #8c52ff, #6b21a8)',
                  boxShadow: '0 4px 14px rgba(140, 82, 255, 0.4)'
                }}
              >
                {t('auth.signUp.verifyButton')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}




