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

      // Refresh polls automatically
      fetchPolls();

    } catch (error) {
      console.error("Error creating poll:", error);
    }
  }

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1>Polls</h1>

      <div
        style={{
          marginBottom: "20px",
        }}
      >
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
            cursor: "pointer",
          }}
        >
          Create Poll
        </button>
      </div>

      <div style={{ marginTop: "30px" }}>
        {polls.length === 0 ? (
          <p>No polls available</p>
        ) : (
          polls.map((poll) => (
            <div
              key={poll.id}
              style={{
                padding: "15px",
                border: "1px solid gray",
                marginBottom: "10px",
                borderRadius: "5px",
              }}
            >
              <h3>{poll.question}</h3>
            </div>
          ))
        )}
      </div>
    </div>
  );
}