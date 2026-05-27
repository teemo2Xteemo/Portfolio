import { portfolioData } from "./data/portfolioData";
import Header from "./components/Header";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Education from "./components/Education";

export default function App() {
  const {
    personalInfo,
    skills,
    experience,
    education,
    interests,
    personalTraits,
  } = portfolioData;

  return (
    <>
      <main className="container">
        <Header personalInfo={personalInfo} />

        <About summary={personalInfo.summary} />

        <Skills skills={skills} />

        <Experience experienceList={experience} />

        <Education
          education={education}
          traits={personalTraits}
          interests={interests}
        />
      </main>

      <footer className="footer">
        <div className="container" style={{ padding: "0 2rem" }}>
          <div className="footer-content">
            <span className="footer-text">
              &copy; {new Date().getFullYear()} {personalInfo.name}. Structured
              for DevOps Learning.
            </span>
            <div className="devops-indicator">
              <span className="pulse-dot"></span>
              Environment: Production | Sandbox Ready
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
