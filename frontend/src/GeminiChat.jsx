// src/GeminiChat.jsx
import { useState } from "react";

const API_BASE = "http://localhost:5000";

export default function GeminiChat() {
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const sendMessage = async (e) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const newHistory = [...history, { role: "user", content: trimmed }];
        setHistory(newHistory);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: trimmed, history: newHistory }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setHistory((h) => [...h, { role: "model", content: data.reply }]);
        } catch (err) {
            console.error(err);
            setHistory((h) => [
                ...h,
                {
                    role: "model",
                    content:
                        "The style assistant hit an API limit, but you can keep swiping outfits while it recovers.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Closed state – pill button matching dark UI
    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                style={{
                    position: "fixed",
                    right: "1.75rem",
                    bottom: "1.75rem",
                    padding: "0.75rem 1.1rem",
                    borderRadius: "999px",
                    border: "1px solid rgba(148, 163, 184, 0.6)",
                    background: "rgba(15, 23, 42, 0.9)", // slate-900
                    color: "#e5e7eb", // gray-200
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    boxShadow: "0 18px 45px rgba(0,0,0,0.6)",
                    backdropFilter: "blur(10px)",
                    cursor: "pointer",
                    zIndex: 50,
                }}
            >
        <span
            style={{
                width: 8,
                height: 8,
                borderRadius: "999px",
                background: "#22c55e", // green-500
            }}
        />
                <span>Style assistant</span>
            </button>
        );
    }

    return (
        <>
            {/* dark backdrop */}
            <div
                onClick={() => setOpen(false)}
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(15,23,42,0.65)", // dark overlay
                    zIndex: 40,
                }}
            />

            {/* chat window */}
            <div
                style={{
                    position: "fixed",
                    right: "1.75rem",
                    bottom: "1.75rem",
                    width: 380,
                    maxHeight: "72vh",
                    background:
                        "radial-gradient(circle at top left, rgba(148,163,184,0.18), transparent 55%), #020617", // near-black
                    borderRadius: 18,
                    border: "1px solid rgba(51,65,85,0.9)",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.9)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    zIndex: 50,
                    color: "#e5e7eb",
                }}
            >
                <div
                    style={{
                        padding: "0.6rem 0.9rem",
                        borderBottom: "1px solid rgba(51,65,85,0.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: "0.85rem",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: "999px",
                    background: "#22c55e",
                }}
            />
                        <span style={{ fontWeight: 600 }}>Style assistant</span>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            fontSize: "1.1rem",
                            color: "#9ca3af",
                        }}
                    >
                        ✕
                    </button>
                </div>

                <div style={{ flex: 1, padding: "0.75rem", overflowY: "auto" }}>
                    {history.length === 0 && (
                        <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                            Ask for outfit ideas, sizing tips, or why this item might fit your style.
                        </p>
                    )}
                    {history.map((m, i) => (
                        <div
                            key={i}
                            style={{
                                marginBottom: "0.45rem",
                                textAlign: m.role === "user" ? "right" : "left",
                            }}
                        >
                            <div
                                style={{
                                    display: "inline-block",
                                    padding: "0.4rem 0.7rem",
                                    borderRadius: 12,
                                    background:
                                        m.role === "user"
                                            ? "linear-gradient(135deg, #22c55e, #4ade80)" // green bubble
                                            : "rgba(15,23,42,0.85)",
                                    color: m.role === "user" ? "#022c22" : "#e5e7eb",
                                    fontSize: "0.8rem",
                                    border:
                                        m.role === "user"
                                            ? "none"
                                            : "1px solid rgba(51,65,85,0.9)",
                                }}
                            >
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                            The assistant is thinking…
                        </p>
                    )}
                </div>

                <form
                    onSubmit={sendMessage}
                    style={{
                        display: "flex",
                        padding: "0.6rem",
                        borderTop: "1px solid rgba(51,65,85,0.9)",
                        background: "rgba(2,6,23,0.9)",
                    }}
                >
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask the style assistant…"
                        style={{
                            flex: 1,
                            padding: "0.45rem 0.55rem",
                            borderRadius: 999,
                            border: "1px solid rgba(51,65,85,0.9)",
                            background: "rgba(15,23,42,0.9)",
                            color: "#e5e7eb",
                            fontSize: "0.8rem",
                            outline: "none",
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        style={{
                            marginLeft: "0.4rem",
                            padding: "0.45rem 0.9rem",
                            borderRadius: 999,
                            border: "none",
                            background:
                                loading || !input.trim()
                                    ? "rgba(55,65,81,0.9)"
                                    : "linear-gradient(135deg, #22c55e, #4ade80)",
                            color: loading || !input.trim() ? "#9ca3af" : "#022c22",
                            fontSize: "0.8rem",
                            cursor: loading || !input.trim() ? "default" : "pointer",
                        }}
                    >
                        Send
                    </button>
                </form>
            </div>
        </>
    );
}
