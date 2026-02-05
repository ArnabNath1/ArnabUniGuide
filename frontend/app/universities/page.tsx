'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '@/lib/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Search, Plus, ExternalLink, School, Check, Loader2 } from 'lucide-react';

interface University {
    name: string;
    country: string;
    web_pages: string[];
    alpha_two_code: string;
}

export default function Universities() {
    const [query, setQuery] = useState('');
    const [universities, setUniversities] = useState<University[]>([]);
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [shortlisting, setShortlisting] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const email = localStorage.getItem('user_email');
            if (!email) return;
            try {
                const res = await api.get(`/profile/${email}`);
                setProfile(res.data);
            } catch (e) {
                console.error("Failed to fetch profile", e);
            }
        };
        fetchProfile();
    }, []);

    const toggleShortlist = async (uniName: string) => {
        if (!profile) {
            toast.info("Onboarding Required", {
                description: "Please complete your profile onboarding before shortlisting universities."
            });
            return;
        }

        const email = localStorage.getItem('user_email');
        if (!email) return;

        setShortlisting(uniName);

        const currentShortlist = profile.shortlisted_universities
            ? profile.shortlisted_universities.split(',').map((s: string) => s.trim()).filter((s: string) => s)
            : [];

        let newShortlist;
        if (currentShortlist.includes(uniName)) {
            newShortlist = currentShortlist.filter((name: string) => name !== uniName);
        } else {
            newShortlist = [...currentShortlist, uniName];
        }

        const updatedProfile = {
            ...profile,
            shortlisted_universities: newShortlist.join(', ')
        };

        try {
            await api.post('/profile/', updatedProfile);
            setProfile(updatedProfile);
            if (currentShortlist.includes(uniName)) {
                toast.success("Removed from Shortlist", {
                    description: `${uniName} has been removed from your list.`
                });
            } else {
                toast.success("Added to Shortlist", {
                    description: `${uniName} is now in your target universities.`
                });
            }
        } catch (e) {
            console.error("Failed to update shortlist", e);
            toast.error("Failed to update shortlist. Please try again.");
        } finally {
            setShortlisting(null);
        }
    };

    const isShortlisted = (uniName: string) => {
        if (!profile?.shortlisted_universities) return false;
        return profile.shortlisted_universities.split(',').map((s: string) => s.trim()).includes(uniName);
    };

    const searchUniversities = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;

        setLoading(true);
        try {
            const response = await api.get(`/universities/search?query=${query}`);
            setUniversities(response.data.slice(0, 50)); // Limit to 50 results
        } catch (error) {
            console.error('Error fetching universities', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 'var(--header-height) 2rem 2rem', minHeight: '100vh', background: 'var(--background)' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h1 className="text-4xl font-bold text-center" style={{ marginBottom: '2rem', marginTop: '2rem' }}>
                    Find Your <span style={{ color: 'var(--primary-light)' }}>Target University</span>
                </h1>

                <form onSubmit={searchUniversities} style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '3rem',
                    maxWidth: '600px',
                    margin: '0 auto 3rem'
                }}>
                    <div style={{ position: 'relative', flexGrow: 1 }}>
                        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="text"
                            placeholder="Search by name (e.g. Oxford, Harvard)..."
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
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ borderRadius: '50px', padding: '0 2rem' }}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                    {universities.map((uni, index) => (
                        <motion.div
                            key={`${uni.name}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            style={{
                                padding: '1.5rem',
                                background: 'var(--card-bg)',
                                borderRadius: '16px',
                                border: '1px solid var(--card-border)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                gap: '1rem'
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                        <School size={20} />
                                    </div>
                                    <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>{uni.country}</span>
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{uni.name}</h3>
                                <a href={uni.web_pages[0]} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    Visit Website <ExternalLink size={12} />
                                </a>
                            </div>

                            <button
                                onClick={() => toggleShortlist(uni.name)}
                                disabled={shortlisting === uni.name}
                                className="btn"
                                style={{
                                    background: isShortlisted(uni.name) ? 'var(--success)' : 'var(--background)',
                                    border: `1px solid ${isShortlisted(uni.name) ? 'var(--success)' : 'var(--primary)'}`,
                                    color: isShortlisted(uni.name) ? 'white' : 'var(--primary)',
                                    width: '100%',
                                    marginTop: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {shortlisting === uni.name ? (
                                    <Loader2 className="animate-spin" size={16} />
                                ) : isShortlisted(uni.name) ? (
                                    <Check size={16} />
                                ) : (
                                    <Plus size={16} />
                                )}
                                {isShortlisted(uni.name) ? 'Shortlisted' : 'Add to Shortlist'}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {!loading && universities.length === 0 && query && (
                    <div className="text-center" style={{ color: '#9ca3af', marginTop: '2rem' }}>No universities found. Try a different search.</div>
                )}
            </div>
        </div >
    );
}
