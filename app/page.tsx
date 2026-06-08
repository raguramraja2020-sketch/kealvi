"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [polls, setPolls] = useState<any[]>([]);

  async function fetchPolls() {
    const res = await fetch("/api/polls");
    const data = await res.json();
    setPolls(data);
  }

  useEffect(() => {
    fetchPolls();
  }, []);

  async function createPoll() {
    if (!question) return;

    await fetch("/api/polls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    setQuestion("");
    fetchPolls();
  }

  async function votePoll(id: string) {
    await fetch(`/api/polls/${id}/vote`, {
      method: "POST",
    });

    fetchPolls();
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "auto",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "50px",
        }}
      >
        Poll App
      </h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Enter poll question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={createPoll}
          style={{
            padding: "12px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Create Poll
        </button>
      </div>

      {polls.map((poll) => (
        <div
          key={poll.id}
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h3>{poll.question}</h3>

          <button
            onClick={() => votePoll(poll.id)}
            style={{
              marginTop: "10px",
              padding: "10px 15px",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            👍 Vote ({poll.votes || 0})
          </button>
        </div>
      ))}
    </div>
  );
}