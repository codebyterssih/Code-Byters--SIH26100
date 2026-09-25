'use client';

import React, { useState } from 'react';
import { useAuth, UserPersona } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

export default function HomePage() {
  const { loginAs, loginWithEmail, signUpWithEmail, loginWithGoogle, loginAsGuest } = useAuth();
  const [selectedSector, setSelectedSector] = useState<UserPersona | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const expectedCaptcha = '7X9P2';
  const { t } = useLanguage();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSector) return;
    setErrorMsg('');
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      loginAs(selectedSector);
    } catch (err: any) {
      setErrorMsg(err.message || (isSignUp ? 'Sign up failed' : 'Login failed'));
    }
  };

  const handleGoogleLogin = async () => {
    if (!selectedSector) return;
    setErrorMsg('');
    try {
      await loginWithGoogle();
      loginAs(selectedSector);
    } catch (err: any) {
      setErrorMsg(err.message || 'Google login failed');
    }
  };

  const handleGuestLogin = async () => {
    if (!selectedSector) return;
    setErrorMsg('');
    if (captchaValue.toUpperCase() !== expectedCaptcha) {
      setErrorMsg('Invalid Security CAPTCHA. Please enter 7X9P2.');
      return;
    }
    try {
      await loginAsGuest();
      loginAs(selectedSector);
    } catch (err: any) {
      setErrorMsg(err.message || 'Guest login failed');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-white flex flex-col md:flex-row overflow-hidden">
      {/* Brand Side matching NEW UI */}
      <div className="hidden md:flex w-1/2 bg-primary flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-primary icon-fill text-[28px]">
              assured_workload
            </span>
          </div>
          <h1 className="font-display font-black text-3xl text-white tracking-tight">
            {t('login.title')}
          </h1>
        </div>

        <div className="relative z-10">
          <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 font-mono text-xs font-bold rounded border border-amber-500/40 mb-4">
            {t('login.badge1')}
          </div>
          <h2 className="text-4xl font-display font-bold text-white mb-6 leading-tight whitespace-pre-line">
            {t('login.heroTitle')}
          </h2>
          <p className="text-primary-fixed-dim text-base max-w-md mb-8 leading-relaxed">
            {t('login.heroSubtitle')}
          </p>
          <div className="flex gap-4">
            <div className="px-4 py-2 rounded-full border border-white/20 text-white/90 text-sm font-medium flex items-center gap-2 bg-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
              {t('login.badge2')}
            </div>
            <div className="px-4 py-2 rounded-full border border-white/20 text-white/90 text-sm font-medium flex items-center gap-2 bg-white/5">
              <span className="material-symbols-outlined text-info text-[18px]">verified</span>
              {t('login.badge3')}
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/50 font-mono">
          {t('login.footer')}
        </div>
      </div>

      {/* Login / Persona Selection Side */}
      <div className="w-full md:w-1/2 bg-surface-container-lowest flex flex-col justify-center items-center p-8 md:p-12 relative overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in my-auto">
          <div className="md:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow">
              <span className="material-symbols-outlined text-white icon-fill">assured_workload</span>
            </div>
            <h1 className="font-display font-black text-2xl text-primary">{t('login.title')}</h1>
          </div>

          <div className="mb-8 relative">
            <div className="absolute top-0 right-0">
              <LanguageSwitcher />
            </div>
            <h2 className="text-2xl font-display font-bold text-primary mb-2 mt-8 md:mt-0">{t('login.platformAccess')}</h2>
            <p className="text-on-surface-variant text-sm pr-20">
              {selectedSector ? t('login.promptEnter') : t('login.promptSelect')}
            </p>
          </div>

          {!selectedSector ? (
            <div className="space-y-4">
              {/* Bidder Role Card */}
              <button
                onClick={() => setSelectedSector('BIDDER')}
                className="w-full group relative flex items-center p-5 border border-outline-variant rounded-2xl hover:border-info hover:shadow-soft transition-all text-left bg-white hover:bg-blue-50/20"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-info flex items-center justify-center shrink-0 mr-4 group-hover:scale-110 transition-transform shadow-sm">
                  <span className="material-symbols-outlined icon-fill text-[24px]">storefront</span>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-primary text-base group-hover:text-info transition-colors">
                    {t('login.vendorRole')}
                  </div>
                  <div className="text-xs text-on-surface-variant mt-0.5">
                    {t('login.vendorDesc')}
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-info group-hover:translate-x-1 transition-all">
                  arrow_forward
                </span>
              </button>

              {/* Officer Role Card */}
              <button
                onClick={() => setSelectedSector('CLIENT')}
                className="w-full group relative flex items-center p-5 border border-outline-variant rounded-2xl hover:border-warning hover:shadow-soft transition-all text-left bg-white hover:bg-amber-50/20"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-warning flex items-center justify-center shrink-0 mr-4 group-hover:scale-110 transition-transform shadow-sm">
                  <span className="material-symbols-outlined icon-fill text-[24px]">gavel</span>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-primary text-base group-hover:text-warning transition-colors">
                    {t('login.officerRole')}
                  </div>
                  <div className="text-xs text-on-surface-variant mt-0.5">
                    {t('login.officerDesc')}
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-warning group-hover:translate-x-1 transition-all">
                  arrow_forward
                </span>
              </button>


            </div>
          ) : (
            <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setSelectedSector(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
                <div className="font-bold text-primary">
                  {selectedSector === 'BIDDER' ? t('login.vendorLogin') :
                    selectedSector === 'CLIENT' ? t('login.officerLogin') :
                      t('login.adminLogin')}
                </div>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                {errorMsg && (
                  <div className="bg-danger/10 text-danger text-xs p-3 rounded-lg border border-danger/20 font-medium">
                    {errorMsg}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">{t('login.emailLabel')}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                    placeholder={t('login.emailPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">{t('login.passwordLabel')}</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                    placeholder={t('login.passwordPlaceholder')}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-xl transition-colors mt-2 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isSignUp ? 'person_add' : 'login'}
                  </span>
                  {isSignUp ? t('login.signUp') : t('login.signIn')}
                </button>
              </form>

              <div className="mt-4 text-center text-sm text-on-surface-variant">
                {isSignUp ? t('login.alreadyHaveAccount') : t('login.dontHaveAccount')}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrorMsg('');
                  }}
                  className="text-primary font-medium hover:underline"
                >
                  {isSignUp ? t('login.signIn') : t('login.signUp')}
                </button>
              </div>

              <div className="mt-4 p-3 bg-surface border border-outline-variant rounded-xl flex flex-col gap-2">
                <label className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Security Verification</label>
                <div className="flex items-center gap-3">
                  <div className="bg-surface-variant font-mono text-lg font-bold tracking-widest px-4 py-1.5 rounded border border-outline-variant/50 select-none decoration-line-through decoration-neutral-muted/50 text-primary">
                    {expectedCaptcha}
                  </div>
                  <input
                    type="text"
                    value={captchaValue}
                    onChange={(e) => setCaptchaValue(e.target.value)}
                    placeholder="Enter CAPTCHA"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-outline-variant focus:outline-none focus:border-primary text-sm font-mono uppercase"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center text-xs text-neutral-muted before:flex-1 before:border-t before:border-outline-variant before:mr-4 after:flex-1 after:border-t after:border-outline-variant after:ml-4">
                {t('login.orSignInWith')}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-semibold hover:bg-surface-container transition-colors"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
                  Google
                </button>
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-semibold hover:bg-surface-container transition-colors text-primary"
                >
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  {t('login.guest')}
                </button>
              </div>

              {/* Prototype Disclaimer */}
              <div className="mt-4 p-3 bg-info/5 border border-info/20 rounded-xl text-center">
                <p className="text-[11px] text-info font-semibold flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  Prototype Access: Enter the CAPTCHA above and click &quot;Guest&quot; to explore the portal.
                </p>
              </div>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-outline-variant/50 flex items-center justify-between text-xs text-neutral-muted">
            <span>{t('login.footerTag1')}</span>
            <span>•</span>
            <span>{t('login.footerTag2')}</span>
            <span>•</span>
            <span>{t('login.footerTag3')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
