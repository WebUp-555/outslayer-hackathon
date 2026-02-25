import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AiTutor from "./pages/AiTutor";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import InteractiveBackground from "./components/InteractiveBackground";

function App() {
  return (
    <BrowserRouter>
      <div style={{ position: "relative" }}>
        <InteractiveBackground />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai" element={<AiTutor />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;