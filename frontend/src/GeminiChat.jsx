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
                { role: "model", content: "Sorry, something went wrong talking to Gemini." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Just the floating button when closed
    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                style={{
                    position: "fixed",
                    right: "1.5rem",
                    bottom: "1.5rem",
                    padding: "0.75rem 1rem",
                    borderRadius: "999px",
                    border: "none",
                    background: "#111827",
                    color: "white",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                    cursor: "pointer",
                    zIndex: 50,
                }}
            >
                💬 Style assistant
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
                    background: "rgba(0,0,0,0.35)",
                    zIndex: 40,
                }}
            />

            {/* chat window */}
            <div
                style={{
                    position: "fixed",
                    right: "1.5rem",
                    bottom: "1.5rem",
                    width: "360px",
                    maxHeight: "70vh",
                    background: "white",
                    borderRadius: 12,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 50,
                }}
            >
                <div
                    style={{
                        padding: "0.6rem 0.9rem",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <span style={{ fontWeight: 600 }}>Style assistant</span>
                    <button
                        onClick={() => setOpen(false)}
                        style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            fontSize: "1.1rem",
                        }}
                    >
                        ✕
                    </button>
                </div>

                <div style={{ flex: 1, padding: "0.75rem", overflowY: "auto" }}>
                    {history.length === 0 && (
                        <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                            Ask for outfit ideas or why this item might suit you.
                        </p>
                    )}
                    {history.map((m, i) => (
                        <div
                            key={i}
                            style={{
                                marginBottom: "0.4rem",
                                textAlign: m.role === "user" ? "right" : "left",
                            }}
                        >
                            <div
                                style={{
                                    display: "inline-block",
                                    padding: "0.4rem 0.7rem",
                                    borderRadius: 12,
                                    background: m.role === "user" ? "#2563eb" : "#e5e7eb",
                                    color: m.role === "user" ? "#fff" : "#111827",
                                    fontSize: "0.85rem",
                                }}
                            >
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {loading && <p style={{ fontSize: "0.8rem" }}>Gemini is thinking…</p>}
                </div>

                <form
                    onSubmit={sendMessage}
                    style={{
                        display: "flex",
                        padding: "0.6rem",
                        borderTop: "1px solid #e5e7eb",
                    }}
                >
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask the style assistant…"
                        style={{
                            flex: 1,
                            padding: "0.4rem 0.5rem",
                            borderRadius: 6,
                            border: "1px solid #d1d5db",
                            fontSize: "0.85rem",
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        style={{
                            marginLeft: "0.4rem",
                            padding: "0.4rem 0.7rem",
                            borderRadius: 6,
                            border: "none",
                            background: "#111827",
                            color: "white",
                            fontSize: "0.85rem",
                            cursor: "pointer",
                        }}
                    >
                        Send
                    </button>
                </form>
            </div>
        </>
    );
}
