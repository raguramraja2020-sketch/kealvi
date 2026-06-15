"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [polls, setPolls] = useState<any[]>([]);
  const [comments, setComments] = useState<any>({});

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
      const newPoll = {
        id: Date.now().toString(),
        question: question,
        votes: 0,
      };

      setPolls([newPoll, ...polls]);

      setQuestion("");

    } catch (error) {
      console.error("Error creating poll:", error);
    }
  }

  async function votePoll(id: string) {
    try {
      const updatedPolls = polls.map((poll) => {
        if (poll.id === id) {
          return {
            ...poll,
            votes: (poll.votes || 0) + 1,
          };
        }

        return poll;
      });

      setPolls(updatedPolls);

    } catch (error) {
      console.error("Error voting:", error);
    }
  }

  function deletePoll(id: string) {
    const updatedPolls = polls.filter((poll) => poll.id !== id);
    setPolls(updatedPolls);
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "auto",
        padding: "40px",
        fontFamily: "Arial",
        minHeight: "100vh",
        background: "linear-gradient(to right, #eef2ff, #f8fafc)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "52px",
          color: "#1e293b",
          fontWeight: "bold",
        }}
      >
        Kealvi Poll App
      </h1>

      <p
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "#475569",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        Total Polls: {polls.length}
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "35px",
        }}
      >
        <input
          type="text"
          placeholder="Enter poll question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{
            flex: 1,
            padding: "15px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            fontSize: "16px",
            outline: "none",
            background: "white",
          }}
        />

        <button
          onClick={createPoll}
          style={{
            padding: "15px 24px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Create Poll
        </button>
      </div>

      {polls.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: "#64748b",
          }}
        >
          No polls available
        </p>
      ) : (
        polls.map((poll) => (
          <div
            key={poll.id}
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "16px",
              marginBottom: "25px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <h3
              style={{
                marginBottom: "20px",
                color: "#111827",
                fontSize: "28px",
                fontWeight: "600",
              }}
            >
              {poll.question}
            </h3>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <button
                onClick={() => votePoll(poll.id)}
                style={{
                  padding: "12px 18px",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                👍 Vote ({poll.votes || 0})
              </button>

              <button
                onClick={() => deletePoll(poll.id)}
                style={{
                  padding: "12px 18px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Delete
              </button>
            </div>

            <div
              style={{
                marginTop: "10px",
              }}
            >
              <input
                type="text"
                placeholder="Write a comment..."
                onChange={(e) =>
                  setComments({
                    ...comments,
                    [poll.id]: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  marginBottom: "12px",
                  fontSize: "15px",
                }}
              />

              <div
                style={{
                  background: "#f8fafc",
                  padding: "12px",
                  borderRadius: "10px",
                }}
              >
                <p
                  style={{
                    color: "#334155",
                    fontSize: "15px",
                    margin: 0,
                  }}
                >
                  💬 Comment:{" "}
                  {comments[poll.id]
                    ? comments[poll.id]
                    : "No comments yet"}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}