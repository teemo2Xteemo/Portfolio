import { Cpu, Server, Database, GitBranch, Share2, Award, Zap } from 'lucide-react';

const getCategoryIcon = (category) => {
  const cat = category.toLowerCase();
  if (cat.includes('languages') || cat.includes('frameworks')) return <Cpu size={16} />;
  if (cat.includes('databases') || cat.includes('caching')) return <Database size={16} />;
  if (cat.includes('infrastructure') || cat.includes('devops')) return <Server size={16} />;
  if (cat.includes('messaging') || cat.includes('async') || cat.includes('orchestration')) return <GitBranch size={16} />;
  if (cat.includes('architecture') || cat.includes('design')) return <Share2 size={16} />;
  if (cat.includes('ai-assisted')) return <Zap size={16} />;
  return <Award size={16} />;
};

export default function Skills({ skills }) {
  return (
    <section className="section">
      <h2 className="section-title">
        <Cpu size={20} />
        Technical Skills
      </h2>
      <div className="skills-container">
        {skills.map((skillGroup, index) => (
          <div key={index} className="skills-category">
            <h3 className="category-name">
              {getCategoryIcon(skillGroup.category)}
              {skillGroup.category}
            </h3>
            <div className="skills-list">
              {skillGroup.items.map((item, iIdx) => (
                <span key={iIdx} className="skill-tag">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
