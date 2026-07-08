import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function generateCoverLetterWithAI(data) {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error("Gemini API key is missing.");
  }
  const prompt = `
You are an expert HR recruiter.

First, carefully analyze the uploaded resume.

Extract the following information if available:
- Candidate's experience level
- Education
- Projects
- Technical skills
- Backend technologies
- Frontend technologies
- Databases
- Certifications
- Achievements

Then write a personalized ATS-friendly cover letter.

Candidate Information:
- Name: ${data.name}
- Applying For: ${data.role}
- Target Company: ${data.company}
- Additional Skills: ${data.skills.join(", ")}

Uploaded Resume:
====================
${data.resumeText || "No resume uploaded."}
====================

Requirements:
- The uploaded resume is the primary source of information.
- Mention at least TWO projects from the resume if available.
- Mention technologies exactly as they appear in the resume whenever relevant.
- Mention specific project names instead of saying "projects".
- Mention certifications if relevant.
- Mention achievements if relevant.
- Mention education naturally.
- Mention backend technologies.
- Mention frontend technologies.
- Mention databases.
- Mention why the candidate is a good fit for the role.
- Make the cover letter sound personalized rather than generic.
- Reference specific resume details naturally throughout the letter.
- Do not invent any information.
- Use additional manually entered skills only if they are not already present in the resume.

Output:
- Return only the cover letter.
- Use Markdown.
- No code blocks.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate cover letter.");
  }
}
