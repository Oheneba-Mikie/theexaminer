import { Suspense } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import Home from "./components/home";
import ExaminerDashboard from "./components/ExaminerDashboard";
import StudentExam from "./components/StudentExam";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  // Import routes dynamically to avoid initialization issues
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true"
      ? (() => {
          try {
            // @ts-ignore - tempo-routes is provided by the tempo plugin
            // Using dynamic import instead of require which isn't available in browser context
            return useRoutes(window.__TEMPO_ROUTES__ || []);
          } catch (error) {
            console.error("Error loading tempo routes:", error);
            return null;
          }
        })()
      : null;

  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          {/* Render tempo routes */}
          {tempoRoutes}

          {/* Regular application routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/examiner" element={<ExaminerDashboard />} />
            <Route path="/student" element={<StudentExam />} />
            <Route
              path="/exam/:examId"
              element={
                <StudentExam
                  urlExamId={window.location.pathname.split("/exam/")[1]}
                />
              }
            />
            {/* Add tempobook route to prevent catch-all from capturing it */}
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" element={null} />
            )}
          </Routes>
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
