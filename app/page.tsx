"use client";

import { useEffect, useState } from "react";

type PollOption = {
  id: string;
  option_text: string;
};

type Poll = {
  id: string;
  question: string;
  poll_options: PollOption[];
};

export default function Home() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selected, setSelected] = useState<string>("");

  async function loadPolls() {
    const res = await fetch("/api/polls");
    const data = await res.json();
    setPolls(data);
  }

  useEffect(() => {
    loadPolls();
  }, []);

  async function vote(pollId: string, optionId: string) {
    await fetch(`/api/polls/${pollId}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        optionId,
        voterId: "raguram",
      }),
    });

    alert("Vote submitted!");
  }

  return (
    <main style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Polls</h1>

      {polls.map((poll) => (
        <div
          key={poll.id}
          style={{
            border: "1px solid gray",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h2>{poll.question}</h2>

          {poll.poll_options.map((option) => (
            <div key={option.id}>
              <label>
                <input
                  type="radio"
                  name={poll.id}
                  value={option.id}
                  onChange={() => setSelected(option.id)}
                />
                {option.option_text}
              </label>
            </div>
          ))}

          <button
            onClick={() => vote(poll.id, selected)}
            style={{
              marginTop: "10px",
              padding: "8px 16px",
            }}
          >
            Vote
          </button>
        </div>
      ))}
    </main>
  );
}