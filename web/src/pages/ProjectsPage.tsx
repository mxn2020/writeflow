import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { FileText, Star, Trash2, ArrowLeft, Clock, Plus } from "lucide-react";
import type { Id } from "../../convex/_generated/dataModel";

export default function ProjectsPage() {
    const docs = useQuery(api.functions.getRecentDocuments);
    const toggleFavorite = useMutation(api.functions.toggleFavorite);
    const deleteDocument = useMutation(api.functions.deleteDocument);

    return (
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
            <Link to="/app" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--color-text-secondary)", textDecoration: "none", marginBottom: "1rem", fontSize: "0.9rem" }}>
                <ArrowLeft size={16} /> Back to Home
            </Link>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>My Projects</h1>
                <Link to="/editor" style={{
                    padding: "0.5rem 1.25rem", borderRadius: 8, background: "var(--color-accent)",
                    color: "white", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6
                }}>
                    <Plus size={16} /> New
                </Link>
            </div>

            {!docs ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-secondary)" }}>Loading...</div>
            ) : docs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", borderRadius: 14, background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                    <FileText size={40} style={{ color: "var(--color-text-secondary)", marginBottom: 12 }} />
                    <p style={{ color: "var(--color-text-secondary)", marginBottom: 16 }}>No projects yet.</p>
                    <Link to="/editor" style={{ padding: "0.5rem 1.5rem", borderRadius: 8, background: "var(--color-accent)", color: "white", fontWeight: 600, textDecoration: "none" }}>
                        Create your first project
                    </Link>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {docs.map((doc: any) => (
                        <div key={doc._id} style={{
                            padding: "1rem 1.25rem", borderRadius: 12, background: "var(--color-surface)",
                            border: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center"
                        }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</div>
                                <div style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", marginTop: 2, display: "flex", gap: 12 }}>
                                    <span>{doc.writingMode}</span>
                                    <span>{doc.wordCount} words</span>
                                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {new Date(doc.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button onClick={() => toggleFavorite({ id: doc._id as Id<"documents"> })}
                                    style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, color: doc.isFavorite ? "#F59E0B" : "var(--color-text-secondary)" }}>
                                    <Star size={18} fill={doc.isFavorite ? "#F59E0B" : "none"} />
                                </button>
                                <button onClick={() => { if (confirm("Delete this document?")) deleteDocument({ id: doc._id as Id<"documents"> }); }}
                                    style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, color: "var(--color-text-secondary)" }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
