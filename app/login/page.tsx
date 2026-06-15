"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../supabase";

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(to right, #1e3a8a, #7c3aed, #0f172a)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(15px)",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "white",
            marginBottom: "10px",
            fontSize: "42px",
            fontWeight: "bold",
          }}
        >
          Kealvi Login
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            marginBottom: "30px",
            fontSize: "16px",
          }}
        >
          Welcome back to Kealvi Poll App 🚀
        </p>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            style: {
              button: {
                background: "#2563eb",
                color: "white",
                borderRadius: "10px",
                height: "45px",
                fontSize: "16px",
                fontWeight: "bold",
              },
              input: {
                borderRadius: "10px",
                height: "45px",
              },
            },
          }}
          providers={[]}
        />
      </div>
    </div>
  );
}