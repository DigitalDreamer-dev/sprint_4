import { useState } from "react";
import ReactMarkdown from "react-markdown";
function CoverLetterOutput({ coverLetter }) {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Failed to copy the cover letter.");
    }
  };
  return (
    <section>
      <h2>Generated Cover Letter</h2>

      {coverLetter ? (
        <div className="output-box">
          <div className="output-header">
            <button className="copy-btn" onClick={copyToClipboard}>
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
          </div>

          <div className="markdown-content">
            <ReactMarkdown>{coverLetter}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <p>Your AI-generated cover letter will appear here.</p>
      )}
    </section>
  );
}

export default CoverLetterOutput;
