'use client';

import { useState, useRef, useEffect } from 'react';
import api from '@/lib/api';
import { Send, User, Bot, Loader2, MessageSquare, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatSession {
    id: string;
    title: string;
    created_at: string;
}

export default function Dashboard() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I am your AI Study Abroad Counsellor. How can I help you today? I can guide you on dream universities, profile improvement, or scholarship opportunities.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const email = localStorage.getItem('user_email');
        if (!email) return;

        const fetchData = async () => {
            try {
                const [profileRes, sessionsRes] = await Promise.all([
                    api.get(`/profile/${email}`),
                    api.get(`/counsellor/sessions/${email}`)
                ]);
                setProfile(profileRes.data);
                setSessions(sessionsRes.data || []);
            } catch (e) {
                console.error("Failed to fetch initial data", e);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const loadSession = async (sessionId: string) => {
        setLoading(true);
        try {
            const res = await api.get(`/counsellor/session/${sessionId}`);
            setMessages(res.data.messages);
            setActiveSessionId(sessionId);
        } catch (e) {
            console.error("Failed to load session", e);
        } finally {
            setLoading(false);
        }
    };

    const startNewChat = () => {
        setActiveSessionId(null);
        setMessages([
            { role: 'assistant', content: 'Hello! I am your AI Study Abroad Counsellor. How can I help you today? I can guide you on dream universities, profile improvement, or scholarship opportunities.' }
        ]);
        setInput('');
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input;
        const email = localStorage.getItem('user_email');

        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            const userProfile = profile
                ? `Name: ${profile.name}, Current Degree: ${profile.current_degree}, University: ${profile.current_university}, GPA: ${profile.gpa}, Interests: ${profile.target_degree} in ${profile.target_country}, Shortlisted Universities: ${profile.shortlisted_universities}, Skills: ${profile.skills}, Projects: ${profile.projects}, Budget: ${profile.budget}, Work Exp: ${profile.work_experience}`
                : "No profile data available yet.";

            const response = await api.post('/counsellor/chat', {
                user_email: email,
                user_profile: userProfile,
                message: userMessage,
                session_id: activeSessionId
            });

            setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);

            if (!activeSessionId) {
                setActiveSessionId(response.data.session_id);
                // Refresh sessions list
                const sessionsRes = await api.get(`/counsellor/sessions/${email}`);
                setSessions(sessionsRes.data || []);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to the server. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    const sidebarStyle = {
        width: sidebarOpen ? '300px' : '0',
        background: 'var(--card-bg)',
        borderRight: '1px solid var(--card-border)',
        height: '100%',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column' as const,
        position: 'relative' as const,
        zIndex: 10,
    };

    return (
        <div style={{ padding: 'var(--header-height) 0 0', height: '100vh', display: 'flex', background: 'var(--background)' }}>
            {/* Sidebar */}
            <div style={sidebarStyle}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--card-border)' }}>
                    <button
                        onClick={startNewChat}
                        className="btn btn-primary"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderRadius: '12px' }}
                    >
                        <Plus size={18} /> New Chat
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 'bold', marginBottom: '0.5rem', paddingLeft: '0.5rem', letterSpacing: '0.05em' }}>RECENT CONVERSATIONS</p>
                    {sessions.map((session) => (
                        <button
                            key={session.id}
                            onClick={() => loadSession(session.id)}
                            style={{
                                textAlign: 'left',
                                padding: '0.8rem',
                                borderRadius: '12px',
                                background: activeSessionId === session.id ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                                border: '1px solid ' + (activeSessionId === session.id ? 'var(--primary)' : 'transparent'),
                                color: activeSessionId === session.id ? 'var(--primary-light)' : '#9ca3af',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.7rem',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                            className="hover:bg-white hover:bg-opacity-5"
                        >
                            <MessageSquare size={16} style={{ flexShrink: 0 }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.title}</span>
                        </button>
                    ))}
                    {sessions.length === 0 && (
                        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#4b5563', fontSize: '0.85rem' }}>
                            Your chat history will appear here.
                        </div>
                    )}
                </div>
            </div>

            {/* Toggle Sidebar Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                    position: 'absolute',
                    left: sidebarOpen ? '280px' : '10px',
                    top: 'calc(var(--header-height) + 1.2rem)',
                    zIndex: 100,
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}
            >
                {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>

            {/* Main Chat Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 2rem 2rem', position: 'relative' }}>
                <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '850px', margin: '0 auto' }}>
                    <header style={{ marginBottom: '1rem', marginTop: '1rem', textAlign: 'center' }}>
                        <h1 className="text-2xl font-bold">AI Counsellor Chat</h1>
                        {activeSessionId && <p style={{ color: 'var(--primary-light)', fontSize: '0.85rem', fontWeight: 500 }}>Previous session active</p>}
                    </header>

                    <div
                        ref={scrollRef}
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '1.5rem',
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '24px',
                            border: '1px solid var(--card-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem',
                            marginBottom: '1.5rem',
                            scrollbarWidth: 'thin',
                            scrollBehavior: 'smooth'
                        }}
                    >
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%',
                                    display: 'flex',
                                    gap: '1rem',
                                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    background: msg.role === 'user' ? 'var(--primary)' : 'var(--secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                                </div>
                                <div style={{
                                    padding: '1.2rem',
                                    borderRadius: '18px',
                                    background: msg.role === 'user' ? 'var(--primary)' : 'var(--card-bg)',
                                    color: msg.role === 'user' ? 'white' : 'var(--foreground)',
                                    border: msg.role === 'assistant' ? '1px solid var(--card-border)' : 'none',
                                    lineHeight: '1.6',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                }}>
                                    {msg.content.split('\n').map((line, i) => (
                                        <p key={i} style={{ marginBottom: i === msg.content.split('\n').length - 1 ? 0 : '0.8rem' }}>{line}</p>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Bot size={20} />
                                </div>
                                <div style={{ padding: '0.8rem 1.5rem', background: 'var(--card-bg)', borderRadius: '18px', border: '1px solid var(--card-border)' }}>
                                    <Loader2 className="animate-spin" size={24} />
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <form onSubmit={sendMessage} style={{ position: 'relative' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything about your study abroad journey..."
                            style={{
                                width: '100%',
                                padding: '1.5rem 4.5rem 1.5rem 2rem',
                                borderRadius: '30px',
                                border: '1px solid var(--card-border)',
                                background: 'var(--card-bg)',
                                color: 'var(--foreground)',
                                fontSize: '1.1rem',
                                outline: 'none',
                                boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                                transition: 'all 0.3s ease'
                            }}
                            className="focus:border-primary"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            style={{
                                position: 'absolute',
                                right: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                opacity: loading || !input.trim() ? 0.5 : 1,
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                            }}
                            className="hover:scale-105 active:scale-95"
                        >
                            <Send size={22} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
