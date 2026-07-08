import { useState, useRef } from "react";
import { generateCoverLetterWithAI } from "../services/gemini";
import { extractTextFromPDF } from "../services/pdfParser";
function CoverLetterForm({ setCoverLetter }) {
  //state variables
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const fileInputRef = useRef(null);
  const addSkill = () => {
    if (skill.trim() === "") return;
    const trimmedSkill = skill.trim();

    if (skills.some((s) => s.toLowerCase() === trimmedSkill.toLowerCase()))
      return;

    setSkills([...skills, trimmedSkill]);
    setSkill("");
    setSkills([...skills, skill.trim()]);
    setSkill("");
  };
  const removeSkill = (indexToRemove) => {
    const updatedSkills = skills.filter((_, index) => index !== indexToRemove);
    setSkills(updatedSkills);
  };
  const clearForm = () => {
    setName("");
    setRole("");
    setCompany("");
    setSkill("");
    setSkills([]);
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setCoverLetter("");
  };
  const handleGenerateCoverLetter = async (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !role.trim() ||
      !company.trim() ||
      skills.length === 0
    ) {
      alert("Please fill all the fields.");
      return;
    }

    setLoading(true);

    try {
      let resumeText = "";

      if (resumeFile) {
        resumeText = await extractTextFromPDF(resumeFile);
      }
      const letter = await generateCoverLetterWithAI({
        name,
        role,
        company,
        skills,
        resumeText,
      });

      setCoverLetter(letter);
    } catch (error) {
      console.error(error);

      setCoverLetter(
        "Something went wrong while generating the cover letter. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="cover-form" onSubmit={handleGenerateCoverLetter}>
      <div className="form-group">
        <label htmlFor="name">Candidate Name</label>
        <input
          type="text"
          id="name"
          placeholder="Enter your full name"
          value={name}
          disabled={loading}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="role">Job Role</label>
        <input
          type="text"
          id="role"
          placeholder="Frontend Developer"
          value={role}
          disabled={loading}
          onChange={(e) => setRole(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="company">Target Company</label>
        <input
          type="text"
          id="company"
          placeholder="Google"
          value={company}
          disabled={loading}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="resume">Upload Resume (PDF)</label>

        <input
          ref={fileInputRef}
          type="file"
          id="resume"
          accept=".pdf"
          disabled={loading}
          onChange={(e) => {
            const file = e.target.files[0];

            if (file) {
              setResumeFile(file);
            }
          }}
        />
      </div>

      <div className="form-group">
        <label htmlFor="skill">Key Skills</label>

        <div className="skill-input">
          <input
            type="text"
            id="skill"
            placeholder="Type one skill"
            value={skill}
            disabled={loading}
            onChange={(e) => setSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
          />

          <button
            type="button"
            className="add-btn"
            disabled={loading}
            onClick={addSkill}
          >
            +
          </button>
        </div>
      </div>
      <div className="skills-list">
        {skills.map((item, index) => (
          <div key={index} className="skill-chip">
            <span>{item}</span>

            <button
              type="button"
              className="remove-btn"
              onClick={() => removeSkill(index)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="button-group">
        <button
          type="button"
          className="clear-btn"
          onClick={clearForm}
          disabled={loading}
        >
          Clear Form
        </button>

        <button type="submit" className="generate-btn" disabled={loading}>
          {loading ? "Generating..." : "Generate Cover Letter"}
        </button>
      </div>
    </form>
  );
}

export default CoverLetterForm;
