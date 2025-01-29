import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./user/Home";
import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";
import Participants from "./admin/Participants";
import AddParticipant from "./admin/AddParticipant";
import AddParticipantSuccess from "./admin/AddParticipantSuccess";
import Quizzes from "./admin/Quizzes";
import AddQuiz from "./admin/AddQuiz";
import QuizInfo from "./admin/QuizInfo";

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
          path="/quizzes"
          element={
            <ProtectedRoute>
              <Quizzes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-quiz"
          element={
            <ProtectedRoute>
              <AddQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz-info"
          element={
            <ProtectedRoute>
              <QuizInfo />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
