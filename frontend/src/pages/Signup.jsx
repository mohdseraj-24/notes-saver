import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { signup } from "../api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await signup(
        form.name.trim(),
        form.email.trim(),
        form.password
      );

      console.log("SIGNUP RESPONSE:", data);

      if (!data || !data.token) {
        throw new Error(
          "Signup failed: token not received."
        );
      }

      // Save authentication
      localStorage.setItem(
        "notes_token",
        data.token
      );

      localStorage.setItem(
        "notes_user",
        JSON.stringify(data.user)
      );

      console.log(
        "TOKEN SAVED:",
        localStorage.getItem("notes_token")
      );

      console.log(
        "USER SAVED:",
        localStorage.getItem("notes_user")
      );

      // Go directly to Notes
      navigate("/notes", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "SIGNUP ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <div className="auth-heading">
        <div className="auth-icon">
          N
        </div>

        <p className="eyebrow">
          START FRESH
        </p>

        <h2>
          Create your account.
        </h2>

        <p>
          A quieter, smarter home
          for your thoughts.
        </p>
      </div>

      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      <form
        className="auth-form"
        onSubmit={submit}
      >
        <label>
          Your name

          <input
            type="text"
            placeholder="Your name"
            required
            minLength={2}
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />
        </label>

        <label>
          Email address

          <input
            type="email"
            placeholder="you@example.com"
            required
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />
        </label>

        <label>
          Password

          <div className="password-field">
            <input
              type={
                show
                  ? "text"
                  : "password"
              }
              placeholder="Minimum 6 characters"
              minLength={6}
              required
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />

            <button
              type="button"
              onClick={() =>
                setShow(!show)
              }
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <button
          className="auth-submit"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating…"
            : "Create account"}

          <span>→</span>
        </button>
      </form>

      <p className="auth-switch">
        Already have an account?{" "}
        <Link to="/login">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}