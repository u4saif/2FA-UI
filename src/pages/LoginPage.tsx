import React from 'react';
import { LoginForm } from '../components/LoginForm';
import { AuthLayout } from '../components/AuthLayout';

export const LoginPage: React.FC = () => {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account"
    >
      <LoginForm />
    </AuthLayout>
  );
};
