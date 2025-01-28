import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./user/Home";
import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";
import Participants from "./admin/Participants";
import AddParticipant from "./admin/AddParticipant";
import AddParticipantSuccess from "./admin/AddParticipantSuccess";
import Questions from "./admin/Questions";
import AddQuestion from "./admin/AddQuestion";
import Question from "./admin/Question";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/participants"
          element={
            <ProtectedRoute>
              <Participants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-participant"
          element={
            <ProtectedRoute>
              <AddParticipant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-participant-success"
          element={
            <ProtectedRoute>
              <AddParticipantSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/questions"
          element={
            <ProtectedRoute>
              <Questions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-question"
          element={
            <ProtectedRoute>
              <AddQuestion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/question"
          element={
            <ProtectedRoute>
              <Question />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
