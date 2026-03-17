import { useState, useEffect } from "react";

type Status = "idle" | "pending" | "success" | "failed";

export default function App() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newId = crypto.randomUUID();
    setJobId(newId);
    setStatus("pending");

    try {
      await fetch("http://localhost:3000/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: newId, email, amount }),
      });
    } catch (err) {
      setStatus("failed");
    }
  };

  useEffect(() => {
    if (!jobId || status !== "pending") return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/form/status/${jobId}`);
        const data = await res.json();
        if (data.status === "success" || data.status === "failed") setStatus(data.status);
      } catch (err) {
        setStatus("failed");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [jobId, status]);

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: "20px" }}> Form</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input style={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required disabled={status === "pending"} />
        <input style={styles.input} type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Amount" required disabled={status === "pending"} />
        <button style={{ ...styles.button, opacity: status === "pending" ? 0.6 : 1 }} type="submit" disabled={status === "pending"}>
          {status === "pending" ? "Processing..." : "Pay Now"}
        </button>
      </form>

     
      {status !== "idle" && (
        <div style={{ ...styles.statusBox, ...statusTheme[status] }}>
          {status === "pending" && <span>⏳ <b>Status:</b> Transaction is processing...</span>}
          {status === "success" && <span>✅ <b>Status:</b> Request Successful!</span>}
          {status === "failed" && <span>❌ <b>Status:</b> Request Failed. Please try again.</span>}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: "350px", margin: "40px auto", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontFamily: "system-ui, sans-serif" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: { padding: "12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "16px" },
  button: { padding: "12px", borderRadius: "6px", border: "none", backgroundColor: "#007bff", color: "white", fontWeight: "bold", cursor: "pointer" },
  statusBox: { marginTop: "20px", padding: "12px", borderRadius: "8px", fontSize: "14px", textAlign: "left" as const },
};

const statusTheme = {
  pending: { backgroundColor: "#fff3cd", color: "#856404", border: "1px solid #ffeeba" },
  success: { backgroundColor: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" },
  failed: { backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" },
  idle: {},
};