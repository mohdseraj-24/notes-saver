import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Notes from './pages/Notes';

function Protected({ children }) {
  return localStorage.getItem('notes_token') ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/notes" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/notes" element={<Protected><Notes /></Protected>} />
      <Route path="*" element={<Navigate to="/notes" replace />} />
    </Routes>
  );
}
