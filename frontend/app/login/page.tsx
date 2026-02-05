'use client';

import Link from 'next/link';
import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/auth/login', { email });

            // Save to localStorage
            localStorage.setItem('user_email', email);

            toast.success("Welcome back!");
            window.location.href = '/dashboard';
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.detail || "Login failed. Check your email.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1rem' }}>
                        <GraduationCap size={48} />
                    </div>
                    <h1 className="text-3xl font-bold">Welcome Back</h1>
                    <p style={{ color: '#9ca3af' }}>Sign in to continue your journey</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#9ca3af' }}>Email</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'white' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#9ca3af' }}>Password</label>
                        <input type="password" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'white' }} />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.8rem', marginTop: '1rem' }}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#9ca3af' }}>
                    Don't have an account? <Link href="/signup" style={{ color: 'var(--primary-light)' }}>Sign up</Link>
                </p>
            </motion.div>
        </div>
    );
}
