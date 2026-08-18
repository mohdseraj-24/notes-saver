const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// =========================
// SIGNUP
// =========================

export async function signup(
  name,
  email,
  password
) {
  const response = await fetch(
    `${API_URL}/auth/signup`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Signup failed"
    );
  }

  return data;
}

// =========================
// LOGIN
// =========================

export async function login(
  email,
  password
) {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed"
    );
  }

  return data;
}

// =========================
// GET NOTES
// =========================

export async function getNotes(token) {
  const response = await fetch(
    `${API_URL}/api/notes`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to get notes"
    );
  }

  return data;
}

// =========================
// CREATE NOTE
// =========================

export async function createNote(
  token,
  note
) {
  const response = await fetch(
    `${API_URL}/api/notes`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify(note),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create note"
    );
  }

  return data;
}

// =========================
// UPDATE NOTE
// =========================

export async function updateNote(
  token,
  id,
  note
) {
  const response = await fetch(
    `${API_URL}/api/notes/${id}`,
    {
      method: "PUT",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify(note),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update note"
    );
  }

  return data;
}

// =========================
// DELETE NOTE
// =========================

export async function deleteNote(
  token,
  id
) {
  const response = await fetch(
    `${API_URL}/api/notes/${id}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete note"
    );
  }

  return data;
}