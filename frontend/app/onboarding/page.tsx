'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, FileText, Check, Loader2, User, BookOpen, Globe, DollarSign } from 'lucide-react';

export default function Onboarding() {
    const router = useRouter();
    const [step, setStep] = useState<'selection' | 'form'>('selection');
    const [parsing, setParsing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        current_degree: '', // Mandatory
        current_university: '', // Mandatory
        gpa: '',
        work_experience: '',
        research_experience: '',
        test_scores: { ielts: '', toefl: '', gre: '', gmat: '', sat: '', act: '' },
        skills: '',
        projects: '',
        target_country: '', // Mandatory
        target_degree: '', // Mandatory
        budget: '' // Mandatory
    });

    useEffect(() => {
        // Get data stored during signup
        const storedEmail = localStorage.getItem('user_email');
        const storedName = localStorage.getItem('user_name');

        if (storedEmail || storedName) {
            setFormData(prev => ({
                ...prev,
                email: storedEmail || prev.email,
                name: storedName || prev.name
            }));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Handle nested test_scores if necessary (though not mandatory here)
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
            // Merge parsed data
            const parsed = response.data;
            setFormData(prev => ({
                ...prev,
                ...parsed,
                email: parsed.email || prev.email || 'user@example.com', // Fallback for demo
                test_scores: { ...prev.test_scores, ...(parsed.test_scores || {}) }
            }));
            toast.success("CV Parsed Successfully!", {
                description: "Review and complete any remaining fields."
            });
            setStep('form');
        } catch (error) {
            console.error(error);
            toast.error("Failed to parse CV. Please fill details manually.");
            setStep('form');
        } finally {
            setParsing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Basic validation for mandatory fields
        if (!formData.current_degree || !formData.current_university || !formData.target_country || !formData.target_degree || !formData.budget || !formData.email) {
            toast.warning("Incomplete Form", {
                description: "Please fill all mandatory fields to proceed."
            });
            setSaving(false);
            return;
        }

        try {
            await api.post('/profile/', formData);
            if (formData.email) {
                localStorage.setItem('user_email', formData.email);
            }
            toast.success("Welcome aboard!", {
                description: "Your academic profile has been created successfully."
            });
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            toast.error("Failed to save profile. Please check all fields.");
        } finally {
            setSaving(false);
        }
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
    const cardStyle = {
        background: 'var(--card-bg)',
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid var(--card-border)',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: '1rem',
        textAlign: 'center' as const
    };

    return (
        <div style={{ padding: '2rem', minHeight: '100vh', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="container" style={{ maxWidth: '800px' }}>

                {step === 'selection' && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <h1 className="text-4xl font-bold text-center" style={{ marginBottom: '1rem' }}>Welcome to UniGuide!</h1>
                        <p className="text-center" style={{ color: '#9ca3af', marginBottom: '3rem' }}>Let's set up your profile to get personalized recommendations.</p>

                        <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
                            {/* Manual Option */}
                            <div style={cardStyle} onClick={() => setStep('form')} className="hover:scale-105">
                                <div style={{ width: '60px', height: '60px', background: 'var(--secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FileText size={32} />
                                </div>
                                <h3 className="text-xl font-bold">Fill Manually</h3>
                                <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Enter your details step-by-step.</p>
                            </div>

                            {/* CV Upload Option */}
                            <div style={{ position: 'relative', height: '100%' }}>
                                {/* Hidden Input */}
                                <input
                                    type="file"
                                    id="cv-upload-onboarding"
                                    onChange={handleFileUpload}
                                    accept=".pdf"
                                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }}
                                    disabled={parsing}
                                />
                                <div style={{ ...cardStyle, height: '100%', opacity: parsing ? 0.7 : 1 }} className="hover:scale-105">
                                    <div style={{ width: '60px', height: '60px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {parsing ? <Loader2 className="animate-spin" size={32} /> : <Upload size={32} />}
                                    </div>
                                    <h3 className="text-xl font-bold">{parsing ? 'Parsing...' : 'Upload Academic CV'}</h3>
                                    <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Autofill your profile instantly with AI.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 'form' && (
                    <motion.form
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onSubmit={handleSubmit}
                        style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--card-border)' }}
                    >
                        <h2 className="text-2xl font-bold" style={{ marginBottom: '2rem', textAlign: 'center' }}>Complete Your Profile</h2>

                        <div className="grid grid-cols-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
                            {/* Mandatory Fields */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <BookOpen size={18} /> Education & Goals (Mandatory)
                                </h3>
                            </div>

                            <div>
                                <label style={labelStyle}>Current/Latest Degree *</label>
                                <input
                                    type="text"
                                    name="current_degree"
                                    value={formData.current_degree}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. B.Tech Computer Science"
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>University/Institute *</label>
                                <input
                                    type="text"
                                    name="current_university"
                                    value={formData.current_university}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. IIT Delhi"
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Target Degree *</label>
                                <input
                                    type="text"
                                    name="target_degree"
                                    value={formData.target_degree}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Masters in AI"
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Target Country *</label>
                                <input
                                    type="text"
                                    name="target_country"
                                    value={formData.target_country}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. USA, Germany"
                                    style={inputStyle}
                                />
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Budget (Annual - USD) *</label>
                                <select
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    required
                                    style={{ ...inputStyle, cursor: 'pointer', marginTop: '0.5rem' }}
                                >
                                    <option value="" disabled>Select your budget</option>
                                    <option value="Dependent on Scholarships">Dependent on Scholarships</option>
                                    <option value="10000">10,000 USD</option>
                                    <option value="20000">20,000 USD</option>
                                    <option value="30000">30,000 USD</option>
                                    <option value="50000+">50,000+ USD</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ height: '1px', background: 'var(--card-border)', margin: '2rem 0' }}></div>

                        {/* Optional Fields Preview - Just simple inputs to fill if they want, or skip */}
                        <div className="grid grid-cols-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <User size={18} /> Basic Details (Optional)
                                </h3>
                            </div>
                            <div>
                                <label style={labelStyle}>Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>GPA / Percentage</label>
                                <input type="text" name="gpa" value={formData.gpa} onChange={handleChange} style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            {/* Back button if user came from CV choice and wants to re-upload could be added, but keeping simple */}
                            <button
                                type="button"
                                onClick={() => handleSubmit as any} // Just a visual skip? No, mandatory fields required.
                                className="btn"
                                style={{ color: '#9ca3af' }}
                            >
                                Fill more later in Profile
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                                style={{ padding: '0.8rem 2rem' }}
                            >
                                {saving ? <Loader2 className="animate-spin" /> : <Check size={20} style={{ marginRight: '0.5rem' }} />}
                                {saving ? 'Creating Profile...' : 'Complete Onboarding'}
                            </button>
                        </div>
                    </motion.form>
                )}

            </div>
        </div>
    );
}
