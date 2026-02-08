'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, User, BookOpen, Search, LogOut, ListChecks, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: GraduationCap },
    { name: 'Universities', href: '/universities', icon: Search },
    { name: 'Scholarships', href: '/scholarships', icon: BookOpen },
    { name: 'Guidance', href: '/guidance', icon: ListChecks },
    { name: 'Profile', href: '/profile', icon: User },
];

export default function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Hide navbar on auth page and home page
    if (['/login', '/signup', '/', '/onboarding'].includes(pathname)) return null;

    const handleLogout = () => {
        localStorage.clear();
        window.location.replace('/signup');
    };

    const closeMenu = () => setMobileMenuOpen(false);

    return (
        <nav className="glass" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 'var(--header-height)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            padding: '0 1rem',
            justifyContent: 'space-between',
        }}>
            {/* Logo */}
            <div className="logo" style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-light)', flexShrink: 0 }}>
                <GraduationCap size={24} />
                <span style={{ display: 'none' }} className="hidden-mobile">UniGuide.ai</span>
            </div>

            {/* Desktop Navigation */}
            <div style={{ display: 'none', gap: '1rem' }} className="hidden-mobile">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link key={item.name} href={item.href} style={{ position: 'relative', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: isActive ? 'var(--primary-light)' : 'var(--foreground)', transition: 'color 0.2s' }}>
                            {isActive && (
                                <motion.div
                                    layoutId="nav-pill"
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        borderRadius: 'var(--radius)',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        zIndex: -1,
                                    }}
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Icon size={18} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Desktop Logout */}
            <div style={{ display: 'none' }} className="hidden-mobile">
                <button
                    onClick={handleLogout}
                    className="btn btn-secondary"
                    style={{ background: 'transparent', border: '1px solid var(--card-border)', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                    <LogOut size={16} style={{ marginRight: '0.5rem' }} />
                    Logout
                </button>
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ display: 'none', cursor: 'pointer', background: 'none', border: 'none' }}
                className="show-mobile"
                aria-label="Toggle menu"
            >
                {mobileMenuOpen ? <X size={24} color="var(--foreground)" /> : <Menu size={24} color="var(--foreground)" />}
            </button>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'rgba(26, 29, 45, 0.95)',
                            backdropFilter: 'blur(12px)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            display: 'none',
                            zIndex: 99,
                        }}
                        className="show-mobile"
                    >
                        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={closeMenu}
                                        style={{
                                            padding: '0.75rem 1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            borderRadius: 'var(--radius)',
                                            color: isActive ? 'var(--primary-light)' : 'var(--foreground)',
                                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Icon size={18} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        closeMenu();
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        borderRadius: 'var(--radius)',
                                        background: 'rgba(230, 57, 70, 0.1)',
                                        border: '1px solid rgba(230, 57, 70, 0.3)',
                                        color: '#ff6b7a',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
