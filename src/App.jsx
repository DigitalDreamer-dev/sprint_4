import { useState } from "react";
import "./App.css";

import CoverLetterForm from "./components/CoverLetterForm";
import CoverLetterOutput from "./components/CoverLetterOutput";

function App() {
  const [coverLetter, setCoverLetter] = useState("");

  return (
    <div className="container">
      <h1>🤖 AI Cover Letter </h1>
      <h1>Generator</h1>

      <p className="subtitle">
        Generate professional, AI-powered cover letters tailored to your dream
        job.
      </p>

      <CoverLetterForm setCoverLetter={setCoverLetter} />

      <CoverLetterOutput coverLetter={coverLetter} />
    </div>
  );
}

export default App;
