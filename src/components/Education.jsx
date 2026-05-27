import { GraduationCap, Heart, CheckCircle2, Globe } from 'lucide-react';

export default function Education({ education, traits, interests }) {
  return (
    <div className="bottom-grid section">
      <div>
        <h2 className="section-title">
          <GraduationCap size={20} />
          Education
        </h2>
        <div className="edu-item">
          <h3 className="edu-college">{education.college}</h3>
          <p className="edu-major">{education.major}</p>
          <span className="edu-period">{education.period}</span>
          
          <div className="edu-english">
            <Globe size={16} />
            <span><strong>English:</strong> {education.english}</span>
          </div>
        </div>
        
        <h2 className="section-title" style={{ marginTop: '2rem' }}>
          <Heart size={20} />
          Interests & Activities
        </h2>
        <div className="interests-list">
          {interests.map((interest, index) => (
            <span key={index} className="skill-tag" style={{ border: '1px solid var(--border-color)' }}>
              {interest}
            </span>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="section-title">
          <CheckCircle2 size={20} />
          Personal Traits
        </h2>
        <ul className="list-unstyled">
          {traits.map((trait, index) => (
            <li key={index}>{trait}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
