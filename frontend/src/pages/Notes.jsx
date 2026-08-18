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

      const noteData = Array.isArray(data)
        ? data
        : Array.isArray(data.notes)
        ? data.notes
        : [];

      setNotes(noteData);

      setSelected((current) => {
        if (current && current._id) {
          return (
            noteData.find(
              (note) => note._id === current._id
            ) || null
          );
        }

        return noteData[0] || null;
      });

      setStatus("");
    } catch (error) {
      console.error(
        "Failed to load notes:",
        error
      );

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
          "Unable to load notes."
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
      (note.title || "")
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
  // CHANGE TITLE / CONTENT
  // =========================

  function updateSelected(
    field,
    value
  ) {
    setSelected((current) => {
      if (!current) {
        return null;
      }

      return {
        ...current,
        [field]: value,
      };
    });

    setStatus("Unsaved changes");
  }

  // =========================
  // SAVE
  // =========================

  async function save() {
    if (!selected) {
      return;
    }

    const title =
      selected.title.trim();

    const content =
      selected.content.trim();

    if (!title) {
      setStatus("Enter a heading first");
      return;
    }

    if (!content) {
      setStatus("Write something first");
      return;
    }

    try {
      setStatus("Saving...");

      // NEW NOTE
      if (
        !selected._id ||
        selected.isNew
      ) {
        const data =
          await createNote(
            title,
            content
          );

        setNotes((prev) => [
          data,
          ...prev,
        ]);

        setSelected(data);
      }

      // UPDATE NOTE
      else {
        const data =
          await updateNote(
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
  // DELETE
  // =========================

  async function remove() {
    if (!selected) {
      return;
    }

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

        {/* TOP BAR */}

        <header className="notes-topbar">

          <div>
            <p className="eyebrow">
              YOUR WORKSPACE
            </p>

            <h1>
              All notes
            </h1>
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
              title="New note"
            >
              ＋
            </button>

          </div>

        </header>

        {/* NOTES */}

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

                    {/* ONLY HEADING */}
                    <span className="note-heading">
                      {note.title ||
                        "Untitled note"}
                    </span>

                  </button>

                )
              )

            ) : (

              <div className="empty-notes">

                <p>
                  No notes yet.
                </p>

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

                {/* TOOLBAR */}

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

                {/* HEADING */}

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
                  placeholder="Note heading"
                />

                {/* DATE */}

                <div className="editor-date">
                  Last updated{" "}
                  {selected.updatedAt
                    ? new Date(
                        selected.updatedAt
                      ).toLocaleString()
                    : "Just now"}
                </div>

                {/* NOTE CONTENT */}

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
                  placeholder="Start writing your note..."
                />

              </>

            ) : (

              <div className="editor-empty">

                <div>✦</div>

                <h2>
                  Your ideas belong here.
                </h2>

                <p>
                  Click New note to start
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