import { Mail, Phone, Calendar, User, Briefcase } from 'lucide-react';

const LinkedinIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Header({ personalInfo }) {
  return (
    <header className="header">
      <div className="header-top">
        <div className="title-area">
          <h1>{personalInfo.name}</h1>
          <div className="subtitle">
            {personalInfo.title}
            <span className="yoe-badge">
              <Briefcase size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
              {personalInfo.yoe}
            </span>
          </div>
        </div>
        
        <div className="contact-info">
          <a href={`mailto:${personalInfo.email}`} className="contact-item">
            <Mail size={16} />
            {personalInfo.email}
          </a>
          <a href={`tel:${personalInfo.tel}`} className="contact-item">
            <Phone size={16} />
            {personalInfo.tel}
          </a>
          <a href={personalInfo.linkedinUrl} target="_blank" rel="noopener noreferrer" className="contact-item">
            <LinkedinIcon />
            LinkedIn: /{personalInfo.linkedin}
          </a>
        </div>
      </div>
      
      <div className="header-meta">
        <span>
          <Calendar size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          DOB: {personalInfo.dob}
        </span>
        <span>
          <User size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Gender: {personalInfo.gender}
        </span>
      </div>
    </header>
  );
}
