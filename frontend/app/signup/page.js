import { Suspense } from 'react';
import AuthForm from '../../components/auth/AuthForm';

export default function SignupPage() {
  return (
    <Suspense fallback={<main className="auth-page" />}>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
