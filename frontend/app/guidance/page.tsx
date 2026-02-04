'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ListChecks, MapPin, University, ArrowRight, Loader2, CheckCircle, Circle } from 'lucide-react';

export default function Guidance() {
    const [checklist, setChecklist] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<any>(null);

    // Dynamic selection from profile
    const selectedCountry = profile?.target_country || "USA";
    const selectedUniversities = profile?.shortlisted_universities
        ? profile.shortlisted_universities.split(',').map((s: string) => s.trim()).filter((s: string) => s)
        : (profile?.target_degree ? [`Top Universities for ${profile.target_degree}`] : ["Harvard University", "Stanford University"]);

    useEffect(() => {
        const fetchProfile = async () => {
            const email = localStorage.getItem('user_email');
            if (!email) return;
            try {
                const res = await api.get(`/profile/${email}`);
                setProfile(res.data);
                if (res.data.checklist) {
                    setChecklist(res.data.checklist);
                }
            } catch (e) {
                console.error("Failed to fetch profile", e);
            }
        };
        fetchProfile();
    }, []);

    const generateGuidance = async () => {
        setLoading(true);
        try {
            const response = await api.post('/counsellor/guidance', {
                universities: selectedUniversities,
                country: selectedCountry
            });

            // The response.data should now be { "University Name": [tasks], "General": [tasks] }
            const data = response.data;
            setChecklist(data);

            // Save to cloud automatically
            if (profile) {
                await api.post('/profile/', {
                    ...profile,
                    checklist: data
                });
            }
            toast.success("Checklist Generated!", {
                description: "Your university-specific roadmap is ready."
            });
        } catch (error) {
            console.error(error);
            toast.error("Generation Failed", {
                description: "We couldn't reach the AI advisor. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleTask = async (uniKey: string, taskIndex: number) => {
        const newChecklist = { ...checklist };
        const tasks = [...newChecklist[uniKey]];
        tasks[taskIndex] = { ...tasks[taskIndex], completed: !tasks[taskIndex].completed };
        newChecklist[uniKey] = tasks;

        setChecklist(newChecklist);

        // Persist completion state to cloud
        if (profile) {
            try {
                await api.post('/profile/', {
                    ...profile,
                    checklist: newChecklist
                });
            } catch (e) {
                console.error("Failed to save checklist state", e);
            }
        }
    };

    return (
        <div style={{ padding: 'var(--header-height) 2rem 2rem', minHeight: '100vh', background: 'var(--background)' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <h1 className="text-4xl font-bold" style={{ marginBottom: '1rem', marginTop: '2rem' }}>Application <span style={{ color: 'var(--primary-light)' }}>Guidance</span></h1>
                <p style={{ color: '#9ca3af', marginBottom: '3rem' }}>AI-generated university-specific checklists for your journey.</p>

                <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--card-border)', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                        <div>
                            <h3 style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Target Country</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}><MapPin size={20} color="var(--primary)" /> {selectedCountry}</div>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Shortlisted Universities</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {selectedUniversities.map((u: string) => (
                                    <div key={u} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}><University size={16} /> {u}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button onClick={generateGuidance} disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                        {loading ? <Loader2 className="animate-spin" /> : <ListChecks size={20} style={{ marginRight: '0.5rem' }} />}
                        {loading ? 'Generating specific checklists...' : 'Generate Checklist'}
                    </button>
                </div>

                {Object.keys(checklist).length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        {Object.entries(checklist).map(([uniName, tasks]: [string, any], groupIndex) => (
                            <div key={uniName}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-light)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                                    <ArrowRight size={20} /> {uniName}
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {tasks.map((item: any, i: number) => (
                                        <motion.div
                                            key={`${uniName}-${i}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            onClick={() => toggleTask(uniName, i)}
                                            style={{
                                                background: 'rgba(255,255,255,0.03)',
                                                padding: '1.5rem',
                                                borderRadius: '12px',
                                                borderLeft: `4px solid ${item.completed ? 'var(--success)' : 'var(--primary)'}`,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '1rem',
                                                transition: 'all 0.3s ease',
                                                opacity: item.completed ? 0.6 : 1
                                            }}
                                        >
                                            <div style={{
                                                marginTop: '0.2rem',
                                                color: item.completed ? 'var(--success)' : '#9ca3af'
                                            }}>
                                                {item.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{
                                                    fontWeight: 'bold',
                                                    marginBottom: '0.5rem',
                                                    textDecoration: item.completed ? 'line-through' : 'none',
                                                    color: item.completed ? '#9ca3af' : 'inherit'
                                                }}>
                                                    {item.task || item.title}
                                                </h3>
                                                <p style={{
                                                    color: '#9ca3af',
                                                    fontSize: '0.9rem',
                                                    textDecoration: item.completed ? 'line-through' : 'none'
                                                }}>
                                                    {item.details || item.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
