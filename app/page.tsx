"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [commentInputs, setCommentInputs] = useState<any>({});
  const [polls, setPolls] = useState<any[]>([]);

  async function fetchPolls() {
    const { data } = await supabase
      .from("polls")
      .select("*")
      .order("id", { ascending: false });

    if (data) {
      setPolls(data);
    }
  }

  useEffect(() => {
    fetchPolls();
  }, []);

  async function createPoll() {
    if (!question) return;

    await supabase.from("polls").insert([
      {
        question,
        votes: 0,
        comments: "",
      },
    ]);

    setQuestion("");
    fetchPolls();
  }

  async function votePoll(id: number, currentVotes: number) {
    await supabase
      .from("polls")
      .update({
        votes: currentVotes + 1,
      })
      .eq("id", id);

    fetchPolls();
  }

  async function deletePoll(id: number) {
    await supabase
      .from("polls")
      .delete()
      .eq("id", id);

    fetchPolls();
  }

  async function saveComment(id: number) {
    await supabase
      .from("polls")
      .update({
        comments: commentInputs[id] || "",
      })
      .eq("id", id);

    fetchPolls();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a, #1e293b, #312e81)",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "850px",
          margin: "auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "white",
            fontSize: "60px",
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          LiveQ/A
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            fontSize: "18px",
            marginBottom: "40px",
          }}
        >
          Create polls, vote instantly, and share opinions live.
        </p>

        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            padding: "20px",
            borderRadius: "20px",
            marginBottom: "35px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            <input
              type="text"
              placeholder="Ask a new question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{
                flex: 1,
                padding: "16px",
                borderRadius: "12px",
                border: "none",
                outline: "none",
                fontSize: "16px",
                background: "white",
              }}
            />

            <button
              onClick={createPoll}
              style={{
                padding: "16px 24px",
                background: "#6366f1",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Create
            </button>
          </div>
        </div>

        <p
          style={{
            color: "#e2e8f0",
            marginBottom: "25px",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          Total Questions: {polls.length}
        </p>

        {polls.map((poll) => (
          <div
            key={poll.id}
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(14px)",
              borderRadius: "20px",
              padding: "25px",
              marginBottom: "25px",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
            }}
          >
            <h2
              style={{
                color: "white",
                marginBottom: "20px",
                fontSize: "28px",
              }}
            >
              {poll.question}
            </h2>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <button
                onClick={() => votePoll(poll.id, poll.votes)}
                style={{
                  padding: "12px 18px",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "15px",
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
                  fontSize: "15px",
                }}
              >
                Delete
              </button>
            </div>

            <div>
              <input
                type="text"
                placeholder="Write your opinion..."
                value={commentInputs[poll.id] || ""}
                onChange={(e) =>
                  setCommentInputs({
                    ...commentInputs,
                    [poll.id]: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "10px",
                  border: "none",
                  outline: "none",
                  marginBottom: "12px",
                  fontSize: "15px",
                }}
              />

              <button
                onClick={() => saveComment(poll.id)}
                style={{
                  padding: "12px 18px",
                  background: "#8b5cf6",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                Save Comment
              </button>

              <div
                style={{
                  background: "rgba(255,255,255,0.08)",
                  padding: "15px",
                  borderRadius: "12px",
                }}
              >
                <p
                  style={{
                    color: "#e2e8f0",
                    margin: 0,
                    fontSize: "15px",
                  }}
                >
                  💬 {poll.comments || "No comments yet"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}