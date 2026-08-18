import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../api";

export default function Notes() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("notes_user") || "{}"
  );

  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  // =========================
  // LOAD NOTES
  // =========================

  async function load() {
    try {
      setStatus("Loading notes...");

      const data = await getNotes();

      setNotes(Array.isArray(data) ? data : []);

      setSelected((current) => {
        if (current && current._id) {
          return (
            data.find(
              (note) => note._id === current._id
            ) || null
          );
        }

        return data[0] || null;
      });

      setStatus("");
    } catch (error) {
      console.error("Failed to load notes:", error);

      /*
       * IMPORTANT:
       * Do NOT logout the user for every error.
       *
       * Only logout if the server says the token
       * is invalid or unauthorized.
       */

      if (
        error.status === 401 ||
        error.status === 403
      ) {
        localStorage.removeItem("notes_token");
        localStorage.removeItem("notes_user");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      setStatus(
        error.message ||
          "Unable to load notes. Please try again."
      );
    }
  }

  useEffect(() => {
    load();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filtered = useMemo(() => {
    const search = query
      .toLowerCase()
      .trim();

    return notes.filter((note) =>
      `${note.title || ""} ${note.content || ""}`
        .toLowerCase()
        .includes(search)
    );
  }, [notes, query]);

  // =========================
  // NEW NOTE
  // =========================

  function newNote() {
    setSelected({
      _id: null,
      title: "",
      content: "",
      updatedAt: new Date(),
      isNew: true,
    });

    setStatus("New note");
  }

  // =========================
  // UPDATE SELECTED NOTE
  // =========================

  function updateSelected(field, value) {
    setSelected((current) => {
      if (!current) return null;

      return {
        ...current,
        [field]: value,
      };
    });

    setStatus("Unsaved changes");
  }

  // =========================
  // SAVE NOTE
  // =========================

  async function save() {
    if (!selected) return;

    const title = selected.title.trim();
    const content = selected.content.trim();

    if (!title && !content) {
      setStatus(
        "Enter a title or note first"
      );
      return;
    }

    try {
      setStatus("Saving...");

      // =========================
      // NEW NOTE
      // =========================

      if (!selected._id || selected.isNew) {
        const data = await createNote(
          title,
          content
        );

        setNotes((prev) => [
          data,
          ...prev,
        ]);

        setSelected(data);
      }

      // =========================
      // EXISTING NOTE
      // =========================

      else {
        const data = await updateNote(
          selected._id,
          {
            title,
            content,
          }
        );

        setNotes((prev) =>
          prev.map((note) =>
            note._id === data._id
              ? data
              : note
          )
        );

        setSelected(data);
      }

      setStatus("Saved");

      setTimeout(() => {
        setStatus("");
      }, 1400);
    } catch (error) {
      console.error(
        "Failed to save note:",
        error
      );

      if (
        error.status === 401 ||
        error.status === 403
      ) {
        localStorage.removeItem(
          "notes_token"
        );

        localStorage.removeItem(
          "notes_user"
        );

        navigate("/login", {
          replace: true,
        });

        return;
      }

      setStatus(
        error.message ||
          "Save failed"
      );
    }
  }

  // =========================
  // DELETE NOTE
  // =========================

  async function remove() {
    if (!selected) return;

    // New unsaved note
    if (!selected._id) {
      setSelected(
        notes[0] || null
      );

      setStatus("");
      return;
    }

    if (
      !window.confirm(
        "Delete this note?"
      )
    ) {
      return;
    }

    try {
      await deleteNote(
        selected._id
      );

      const remaining =
        notes.filter(
          (note) =>
            note._id !==
            selected._id
        );

      setNotes(remaining);

      setSelected(
        remaining[0] || null
      );

      setStatus("");
    } catch (error) {
      console.error(
        "Failed to delete note:",
        error
      );

      if (
        error.status === 401 ||
        error.status === 403
      ) {
        localStorage.removeItem(
          "notes_token"
        );

        localStorage.removeItem(
          "notes_user"
        );

        navigate("/login", {
          replace: true,
        });

        return;
      }

      setStatus(
        error.message ||
          "Delete failed"
      );
    }
  }

  // =========================
  // LOGOUT
  // =========================

  function logout() {
    localStorage.removeItem(
      "notes_token"
    );

    localStorage.removeItem(
      "notes_user"
    );

    navigate("/login", {
      replace: true,
    });
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="notes-app-shell">

      {/* SIDEBAR */}
      <aside className="notes-sidebar">

        <div className="app-logo">
          <span>N</span>
          <strong>NoteFlow</strong>
        </div>

        <button
          className="new-note-button"
          onClick={newNote}
        >
          ＋ New note
        </button>

        <div className="workspace-label">
          WORKSPACE
        </div>

        <button className="all-notes-button">
          ▤ All notes{" "}
          <b>{notes.length}</b>
        </button>

        <div className="sidebar-bottom">

          <div className="user-profile">

            <div className="avatar">
              {(user.name || "U")[0]
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {user.name || "User"}
              </strong>

              <small>
                {user.email || ""}
              </small>
            </div>

            <button
              onClick={logout}
              title="Log out"
            >
              ↪
            </button>

          </div>

        </div>
      </aside>

      {/* MAIN */}
      <main className="notes-content">

        <header className="notes-topbar">

          <div>
            <p className="eyebrow">
              YOUR WORKSPACE
            </p>

            <h1>All notes</h1>
          </div>

          <div className="notes-actions">

            <div className="search-box">
              ⌕

              <input
                type="text"
                placeholder="Search notes..."
                value={query}
                onChange={(e) =>
                  setQuery(
                    e.target.value
                  )
                }
              />
            </div>

            <button
              className="square-add"
              onClick={newNote}
            >
              ＋
            </button>

          </div>

        </header>

        <div className="notes-layout">

          {/* NOTE LIST */}
          <section className="note-list">

            {filtered.length > 0 ? (
              filtered.map(
                (note) => (
                  <button
                    key={note._id}
                    className={`note-list-item ${
                      selected?._id ===
                      note._id
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setSelected(note)
                    }
                  >

                    <span className="note-dot" />

                    <span>

                      <strong>
                        {note.title ||
                          "Untitled note"}
                      </strong>

                      <small>
                        {note.content ||
                          "Empty note"}
                      </small>

                    </span>

                  </button>
                )
              )
            ) : (
              <div className="empty-notes">

                No notes yet.

                <button
                  onClick={newNote}
                >
                  Create your first
                  note →
                </button>

              </div>
            )}

          </section>

          {/* EDITOR */}
          <section className="note-editor">

            {selected ? (
              <>

                <div className="editor-toolbar">

                  <span className="editor-status">
                    {status ||
                      "Ready to write"}
                  </span>

                  <div>

                    <button
                      onClick={save}
                    >
                      ✓ Save
                    </button>

                    <button
                      className="delete-tool"
                      onClick={remove}
                    >
                      Delete
                    </button>

                  </div>

                </div>

                <input
                  className="editor-title"
                  type="text"
                  value={
                    selected.title ||
                    ""
                  }
                  onChange={(e) =>
                    updateSelected(
                      "title",
                      e.target.value
                    )
                  }
                  placeholder="Note title"
                />

                <div className="editor-date">
                  Last updated{" "}
                  {selected.updatedAt
                    ? new Date(
                        selected.updatedAt
                      ).toLocaleString()
                    : "Just now"}
                </div>

                <textarea
                  className="editor-textarea"
                  value={
                    selected.content ||
                    ""
                  }
                  onChange={(e) =>
                    updateSelected(
                      "content",
                      e.target.value
                    )
                  }
                  placeholder="Start writing..."
                />

              </>
            ) : (
              <div className="editor-empty">

                <div>✦</div>

                <h2>
                  Your ideas belong here.
                </h2>

                <p>
                  Create a note and start
                  writing.
                </p>

                <button
                  onClick={newNote}
                >
                  Create note
                </button>

              </div>
            )}

          </section>

        </div>

      </main>
    </div>
  );
}
if (
  error.status === 401 ||
  error.status === 403
) {
  localStorage.removeItem("notes_token");
  localStorage.removeItem("notes_user");

  navigate("/login", {
    replace: true,
  });

  return;
}