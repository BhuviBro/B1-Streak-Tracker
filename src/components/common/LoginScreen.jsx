import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';
import { Card } from './Card';
import { LogIn, Sparkles } from 'lucide-react';

export function LoginScreen({ onSkipDemo }) {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setIsLoggingIn(true);
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setError('Failed to sign in with Google. Please check your config or try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', padding: '24px', backgroundColor: 'var(--bg-primary)', textAlignment: 'center'
    }}>
      <Card style={{ maxWidth: '400px', width: '100%', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '16px',
          background: 'linear-gradient(135deg, var(--accent-green-500), var(--accent-green-400))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          boxShadow: '0 8px 20px rgba(35, 134, 54, 0.3)'
        }}>
          <Sparkles size={28} color="#ffffff" />
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Consistency Tracker
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5' }}>
          Track tasks, routines, streaks, and build daily consistency with GitHub-style contributions.
        </p>

        {error && (
          <div style={{
            padding: '10px 12px', borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(248, 81, 73, 0.15)', border: '1px solid rgba(248, 81, 73, 0.3)',
            color: 'var(--status-danger)', fontSize: '13px', marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <Button
          variant="primary"
          fullWidth
          icon={LogIn}
          onClick={handleGoogleLogin}
          disabled={isLoggingIn}
          style={{ padding: '12px 16px', fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}
        >
          {isLoggingIn ? 'Signing In...' : 'Sign In with Google'}
        </Button>

        {onSkipDemo && (
          <Button
            variant="ghost"
            fullWidth
            onClick={onSkipDemo}
            style={{ fontSize: '13px' }}
          >
            Continue as Guest / Demo Mode
          </Button>
        )}
      </Card>
    </div>
  );
}
