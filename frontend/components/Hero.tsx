'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Globe, TrendingUp, CheckCircle } from 'lucide-react';

export default function Hero() {
    return (
        <>
            <style>{`
                @media (max-width: 768px) {
                    [data-hero-grid] {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                    [data-hero-grid] > div {
                        width: 100%;
                    }
                }
            `}</style>
            <section suppressHydrationWarning style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--header-height) 1rem 2rem',
                background: 'radial-gradient(circle at 50% 50%, rgba(76, 29, 149, 0.15) 0%, transparent 50%)'
            }}>
                <div className="container" suppressHydrationWarning data-hero-grid style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', width: '100%' }}>
                {/* Left Column - Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '50px',
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '0.9rem',
                        color: 'var(--primary-light)'
                    }}>
                        AI-Powered Study Abroad Application
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(1.75rem, 5vw, 3.5rem)',
                        lineHeight: 1.2,
                        marginBottom: '1.5rem',
                        background: 'linear-gradient(to right, #fff, #a5b4fc)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Your Dream University <br />
                        Is Just One Click Away
                    </h1>
                    <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#9ca3af', marginBottom: '2.5rem', maxWidth: '500px', lineHeight: 1.6 }}>
                        Get personalized guidance, AI-driven university shortlisting, and real-time application tracking. Maximize your chances of acceptance.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link href="/signup" className="btn btn-primary" style={{ padding: 'clamp(0.6rem, 2vw, 0.8rem) clamp(1.5rem, 3vw, 2rem)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', whiteSpace: 'nowrap' }}>
                            Get Started <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                        </Link>
                        <Link href="/login" className="btn btn-secondary" style={{ padding: 'clamp(0.6rem, 2vw, 0.8rem) clamp(1.5rem, 3vw, 2rem)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
                            Login
                        </Link>
                    </div>
                </motion.div>

                {/* Right Column - Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ position: 'relative' }}
                >
                    <div style={{
                        background: 'var(--card-bg)',
                        padding: 'clamp(1.5rem, 5vw, 2rem)',
                        borderRadius: '24px',
                        border: '1px solid var(--card-border)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ width: '50px', height: '50px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Globe color="white" size={28} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Dream University</h3>
                                <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Acceptance Probability: <span style={{ color: 'var(--success)' }}>High</span></p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                            {[
                                { label: 'Profile Analysis', status: 'Completed', color: 'var(--success)' },
                                { label: 'SOP Review', status: 'In Progress', color: 'var(--warning)' },
                                { label: 'Visa Checklist', status: 'Pending', color: 'var(--error)' }
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <CheckCircle size={16} color={item.color} /> {item.label}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--primary)', filter: 'blur(60px)', opacity: 0.5, zIndex: 0 }}></div>
                    <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '150px', height: '150px', background: 'var(--accent)', filter: 'blur(80px)', opacity: 0.3, zIndex: 0 }}></div>
                </motion.div>
                </div>
            </section>
        </>
    );
}
