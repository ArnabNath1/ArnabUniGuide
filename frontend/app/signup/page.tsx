'use client';

import Link from 'next/link';
import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Signup() {
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Save to localStorage for demo persistence
        localStorage.setItem('user_email', email);
        localStorage.setItem('user_name', name);

        // Mock signup delay
        setTimeout(() => {
            setLoading(false);
            window.location.href = '/onboarding';
        }, 1000);
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
                    <h1 className="text-3xl font-bold">Create Account</h1>
                    <p style={{ color: '#9ca3af' }}>Start your study abroad journey today</p>
                </div>

                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#9ca3af' }}>Full Name</label>
                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'white' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#9ca3af' }}>Email</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'white' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#9ca3af' }}>Password</label>
                        <input type="password" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'white' }} />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.8rem', marginTop: '1rem' }}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#9ca3af' }}>
                    Already have an account? <Link href="/login" style={{ color: 'var(--primary-light)' }}>Log in</Link>
                </p>
            </motion.div>
        </div>
    );
}
