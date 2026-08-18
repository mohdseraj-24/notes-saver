import { useEffect, useState } from 'react';

export default function NoteForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const canSubmit = title.trim() && content.trim();

  // Auto-save after user stops typing for 1 second
  useEffect(() => {
    if (!canSubmit) return;

    const timer = setTimeout(() => {
      onCreate(title.trim(), content.trim());

      setTitle('');
      setContent('');
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, content]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!canSubmit) return;

    onCreate(title.trim(), content.trim());

    setTitle('');
    setContent('');
  }

  return (
    <form className="new-card" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>New note</h2>
        <span>{content.trim().length} characters</span>
      </div>

      <div className="field">
        <label htmlFor="title">Title</label>

        <input
          id="title"
          type="text"
          placeholder="e.g. Grocery list"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="content">Content</label>

        <textarea
          id="content"
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={!canSubmit}>
          Save note
        </button>
      </div>
    </form>
  );
}