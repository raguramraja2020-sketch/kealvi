"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function Home() {
  const [session, setSession] = useState<any>(null);
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

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
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

  async function logout() {
    await supabase.auth.signOut();
  }

  if (!session) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(to right, #1e3a8a, #7c3aed, #0f172a)",
          color: "white",
          flexDirection: "column",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "50px",
            marginBottom: "20px",
          }}
        >
          Kealvi Poll App 🔐
        </h1>

        <p
          style={{
            fontSize: "22px",
            marginBottom: "30px",
          }}
        >
          Please login to continue
        </p>

        <a
          href="/login"
          style={{
            padding: "14px 24px",
            background: "#2563eb",
            color: "white",
            textDecoration: "none",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          Go To Login
        </a>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "850px",
        margin: "auto",
        padding: "40px",
        fontFamily: "Arial",
        minHeight: "100vh",
        background: "linear-gradient(to right, #eef2ff, #f8fafc)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            color: "#1e293b",
            fontWeight: "bold",
          }}
        >
          Kealvi Poll App
        </h1>

        <button
          onClick={logout}
          style={{
            padding: "12px 18px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      <p
        style={{
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
            background: "white",
            outline: "none",
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
                onClick={() => votePoll(poll.id, poll.votes)}
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
                  setCommentInputs({
                    ...commentInputs,
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

              <button
                onClick={() => saveComment(poll.id)}
                style={{
                  padding: "10px 16px",
                  background: "#7c3aed",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginBottom: "12px",
                }}
              >
                Save Comment
              </button>

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
                  {poll.comments
                    ? poll.comments
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