'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../providers/AuthProvider';

export default function AuthForm({ mode }) {
  const isSignup = mode === 'signup';
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/auth/${isSignup ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to continue.');

      await refreshUser();
      router.replace('/data-sources');
      router.refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <Link href="/" className="auth-mobile-brand">
          <span className="auth-brand-mark"><ShieldCheck aria-hidden="true" /></span>
          <span>RiskNexus</span>
        </Link>

        <section className="auth-card">
          <aside className="auth-story">
            <Link href="/" className="auth-brand">
              <span className="auth-brand-mark"><ShieldCheck aria-hidden="true" /></span>
              <span>RiskNexus</span>
            </Link>

            <div className="auth-story-content">
              <div className="auth-illustration" aria-hidden="true">
                <div className="auth-illustration-orbit auth-illustration-orbit-outer" />
                <div className="auth-illustration-orbit auth-illustration-orbit-inner" />
                <div className="auth-illustration-shield"><ShieldCheck /></div>
                <span className="auth-illustration-dot auth-dot-one" />
                <span className="auth-illustration-dot auth-dot-two" />
                <span className="auth-illustration-dot auth-dot-three" />
              </div>

              <p className="auth-eyebrow">CLARITY FOR THE RISKS THAT MATTER</p>
              <h1>Make security decisions with confidence.</h1>
              <p className="auth-story-description">
                Bring risk, investment, and impact into one clear view for your organization.
              </p>

              <ul className="auth-benefits">
                <li><CheckCircle2 aria-hidden="true" /> Understand your exposure</li>
                <li><CheckCircle2 aria-hidden="true" /> Prioritize the right controls</li>
                <li><CheckCircle2 aria-hidden="true" /> Track what changes over time</li>
              </ul>
            </div>

            <p className="auth-story-footer">A clearer view of cyber risk starts here.</p>
          </aside>

          <div className="auth-form-panel">
            <div className="auth-form-heading">
              <span className="auth-kicker">
                <LockKeyhole aria-hidden="true" />
                SECURE WORKSPACE
              </span>
              <h2>{isSignup ? 'Create your account' : 'Welcome back'}</h2>
              <p>
                {isSignup
                  ? 'Set up your account to get started with RiskNexus.'
                  : 'Sign in to continue to your RiskNexus workspace.'}
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {isSignup && (
                <label className="auth-label">
                  Full name
                  <input
                    autoComplete="name"
                    required
                    maxLength={100}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="auth-input"
                    placeholder="e.g. Alex Morgan"
                  />
                </label>
              )}

              <label className="auth-label">
                Work email
                <input
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="auth-input"
                  placeholder="you@company.com"
                />
              </label>

              <label className="auth-label">
                Password
                <input
                  type="password"
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  required
                  minLength={8}
                  maxLength={72}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="auth-input"
                  placeholder="At least 8 characters"
                />
                {isSignup && <span className="auth-hint">Use at least 8 characters (maximum 72 UTF-8 bytes).</span>}
              </label>

              {error && <p role="alert" className="auth-error">{error}</p>}

              <button type="submit" disabled={isSubmitting} className="auth-submit">
                {isSubmitting ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
                {!isSubmitting && <ArrowRight aria-hidden="true" />}
              </button>
            </form>

            <p className="auth-switch">
              {isSignup ? 'Already have an account?' : 'New to RiskNexus?'}{' '}
              <Link href={isSignup ? '/login' : '/signup'}>
                {isSignup ? 'Sign in' : 'Create an account'}
              </Link>
            </p>
            <p className="auth-privacy">Your password is securely hashed and never stored in plain text.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
