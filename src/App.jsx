// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import CommitteeLayout from "./layouts/CommitteeLayout";  // ודא שהנתיב נכון
import CommitteeDashboard from "./pages/CommitteeDashboard";
import NewFormPage from "./pages/AddForm/NewFormPage";
import CommitteeFormsPage from "./pages/CommitteeFormsPage"; // אם קיים

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/committee" element={<CommitteeLayout />}>
          <Route index element={<CommitteeDashboard />} />
          <Route path="create-form" element={<NewFormPage />} />
          <Route path="forms" element={<CommitteeFormsPage />} />
        </Route>
        <Route path="*" element={<div dir="rtl" className="text-center mt-5">עמוד לא נמצא</div>} />
      </Routes>
    </Router>
  );
}

export default App;


