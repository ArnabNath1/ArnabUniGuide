'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, DollarSign, Calendar, Search, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { scholarships as initialScholarships } from '@/lib/data';

export default function Scholarships() {
    const [query, setQuery] = useState('');
    const [scholarships, setScholarships] = useState(initialScholarships);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await api.get(`/content/scholarships?query=${encodeURIComponent(query)}`);
            if (res.data && res.data.scholarships) {
                setScholarships(res.data.scholarships);
            }
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 'var(--header-height) 2rem 2rem', minHeight: '100vh', background: 'var(--background)' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <h1 className="text-4xl font-bold text-center" style={{ marginBottom: '2rem', marginTop: '2rem' }}>
                    Find <span style={{ color: 'var(--primary-light)' }}>Scholarships</span>
                </h1>

                <form onSubmit={handleSearch} style={{ position: 'relative', maxWidth: '600px', margin: '0 auto 3rem', display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="text"
                            placeholder="Search scholarships (e.g. Master in Engineering USA)..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                borderRadius: '50px',
                                border: '1px solid var(--input-border)',
                                background: 'var(--input-bg)',
                                color: 'var(--foreground)',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ borderRadius: '50px', padding: '0 2rem' }}>
                        {loading ? <Loader2 className="animate-spin" /> : 'Search'}
                    </button>
                </form>

                <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                    <AnimatePresence>
                        {scholarships.map((scholarship: any, index: number) => (
                            <motion.div
                                key={scholarship.title + index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    padding: '2rem',
                                    background: 'var(--card-bg)',
                                    borderRadius: '16px',
                                    border: '1px solid var(--card-border)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--secondary)' }}></div>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{scholarship.title}</h3>

                                <div style={{ display: 'flex', gap: '2rem', color: '#9ca3af', fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <DollarSign size={16} color="var(--success)" />
                                        {scholarship.amount}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={16} color="var(--warning)" />
                                        Deadline: {scholarship.deadline}
                                    </div>
                                </div>

                                <p style={{ lineHeight: '1.6', color: 'var(--foreground)', opacity: 0.8 }}>
                                    {scholarship.description || "Financial aid opportunity to support your studies."}
                                </p>

                                <a
                                    href={scholarship.link || `https://www.google.com/search?q=${scholarship.title}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                    style={{ alignSelf: 'flex-start', marginTop: '1rem' }}
                                >
                                    View & Apply <ExternalLink size={16} style={{ marginLeft: '0.5rem' }} />
                                </a>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {scholarships.length === 0 && (
                    <div className="text-center" style={{ color: '#9ca3af' }}>No scholarships found. Try searching for specific criteria.</div>
                )}
            </div>
        </div>
    );
}
