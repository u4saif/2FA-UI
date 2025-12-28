import React from 'react';
import { RegisterForm } from '../components/RegisterForm';
import { AuthLayout } from '../components/AuthLayout';

export const RegisterPage: React.FC = () => {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join us today"
    >
      <RegisterForm />
    </AuthLayout>
  );
};
