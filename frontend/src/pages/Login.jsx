import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import { login } from '../api';

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const data = await login(
        form.email.trim(),
        form.password
      );

      console.log('LOGIN RESPONSE:', data);

      if (!data || !data.token) {
        throw new Error('Login failed: token not received.');
      }

      // Save authentication
      localStorage.setItem(
        'notes_token',
        data.token
      );

      localStorage.setItem(
        'notes_user',
        JSON.stringify(data.user)
      );

      console.log(
        'TOKEN SAVED:',
        localStorage.getItem('notes_token')
      );

      console.log(
        'USER SAVED:',
        localStorage.getItem('notes_user')
      );

      // Go to notes
      navigate('/notes', {
        replace: true,
      });
    } catch (err) {
      console.error('LOGIN ERROR:', err);

      setError(
        err.message || 'Unable to sign in.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <div className="auth-heading">
        <div className="auth-icon">N</div>

        <p className="eyebrow">
          WELCOME BACK
        </p>

        <h2>
          Sign in to your notes.
        </h2>

        <p>
          Pick up exactly where you left off.
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
                show ? 'text' : 'password'
              }
              placeholder="••••••••"
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
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        <button
          className="auth-submit"
          disabled={loading}
          type="submit"
        >
          {loading
            ? 'Signing in…'
            : 'Sign in'}

          <span>→</span>
        </button>
      </form>

      <p className="auth-switch">
        New here?{' '}
        <Link to="/signup">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}