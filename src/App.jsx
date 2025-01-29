import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./user/Home";
import Login from "./admin/Login";
import Layout from "./admin/Layout";
import Dashboard from "./admin/Dashboard";
import Participants from "./admin/Participants";
import AddParticipant from "./admin/AddParticipant";
import Quizzes from "./admin/Quizzes";
import AddQuiz from "./admin/AddQuiz";
import QuizInfo from "./admin/QuizInfo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Pages with Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/add-quiz" element={<AddQuiz />} />
          <Route path="/quiz/:id" element={<QuizInfo />} /> {/* New Route */}
          <Route path="/participants" element={<Participants />} />
          <Route path="/add-participant" element={<AddParticipant />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
