import React from "react";
import AuthForm from "../../COMPONENTS/AuthForm/AuthForm";

export default function Login() {
  return (
    <div
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <AuthForm />
    </div>
  );
}
