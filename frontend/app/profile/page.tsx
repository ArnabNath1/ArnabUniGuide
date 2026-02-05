'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, User, Briefcase, Award, BookOpen, Upload, Loader2, Sparkles, Trash2, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Profile() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        current_degree: '',
        current_university: '',
        gpa: '',
        work_experience: '',
        research_experience: '',
        test_scores: {
            ielts: '',
            toefl: '',
            gre: '',
            gmat: '',
            sat: '',
            act: ''
        },
        skills: '',
        projects: '',
        target_country: '',
        target_degree: '',
        budget: ''
    });

    const [parsing, setParsing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            const email = localStorage.getItem('user_email');
            if (!email) return;

            try {
                const res = await api.get(`/profile/${email}`);
                if (res.data) {
                    setFormData(prev => ({
                        ...prev,
                        ...res.data,
                        test_scores: res.data.test_scores || prev.test_scores
                    }));
                }
            } catch (e) {
                console.error("Failed to fetch profile", e);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent as keyof typeof prev] as object,
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setParsing(true);
        const form = new FormData();
        form.append('file', file);

        try {
            const response = await api.post('/profile/parse-cv', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Merge parsed data with existing data, handling the nested structure
            const parsed = response.data;
            // Filter out empty values so we don't overwrite with blanks
            const cleanParsed: any = {};
            Object.keys(parsed).forEach(key => {
                if (parsed[key] !== "" && parsed[key] !== null && parsed[key] !== undefined) {
                    if (key === 'test_scores') {
                        cleanParsed[key] = {};
                        Object.keys(parsed[key]).forEach(subKey => {
                            if (parsed[key][subKey] !== "") {
                                cleanParsed[key][subKey] = parsed[key][subKey];
                            }
                        });
                    } else {
                        cleanParsed[key] = parsed[key];
                    }
                }
            });

            setFormData(prev => ({
                ...prev,
                ...cleanParsed,
                test_scores: { ...prev.test_scores, ...(cleanParsed.test_scores || {}) }
            }));
            toast.success("CV Parsed Successfully!", {
                description: "Your profile has been autofilled with AI extraction."
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to parse CV. Please ensure it's a valid PDF.");
        } finally {
            setParsing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/profile/', formData);
            toast.success('Profile saved to cloud!', {
                description: 'Your changes are now safe in our secure database.'
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to save profile. Please check your connection.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        setDeleting(true);
        try {
            const email = formData.email || localStorage.getItem('user_email');
            await api.delete(`/profile/${email}`);

            toast.success("Account deleted successfully");

            // Clear all user data
            localStorage.clear();

            // Redirect to home or signup with history replacement
            window.location.replace('/signup');
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete account. Please try again.");
            setDeleting(false);
        }
    };

    const sectionStyle = {
        background: 'var(--card-bg)',
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid var(--card-border)',
        marginBottom: '2rem'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.8rem',
        borderRadius: '8px',
        border: '1px solid var(--input-border)',
        background: 'var(--input-bg)',
        color: 'var(--foreground)',
        marginTop: '0.5rem'
    };

    const labelStyle = { fontSize: '0.9rem', fontWeight: 600, color: '#9ca3af' };

    return (
        <div style={{ padding: 'var(--header-height) 2rem 2rem', minHeight: '100vh', background: 'var(--background)' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <header style={{ marginBottom: '3rem', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="text-4xl font-bold">Your Profile</h1>
                        <p style={{ color: '#9ca3af' }}>Manage your details or autofill with AI.</p>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <input type="file" id="cv-upload" onChange={handleFileUpload} accept=".pdf" style={{ display: 'none' }} />
                        <label htmlFor="cv-upload" className="btn btn-secondary" style={{ cursor: 'pointer', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            {parsing ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} color="var(--primary-light)" />}
                            {parsing ? 'Analyzing CV...' : 'Autofill from CV'}
                        </label>
                    </div>
                </header>

                <form onSubmit={handleSubmit}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={sectionStyle}>
                        <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={20} color="var(--primary-light)" /> Personal Details
                        </h2>
                        <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                            <div><label style={labelStyle}>Full Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} /></div>
                            <div><label style={labelStyle}>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} /></div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={sectionStyle}>
                        <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <BookOpen size={20} color="var(--primary-light)" /> Education & Experience
                        </h2>
                        <div className="grid" style={{ gap: '1rem' }}>
                            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                                <div><label style={labelStyle}>Latest Degree</label><input type="text" name="current_degree" value={formData.current_degree} onChange={handleChange} style={inputStyle} /></div>
                                <div><label style={labelStyle}>University/Institute</label><input type="text" name="current_university" value={formData.current_university} onChange={handleChange} style={inputStyle} /></div>
                            </div>
                            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                                <div><label style={labelStyle}>GPA</label><input type="text" name="gpa" value={formData.gpa} onChange={handleChange} style={inputStyle} /></div>
                                <div><label style={labelStyle}>Work Experience (Years/Roles)</label><input type="text" name="work_experience" value={formData.work_experience} onChange={handleChange} style={inputStyle} /></div>
                            </div>
                            <div><label style={labelStyle}>Research Experience</label><textarea name="research_experience" rows={3} value={formData.research_experience} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical' }} /></div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={sectionStyle}>
                        <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Award size={20} color="var(--primary-light)" /> Test Scores
                        </h2>
                        <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
                            <div><label style={labelStyle}>IELTS</label><input type="text" name="test_scores.ielts" value={formData.test_scores.ielts} onChange={handleChange} style={inputStyle} /></div>
                            <div><label style={labelStyle}>TOEFL</label><input type="text" name="test_scores.toefl" value={formData.test_scores.toefl} onChange={handleChange} style={inputStyle} /></div>
                            <div><label style={labelStyle}>GRE</label><input type="text" name="test_scores.gre" value={formData.test_scores.gre} onChange={handleChange} style={inputStyle} /></div>
                            <div><label style={labelStyle}>GMAT</label><input type="text" name="test_scores.gmat" value={formData.test_scores.gmat} onChange={handleChange} style={inputStyle} /></div>
                            <div><label style={labelStyle}>SAT</label><input type="text" name="test_scores.sat" value={formData.test_scores.sat} onChange={handleChange} style={inputStyle} /></div>
                            <div><label style={labelStyle}>ACT</label><input type="text" name="test_scores.act" value={formData.test_scores.act} onChange={handleChange} style={inputStyle} /></div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={sectionStyle}>
                        <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Briefcase size={20} color="var(--primary-light)" /> Skills & Projects
                        </h2>
                        <div className="grid" style={{ gap: '1rem' }}>
                            <div><label style={labelStyle}>Technical Skills</label><input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. Python, React, Data Analysis" style={inputStyle} /></div>
                            <div><label style={labelStyle}>Key Projects</label><textarea name="projects" rows={4} value={formData.projects} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical' }} /></div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={sectionStyle}>
                        <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <BookOpen size={20} color="var(--primary-light)" /> Study Goals
                        </h2>
                        <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
                            <div><label style={labelStyle}>Target Country</label><input type="text" name="target_country" value={formData.target_country} onChange={handleChange} placeholder="e.g. USA, UK" style={inputStyle} /></div>
                            <div><label style={labelStyle}>Target Degree</label><input type="text" name="target_degree" value={formData.target_degree} onChange={handleChange} placeholder="e.g. MS in CS" style={inputStyle} /></div>
                            <div><label style={labelStyle}>Budget (Annual)</label><input type="text" name="budget" value={formData.budget} onChange={handleChange} placeholder="e.g. $30,000" style={inputStyle} /></div>
                        </div>
                    </motion.div>

                    <button type="submit" className="btn btn-primary" disabled={saving || deleting} style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginBottom: '3rem' }}>
                        {saving ? <Loader2 className="animate-spin" /> : <Save size={20} style={{ marginRight: '0.5rem' }} />} {saving ? 'Saving...' : 'Save Complete Profile'}
                    </button>
                </form>

                <div style={{ height: '1px', background: 'var(--card-border)', margin: '2rem 0' }}></div>

                <div style={{
                    padding: '2rem',
                    borderRadius: '16px',
                    border: '1px solid #7f1d1d',
                    background: 'rgba(127, 29, 29, 0.1)',
                    marginBottom: '4rem'
                }}>
                    <h2 style={{ color: '#ef4444', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertTriangle size={20} /> Danger Zone
                    </h2>
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Once you delete your account, there is no going back. All your data, university shortlists, and chat history will be permanently erased.
                    </p>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        disabled={deleting}
                        style={{
                            background: '#ef4444',
                            color: 'white',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            opacity: deleting ? 0.7 : 1
                        }}
                        className="hover:bg-red-600 transition-colors"
                    >
                        {deleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                        {deleting ? 'Deleting Account...' : 'Delete My Account'}
                    </button>
                </div>

                {/* Custom Delete Confirmation Modal */}
                <AnimatePresence>
                    {showDeleteModal && (
                        <div style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 1000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1rem'
                        }}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowDeleteModal(false)}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'rgba(0,0,0,0.8)',
                                    backdropFilter: 'blur(8px)'
                                }}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                style={{
                                    position: 'relative',
                                    background: 'var(--card-bg)',
                                    border: '1px solid #7f1d1d',
                                    padding: '2.5rem',
                                    borderRadius: '24px',
                                    maxWidth: '450px',
                                    width: '100%',
                                    textAlign: 'center',
                                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                                }}
                            >
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem',
                                    color: '#ef4444'
                                }}>
                                    <AlertTriangle size={36} />
                                </div>
                                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Delete Account?</h1>
                                <p style={{ color: '#9ca3af', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                                    This action is <span style={{ color: '#ef4444', fontWeight: 'bold' }}>permanent</span>. All your university shortlists, application checklists, and AI chat history will be lost forever.
                                </p>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        style={{
                                            flex: 1,
                                            padding: '0.8rem',
                                            borderRadius: '12px',
                                            background: 'rgba(255,255,255,0.05)',
                                            color: 'white',
                                            border: '1px solid var(--card-border)',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                        className="hover:bg-white/10"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            handleDeleteAccount();
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '0.8rem',
                                            borderRadius: '12px',
                                            background: '#ef4444',
                                            color: 'white',
                                            border: 'none',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                        className="hover:bg-red-600"
                                    >
                                        Delete Forever
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    );
}
