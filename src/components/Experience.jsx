import React from 'react';
import { History } from 'lucide-react';

export default function Experience({ experienceList }) {
  return (
    <section className="section">
      <h2 className="section-title">
        <History size={20} />
        Work Experience
      </h2>
      <div className="experience-list">
        {experienceList.map((exp, index) => (
          <div key={index} className="exp-item">
            <div className="exp-header">
              <div>
                <h3 className="exp-role">{exp.role}</h3>
                <span className="exp-company">{exp.company}</span>
              </div>
              <span className="exp-period">{exp.period}</span>
            </div>
            <p className="exp-desc">{exp.description}</p>
            <ul className="exp-achievements">
              {exp.achievements.map((ach, aIdx) => (
                <li key={aIdx}>{ach}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
