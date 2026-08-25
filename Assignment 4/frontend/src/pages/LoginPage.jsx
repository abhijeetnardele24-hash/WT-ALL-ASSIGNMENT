import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import vitLogoFull from '../assets/vit_logo_full.png';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const isEmail = identifier.includes('@');
  const isValidVitEmail = isEmail && identifier.trim().toLowerCase().endsWith('@vit.edu');
  const isInvalidDomain = isEmail && !isValidVitEmail;

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (isInvalidDomain) {
      setError('Access Denied: Only official university emails ending with @vit.edu are authorized.');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosClient.post('/auth/login', { 
        identifier: identifier.trim(),
        prnNumber: identifier.trim(), 
        password 
      });
      handleLoginSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify your PRN or Institutional Email.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      const response = await axiosClient.post('/auth/google', {
        token: credentialResponse.credential
      });
      handleLoginSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Google Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (data) => {
    const { token, ...userData } = data;
    login(token, userData);
    
    if (userData.role === 'STUDENT') {
      navigate('/result');
    } else if (userData.role === 'FACULTY') {
      navigate('/faculty');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#fafafa] font-sans text-slate-900 overflow-hidden">
      
      {/* Left Panel - Minimalist Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 bg-white border-r border-slate-200">
        <div>
          <img 
            src={vitLogoFull} 
            alt="Vishwakarma Institute of Technology" 
            className="h-14 w-auto object-contain mb-16"
          />
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 mb-5">
            Academic ERP Portal
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-md">
            Centralized platform for students and faculty to manage multi-semester gradebooks, live attendance, and digital hall tickets.
          </p>
        </div>

        <div className="text-sm text-slate-400 font-medium">
          &copy; {new Date().getFullYear()} Vishwakarma Institute of Technology, Pune.
        </div>
      </div>

      {/* Right Panel - Clean Sign In Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          
          <div className="mb-10 lg:hidden">
             <img src={vitLogoFull} alt="VIT Logo" className="h-10 w-auto" />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Sign in to your account</h2>
            <p className="text-sm text-slate-500 mt-2">Enter your PRN or official @vit.edu email</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  PRN or Email
                </label>
                {isEmail && (
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    isValidVitEmail ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                  }`}>
                    {isValidVitEmail ? 'Valid Domain' : 'Invalid Domain'}
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors ${
                  isInvalidDomain ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                }`}
                placeholder="23BCE0001 or name@vit.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || isInvalidDomain}
              className="w-full py-2.5 px-4 bg-[#0072bc] hover:bg-[#0060aa] text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#fafafa] text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google authentication failed.')}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
              text="continue_with"
            />
          </div>

          <div className="mt-8 text-center text-xs text-slate-400">
            Protected by 256-bit SSL encryption. <br />
            Need help? Contact <a href="mailto:erp.support@vit.edu" className="text-[#0072bc] hover:underline">erp.support@vit.edu</a>
          </div>

        </div>
      </div>

    </div>
  );
}
