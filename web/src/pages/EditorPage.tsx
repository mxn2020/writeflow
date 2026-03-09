import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ArrowLeft, Loader2, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";

const WRITING_MODES = [
    { id: "blog", label: "Blog Post" }, { id: "email", label: "Email" }, { id: "essay", label: "Essay" },
    { id: "story", label: "Short Story" }, { id: "social", label: "Social Media" }, { id: "cover_letter", label: "Cover Letter" },
    { id: "ad_copy", label: "Ad Copy" }, { id: "speech", label: "Speech" }, { id: "poem", label: "Poem" }, { id: "script", label: "Script" },
];
const TONES = ["professional", "casual", "friendly", "persuasive", "humorous", "formal", "inspirational", "academic"];
const STYLES = ["concise", "detailed", "storytelling", "listicle", "conversational"];

export default function EditorPage() {
    const [prompt, setPrompt] = useState("");
    const [writingMode, setWritingMode] = useState("blog");
    const [tone, setTone] = useState("professional");
    const [style, setStyle] = useState("concise");
    const [extra, setExtra] = useState("");
    const [generating, setGenerating] = useState(false);
    const [result, setResult] = useState<{ content: string; wordCount: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const generate = useAction(api.ai.generate);
    const saveDocument = useMutation(api.functions.saveDocument);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setGenerating(true); setError(null);
        try {
            const res = await generate({ prompt, writingMode, tone, style, additionalInstructions: extra || undefined });
            setResult(res as { content: string; wordCount: number });
            await saveDocument({
                title: prompt.slice(0, 60), writingMode, tone, style, prompt,
                generatedContent: (res as any).content, wordCount: (res as any).wordCount,
            });
        } catch (err) { setError(err instanceof Error ? err.message : "Generation failed"); }
        setGenerating(false);
    };

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(result.content);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
            <Link to="/app" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--color-text-secondary)", textDecoration: "none", marginBottom: "1rem", fontSize: "0.9rem" }}>
                <ArrowLeft size={16} /> Back to Home
            </Link>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>AI Writer</h1>

            {/* Settings */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 500, marginBottom: 4, display: "block" }}>Format</label>
                    <select value={writingMode} onChange={(e) => setWritingMode(e.target.value)}
                        style={{ width: "100%", padding: "0.5rem", borderRadius: 8, background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "inherit" }}>
                        {WRITING_MODES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 500, marginBottom: 4, display: "block" }}>Tone</label>
                    <select value={tone} onChange={(e) => setTone(e.target.value)}
                        style={{ width: "100%", padding: "0.5rem", borderRadius: 8, background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "inherit" }}>
                        {TONES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 500, marginBottom: 4, display: "block" }}>Style</label>
                    <select value={style} onChange={(e) => setStyle(e.target.value)}
                        style={{ width: "100%", padding: "0.5rem", borderRadius: 8, background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "inherit" }}>
                        {STYLES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                </div>
            </div>

            {/* Prompt */}
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="What would you like to write about?"
                rows={4} style={{
                    width: "100%", padding: "0.75rem", borderRadius: 10, background: "var(--color-surface)",
                    border: "1px solid var(--color-border)", resize: "vertical", fontSize: "0.95rem", color: "inherit",
                    fontFamily: "inherit", marginBottom: "0.5rem"
                }} />

            <textarea value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Additional instructions (optional)"
                rows={2} style={{
                    width: "100%", padding: "0.5rem 0.75rem", borderRadius: 10, background: "var(--color-surface)",
                    border: "1px solid var(--color-border)", resize: "vertical", fontSize: "0.85rem", color: "inherit",
                    fontFamily: "inherit", marginBottom: "1rem"
                }} />

            <button onClick={handleGenerate} disabled={generating || !prompt.trim()}
                style={{
                    padding: "0.6rem 2rem", borderRadius: 10, background: "var(--color-accent)",
                    color: "white", fontWeight: 600, border: "none", cursor: generating ? "wait" : "pointer",
                    display: "flex", alignItems: "center", gap: 6, opacity: generating ? 0.7 : 1
                }}>
                {generating ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Generating...</> : "Generate"}
            </button>

            {error && <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444" }}>{error}</div>}

            {result && (
                <div style={{ marginTop: "1.5rem", borderRadius: 14, background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1.25rem", borderBottom: "1px solid var(--color-border)" }}>
                        <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>{result.wordCount} words</span>
                        <button onClick={handleCopy} style={{
                            padding: "0.3rem 1rem", borderRadius: 6, background: "transparent",
                            border: "1px solid var(--color-border)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: "0.85rem", color: "inherit"
                        }}>
                            {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                        </button>
                    </div>
                    <div style={{ padding: "1.25rem", whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: "0.95rem" }}>{result.content}</div>
                </div>
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
    );
}
