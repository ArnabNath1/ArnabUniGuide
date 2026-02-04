'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { GraduationCap, User, BookOpen, Search, LogOut, ListChecks } from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: GraduationCap },
    { name: 'Universities', href: '/universities', icon: Search },
    { name: 'Scholarships', href: '/scholarships', icon: BookOpen },
    { name: 'Guidance', href: '/guidance', icon: ListChecks },
    { name: 'Profile', href: '/profile', icon: User },
];

export default function Navbar() {
    const pathname = usePathname();

    // Hide navbar on auth page and home page
    if (['/login', '/signup', '/', '/onboarding'].includes(pathname)) return null;

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
            padding: '0 2rem',
            justifyContent: 'space-between'
        }}>
            <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-light)' }}>
                <GraduationCap size={32} />
                <span>UniGuide.ai</span>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link key={item.name} href={item.href} style={{ position: 'relative', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: isActive ? 'var(--primary-light)' : 'var(--foreground)' }}>
                            {isActive && (
                                <motion.div
                                    layoutId="nav-pill"
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        borderRadius: 'var(--radius)',
                                        background: 'rgba(255, 255, 255, 0.05)',
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

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    onClick={() => {
                        localStorage.clear();
                        window.location.replace('/signup');
                    }}
                    className="btn btn-secondary"
                    style={{ background: 'transparent', border: '1px solid var(--card-border)' }}
                >
                    <LogOut size={18} style={{ marginRight: '0.5rem' }} />
                    Logout
                </button>
            </div>
        </nav>
    );
}
