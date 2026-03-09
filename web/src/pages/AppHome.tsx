import { PenTool, FileText, Sparkles, BookOpen, Mail, FileCode, Plus } from "lucide-react";

const CONTENT_TYPES = [
    { id: "blog", name: "Blog Post", icon: FileText, desc: "SEO-optimized articles", color: "#3B82F6" },
    { id: "email", name: "Email", icon: Mail, desc: "Marketing & outreach", color: "#10B981" },
    { id: "sales", name: "Sales Copy", icon: Sparkles, desc: "Persuasive landing pages", color: "#F59E0B" },
    { id: "book", name: "Book Chapter", icon: BookOpen, desc: "Long-form writing", color: "#8B5CF6" },
    { id: "technical", name: "Technical Docs", icon: FileCode, desc: "API docs & guides", color: "#EF4444" },
];

export default function AppHome() {
    return (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
            {/* Hero */}
            <div style={{
                textAlign: "center", marginBottom: "2rem",
                background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.08))",
                borderRadius: 16, padding: "2.5rem 1.5rem", border: "1px solid rgba(59,130,246,0.2)"
            }}>
                <PenTool size={48} style={{ color: "var(--color-accent)", marginBottom: 12 }} />
                <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 8 }}>WriterIQ</h1>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "1.1rem" }}>
                    AI-powered writing assistant — blogs, emails, sales copy, books, and more
                </p>
                <button style={{
                    marginTop: "1.5rem", padding: "0.75rem 2rem", borderRadius: 10,
                    background: "var(--color-accent)", color: "white", fontWeight: 600,
                    border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: "1rem"
                }}>
                    <Plus size={18} /> New Project
                </button>
            </div>

            {/* Content Types */}
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "1rem" }}>What do you want to write?</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                {CONTENT_TYPES.map(ct => (
                    <div key={ct.id}
                        style={{
                            padding: "1.25rem", borderRadius: 12, background: `${ct.color}08`,
                            border: `1px solid ${ct.color}20`, cursor: "pointer", transition: "transform 0.2s",
                            textAlign: "center"
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                        onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                        <ct.icon size={28} style={{ color: ct.color, marginBottom: 8 }} />
                        <h4 style={{ fontWeight: 600, marginBottom: 4 }}>{ct.name}</h4>
                        <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>{ct.desc}</p>
                    </div>
                ))}
            </div>

            {/* Recent Projects */}
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "1rem" }}>Recent Projects</h2>
            <div style={{
                padding: "2.5rem", textAlign: "center", borderRadius: 14,
                background: "var(--color-surface)", border: "1px solid var(--color-border)",
                color: "var(--color-text-secondary)"
            }}>
                <FileText size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
                <p>No projects yet. Choose a content type above to get started!</p>
            </div>
        </div>
    );
}
