import { useState, useCallback } from 'react';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { FileText, Star, Trash2, Clock, ChevronDown } from 'lucide-react';

const MODES = [
    { value: 'blog', label: '📝 Blog Post' },
    { value: 'email', label: '📧 Email' },
    { value: 'essay', label: '📄 Essay' },
    { value: 'story', label: '📖 Story' },
    { value: 'social', label: '📱 Social Media' },
    { value: 'cover_letter', label: '💼 Cover Letter' },
    { value: 'ad_copy', label: '📢 Ad Copy' },
    { value: 'speech', label: '🎤 Speech' },
    { value: 'poem', label: '🎭 Poem' },
    { value: 'script', label: '🎬 Script' },
];

const TONES = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'persuasive', label: 'Persuasive' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'formal', label: 'Formal' },
    { value: 'inspirational', label: 'Inspirational' },
    { value: 'academic', label: 'Academic' },
];

const STYLES = [
    { value: '', label: 'Auto' },
    { value: 'concise', label: 'Concise' },
    { value: 'detailed', label: 'Detailed' },
    { value: 'storytelling', label: 'Storytelling' },
    { value: 'listicle', label: 'Listicle' },
    { value: 'conversational', label: 'Conversational' },
];

type Tab = 'writer' | 'history';

export default function AppHome() {
    const [tab, setTab] = useState<Tab>('writer');
    const [prompt, setPrompt] = useState('');
    const [mode, setMode] = useState('blog');
    const [tone, setTone] = useState('professional');
    const [style, setStyle] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const generate = useAction(api.ai.generate);
    const saveDoc = useMutation(api.functions.saveDocument);
    const docs = useQuery(api.functions.getRecentDocuments);
    const toggleFav = useMutation(api.functions.toggleFavorite);
    const deleteDoc = useMutation(api.functions.deleteDocument);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const r = await generate({ prompt, writingMode: mode, tone, style: style || undefined });
            setResult(r.content);
            const modeLabel = MODES.find(m => m.value === mode)?.label || mode;
            await saveDoc({
                title: `${modeLabel} — ${prompt.slice(0, 50)}`,
                writingMode: mode,
                tone,
                style: style || undefined,
                prompt,
                generatedContent: r.content,
                wordCount: r.wordCount,
            });
        } catch (e: any) {
            setError(e.message || 'Generation failed');
        } finally {
            setLoading(false);
        }
    }, [prompt, mode, tone, style, generate, saveDoc]);

    return (
        <div className="roomiq-page animate-fade-in">
            {/* Tab Bar */}
            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)', justifyContent: 'center' }}>
                <button className={`btn ${tab === 'writer' ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setTab('writer')}>
                    <FileText size={16} /> Writer
                </button>
                <button className={`btn ${tab === 'history' ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setTab('history')}>
                    <Clock size={16} /> History
                </button>
            </div>

            {tab === 'writer' ? (
                <div style={{ maxWidth: 680, margin: '0 auto' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
                        Write <span style={{ color: 'var(--color-accent)' }}>Anything</span>
                    </h1>
                    <p style={{ textAlign: 'center', color: 'var(--color-smoke-gray)', marginBottom: 'var(--space-xl)', lineHeight: 1.7 }}>
                        Choose your format, tone, and style — then let AI craft publication-ready content.
                    </p>

                    <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                        {/* Mode / Tone / Style selectors */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-smoke-gray)', marginBottom: 'var(--space-xs)', display: 'block' }}>Format</label>
                                <div style={{ position: 'relative' }}>
                                    <select value={mode} onChange={e => setMode(e.target.value)} style={{ width: '100%', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'rgba(10,10,10,0.6)', color: 'var(--color-ice-white)', fontFamily: 'inherit', fontSize: '0.9rem', appearance: 'none', cursor: 'pointer' }}>
                                        {MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                    </select>
                                    <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-smoke-gray)' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-smoke-gray)', marginBottom: 'var(--space-xs)', display: 'block' }}>Tone</label>
                                <div style={{ position: 'relative' }}>
                                    <select value={tone} onChange={e => setTone(e.target.value)} style={{ width: '100%', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'rgba(10,10,10,0.6)', color: 'var(--color-ice-white)', fontFamily: 'inherit', fontSize: '0.9rem', appearance: 'none', cursor: 'pointer' }}>
                                        {TONES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                    </select>
                                    <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-smoke-gray)' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-smoke-gray)', marginBottom: 'var(--space-xs)', display: 'block' }}>Style</label>
                                <div style={{ position: 'relative' }}>
                                    <select value={style} onChange={e => setStyle(e.target.value)} style={{ width: '100%', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'rgba(10,10,10,0.6)', color: 'var(--color-ice-white)', fontFamily: 'inherit', fontSize: '0.9rem', appearance: 'none', cursor: 'pointer' }}>
                                        {STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                    </select>
                                    <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-smoke-gray)' }} />
                                </div>
                            </div>
                        </div>

                        {/* Prompt */}
                        <textarea
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder="Describe what you want to write… (e.g. 'A blog post about the future of remote work')"
                            rows={4}
                            style={{ width: '100%', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'rgba(10,10,10,0.6)', color: 'var(--color-ice-white)', fontFamily: 'inherit', fontSize: '1rem', resize: 'vertical', outline: 'none' }}
                        />

                        <div style={{ marginTop: 'var(--space-md)', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn btn--primary" disabled={!prompt.trim() || loading} onClick={handleGenerate}>
                                {loading ? '⏳ Generating…' : '✍️ Generate'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="card" style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', marginBottom: 'var(--space-lg)' }}>
                            <p style={{ color: 'var(--color-hot-red)', fontSize: '0.9rem' }}>⚠️ {error}</p>
                        </div>
                    )}

                    {result && (
                        <div className="card animate-fade-in">
                            <h3 style={{ marginBottom: 'var(--space-md)' }}>Generated Content</h3>
                            <div style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--color-smoke-gray)', whiteSpace: 'pre-wrap' }}>
                                {result}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* History Tab */
                <div style={{ maxWidth: 680, margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                        Your <span style={{ color: 'var(--color-accent)' }}>Documents</span>
                    </h2>

                    {!docs ? (
                        <p style={{ textAlign: 'center', color: 'var(--color-smoke-gray)' }}>Loading…</p>
                    ) : docs.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
                            <FileText size={40} style={{ color: 'var(--color-smoke-gray)', marginBottom: 'var(--space-md)' }} />
                            <p style={{ color: 'var(--color-smoke-gray)' }}>No documents yet. Start writing!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                            {docs.map((doc: any) => (
                                <div key={doc._id} className="card" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, marginBottom: 2 }}>{doc.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-smoke-gray)' }}>
                                                {doc.writingMode} • {doc.tone} • {doc.wordCount} words • {new Date(doc.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                                            <button className="btn btn--ghost" onClick={() => toggleFav({ id: doc._id })} title={doc.isFavorite ? 'Unfavorite' : 'Favorite'}>
                                                <Star size={16} fill={doc.isFavorite ? 'var(--color-warm-amber)' : 'none'} color={doc.isFavorite ? 'var(--color-warm-amber)' : 'var(--color-smoke-gray)'} />
                                            </button>
                                            <button className="btn btn--ghost" onClick={() => deleteDoc({ id: doc._id })} title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
