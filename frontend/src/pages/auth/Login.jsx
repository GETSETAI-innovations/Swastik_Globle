import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Lock, Mail, ArrowRight, CheckCircle2, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DEMO_USERS } from '../../data/mockData';

export const Login = () => {
  const { login, switchDemoRole } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('superadmin@swastik.gov.in');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password);
      addToast({
        title: 'Authentication Successful',
        message: `Welcome back, ${user.name} (${user.role.replace('_', ' ').toUpperCase()}).`,
        type: 'success',
      });

      // Redirect to correct dashboard
      if (user.role === 'super_admin') navigate('/super-admin');
      else if (user.role === 'company_admin') navigate('/company-admin');
      else if (user.role === 'employee') navigate('/employee');
      else if (user.role === 'salesperson') navigate('/salesperson');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectLogin = async (roleKey) => {
    setError('');
    setIsLoading(true);
    const demo = DEMO_USERS.find((u) => u.role === roleKey);
    if (!demo) return;

    try {
      const user = await login(demo.email, 'password123');
      addToast({
        title: 'Authenticated as ' + demo.name,
        message: `Welcome to the ${roleKey.replace('_', ' ').toUpperCase()} portal.`,
        type: 'success',
      });

      if (user.role === 'super_admin') navigate('/super-admin');
      else if (user.role === 'company_admin') navigate('/company-admin');
      else if (user.role === 'employee') navigate('/employee');
      else if (user.role === 'salesperson') navigate('/salesperson');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoSelect = (roleKey) => {
    switchDemoRole(roleKey);
    const demo = DEMO_USERS.find((u) => u.role === roleKey);
    if (demo) {
      setEmail(demo.email);
      setPassword('password123');
      addToast({
        title: 'Demo Profile Loaded',
        message: `Filled credentials for ${demo.name} (${roleKey.replace('_', ' ')}). Click Sign In or direct enter.`,
        type: 'info',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Government Supplier Emblem & Portal Name */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0B2545] text-white font-black text-xl shadow-lg mb-3">
          SG
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
          SWASTIK GLOBLE
        </h2>
        <p className="text-xs font-semibold text-teal-700 tracking-wider uppercase mt-0.5">
          Multi-Company Employee & Procurement Portal
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Secure enterprise access with two-stage statutory approval workflows
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-slate-200">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.gov.in"
                  required
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-teal-700 hover:text-teal-800 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-10 pl-9 pr-10 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-700 border-slate-300 focus:ring-teal-600"
                />
                <span className="text-xs text-slate-600 font-medium select-none">
                  Remember this device
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 h-10 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-[0.99]"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Selector */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                One-Click Demo Logins
              </span>
              <span className="text-[10px] text-teal-700 font-medium">Click card to load • Click arrow to enter</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div
                onClick={() => handleQuickDemoSelect('super_admin')}
                className="group p-2.5 rounded-xl border border-slate-200 hover:border-teal-600 bg-slate-50/70 hover:bg-teal-50/40 text-left transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Super Admin</span>
                    <span className="w-2 h-2 rounded-full bg-teal-600" />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">Vikramaditya (HQ)</div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDirectLogin('super_admin');
                  }}
                  className="mt-2 w-full py-1 px-2 bg-teal-700 hover:bg-teal-800 text-white rounded text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Direct Enter</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div
                onClick={() => handleQuickDemoSelect('company_admin')}
                className="group p-2.5 rounded-xl border border-slate-200 hover:border-blue-600 bg-slate-50/70 hover:bg-blue-50/40 text-left transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Company Admin</span>
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">Rajeshwar (Swastik)</div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDirectLogin('company_admin');
                  }}
                  className="mt-2 w-full py-1 px-2 bg-blue-700 hover:bg-blue-800 text-white rounded text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Direct Enter</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div
                onClick={() => handleQuickDemoSelect('employee')}
                className="group p-2.5 rounded-xl border border-slate-200 hover:border-indigo-600 bg-slate-50/70 hover:bg-indigo-50/40 text-left transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Employee</span>
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">Arjun Nair (Engg)</div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDirectLogin('employee');
                  }}
                  className="mt-2 w-full py-1 px-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Direct Enter</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div
                onClick={() => handleQuickDemoSelect('salesperson')}
                className="group p-2.5 rounded-xl border border-slate-200 hover:border-emerald-600 bg-slate-50/70 hover:bg-emerald-50/40 text-left transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Salesperson</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">Deepak Verma (Bids)</div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDirectLogin('salesperson');
                  }}
                  className="mt-2 w-full py-1 px-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Direct Enter</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          Registered GeM Portal: SG-2024-PSU-991A • Compliant with GFR 2017
        </div>
      </div>
    </div>
  );
};
