import { UserCheck } from 'lucide-react';

export default function About({ summary }) {
  return (
    <section className="section">
      <h2 className="section-title">
        <UserCheck size={20} />
        Professional Summary
      </h2>
      <p className="summary-text">{summary}</p>
    </section>
  );
}
