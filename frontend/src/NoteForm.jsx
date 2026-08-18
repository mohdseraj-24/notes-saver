import { useState } from 'react';

export default function NoteForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const canSubmit = title.trim().length > 0 && content.trim().length > 0;

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
        <span>{content.length} characters</span>
      </div>

      <div className="field">
        <label htmlFor="title">Title</label>

        <input
          id="title"
          name="title"
          type="text"
          placeholder="e.g. Grocery list"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoComplete="off"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="content">Content</label>

        <textarea
          id="content"
          name="content"
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="6"
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