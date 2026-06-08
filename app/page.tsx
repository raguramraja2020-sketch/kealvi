"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [polls, setPolls] = useState<any[]>([]);

  async function fetchPolls() {
    try {
      const res = await fetch("/api/polls");
      const data = await res.json();

      if (Array.isArray(data)) {
        setPolls(data);
      }
    } catch (error) {
      console.error("Error fetching polls:", error);
    }
  }

  useEffect(() => {
    fetchPolls();
  }, []);

  async function createPoll() {
    if (!question) return;

    try {
      await fetch("/api/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

      setQuestion("");

      fetchPolls();

    } catch (error) {
      console.error("Error creating poll:", error);
    }
  }

  async function votePoll(id: string) {
    try {
      await fetch(`/api/polls/${id}/vote`, {
        method: "POST",
      });

      fetchPolls();

    } catch (error) {
      console.error("Error voting:", error);
    }
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
          fontSize: "36px",
          marginBottom: "30px",
          color: "#1e293b",
          textAlign: "center",
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
            padding: "12px",
            flex: 1,
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />

        <button
          onClick={createPoll}
          style={{
            padding: "12px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "15px",
          }}
        >
          Create Poll
        </button>
      </div>

      <div>
        {polls.length === 0 ? (
          <p>No polls available</p>
        ) : (
          polls.map((poll) => (
            <div
              key={poll.id}
              style={{
                padding: "20px",
                border: "1px solid #ddd",
                marginBottom: "15px",
                borderRadius: "12px",
                background: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <h3
                style={{
                  marginBottom: "15px",
                  color: "#111827",
                }}
              >
                {poll.question}
              </h3>

              <button
                onClick={() => votePoll(poll.id)}
                style={{
                  padding: "10px 16px",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                👍 Vote ({poll.votes || 0})
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}