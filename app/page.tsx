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
      body: JSON.stringify({
        question,
      }),
    });

    setQuestion("");
    fetchPolls();
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Polls</h1>

      <input
        type="text"
        placeholder="Enter poll question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginRight: "10px",
        }}
      />

      <button
        onClick={createPoll}
        style={{
          padding: "10px 20px",
        }}
      >
        Create Poll
      </button>

      <div style={{ marginTop: "30px" }}>
        {polls.map((poll) => (
          <div
            key={poll.id}
            style={{
              padding: "15px",
              border: "1px solid gray",
              marginBottom: "10px",
            }}
          >
            {poll.question}
          </div>
        ))}
      </div>
    </div>
  );
}