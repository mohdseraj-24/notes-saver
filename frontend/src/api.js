const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// =========================
// HELPER
// =========================

function getToken() {
  return localStorage.getItem("notes_token");
}

async function handleResponse(response) {
  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const error = new Error(
      data.message ||
        `Request failed with status ${response.status}`
    );

    error.status = response.status;

    throw error;
  }

  return data;
}

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

  return handleResponse(response);
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

  return handleResponse(response);
}

// =========================
// GET NOTES
// =========================

export async function getNotes() {
  const token = getToken();

  if (!token) {
    const error = new Error(
      "Authentication token not found."
    );

    error.status = 401;

    throw error;
  }

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

  return handleResponse(response);
}

// =========================
// CREATE NOTE
// =========================

export async function createNote(
  title,
  content
) {
  const token = getToken();

  if (!token) {
    const error = new Error(
      "Authentication token not found."
    );

    error.status = 401;

    throw error;
  }

  const response = await fetch(
    `${API_URL}/api/notes`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title,
        content,
      }),
    }
  );

  return handleResponse(response);
}

// =========================
// UPDATE NOTE
// =========================

export async function updateNote(
  id,
  note
) {
  const token = getToken();

  if (!token) {
    const error = new Error(
      "Authentication token not found."
    );

    error.status = 401;

    throw error;
  }

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

  return handleResponse(response);
}

// =========================
// DELETE NOTE
// =========================

export async function deleteNote(id) {
  const token = getToken();

  if (!token) {
    const error = new Error(
      "Authentication token not found."
    );

    error.status = 401;

    throw error;
  }

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

  return handleResponse(response);
}