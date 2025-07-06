// Job summarization and keyword extraction utilities

// Extract key information from job description
export function extractJobSummary(description) {
  const summary = {
    keySkills: extractSkills(description),
    requirements: extractRequirements(description),
    responsibilities: extractResponsibilities(description),
    benefits: extractBenefits(description),
    experience: extractExperienceLevel(description)
  };
  
  return summary;
}

// Extract technical skills from job description
export function extractSkills(description) {
  const commonSkills = [
    // Programming Languages
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin',
    'scala', 'r', 'matlab', 'perl', 'bash', 'powershell', 'sql', 'html', 'css', 'sass', 'less',
    
    // Frameworks & Libraries
    'react', 'vue', 'angular', 'node.js', 'express', 'django', 'flask', 'fastapi', 'spring', 'laravel',
    'rails', 'asp.net', 'jquery', 'bootstrap', 'tailwind', 'material-ui', 'ant design', 'next.js',
    'nuxt.js', 'gatsby', 'svelte', 'ember', 'backbone', 'meteor', 'strapi', 'wordpress', 'drupal',
    
    // Databases
    'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'cassandra', 'sqlite',
    'oracle', 'sql server', 'mariadb', 'neo4j', 'influxdb', 'couchdb', 'firebase', 'supabase',
    
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'gitlab',
    'github actions', 'circleci', 'travis ci', 'heroku', 'vercel', 'netlify', 'digitalocean',
    'linode', 'vultr', 'cloudflare', 'nginx', 'apache', 'load balancer', 'microservices',
    
    // AI & ML
    'machine learning', 'deep learning', 'neural networks', 'tensorflow', 'pytorch', 'scikit-learn',
    'pandas', 'numpy', 'matplotlib', 'seaborn', 'opencv', 'nltk', 'spacy', 'hugging face',
    'transformers', 'bert', 'gpt', 'computer vision', 'nlp', 'data science', 'statistics',
    
    // Tools & Platforms
    'git', 'svn', 'jira', 'confluence', 'slack', 'teams', 'zoom', 'figma', 'sketch', 'adobe',
    'postman', 'insomnia', 'swagger', 'graphql', 'rest api', 'soap', 'webpack', 'vite',
    'babel', 'eslint', 'prettier', 'jest', 'mocha', 'cypress', 'selenium', 'playwright',
    
    // Methodologies
    'agile', 'scrum', 'kanban', 'waterfall', 'devops', 'ci/cd', 'tdd', 'bdd', 'pair programming',
    'code review', 'git flow', 'trunk based development', 'feature flags', 'a/b testing',
    
    // Other Technologies
    'blockchain', 'ethereum', 'bitcoin', 'solidity', 'web3', 'iot', 'arduino', 'raspberry pi',
    'mobile development', 'ios', 'android', 'react native', 'flutter', 'xamarin', 'ionic',
    'pwa', 'spa', 'ssr', 'jamstack', 'headless cms', 'ecommerce', 'payment processing'
  ];
  
  const words = description.toLowerCase().match(/\b\w+(?:\.\w+)*\b/g) || [];
  const skillMatches = commonSkills.filter(skill => 
    words.some(word => word.includes(skill) || skill.includes(word))
  );
  
  // Remove duplicates and sort by frequency
  const uniqueSkills = [...new Set(skillMatches)];
  return uniqueSkills.slice(0, 10); // Return top 10 skills
}

// Extract requirements from job description
export function extractRequirements(description) {
  const requirementPatterns = [
    /requirements?[:\s]+(.*?)(?=\n\n|\n[A-Z]|$)/gi,
    /qualifications?[:\s]+(.*?)(?=\n\n|\n[A-Z]|$)/gi,
    /what you'll need[:\s]+(.*?)(?=\n\n|\n[A-Z]|$)/gi,
    /you should have[:\s]+(.*?)(?=\n\n|\n[A-Z]|$)/gi,
    /minimum requirements?[:\s]+(.*?)(?=\n\n|\n[A-Z]|$)/gi
  ];
  
  const requirements = [];
  
  requirementPatterns.forEach(pattern => {
    const matches = description.match(pattern);
    if (matches) {
      requirements.push(...matches.map(match => match.replace(/^(requirements?|qualifications?|what you'll need|you should have|minimum requirements?)[:\s]+/i, '').trim()));
    }
  });
  
  return requirements;
}

// Extract responsibilities from job description
export function extractResponsibilities(description) {
  const responsibilityPatterns = [
    /responsibilities?[:\s]+(.*?)(?=\n\n|\n[A-Z]|$)/gi,
    /what you'll do[:\s]+(.*?)(?=\n\n|\n[A-Z]|$)/gi,
    /key responsibilities?[:\s]+(.*?)(?=\n\n|\n[A-Z]|$)/gi,
    /duties?[:\s]+(.*?)(?=\n\n|\n[A-Z]|$)/gi
  ];
  
  const responsibilities = [];
  
  responsibilityPatterns.forEach(pattern => {
    const matches = description.match(pattern);
    if (matches) {
      responsibilities.push(...matches.map(match => match.replace(/^(responsibilities?|what you'll do|key responsibilities?|duties?)[:\s]+/i, '').trim()));
    }
  });
  
  return responsibilities;
}

// Extract benefits from job description
export function extractBenefits(description) {
  const benefitPatterns = [
    /benefits?[:\s]+(.*?)(?=\n\n|\n[A-Z]|$)/gi,
    /perks?[:\s]+(.*?)(?=\n\n|\n[A-Z]|$)/gi,
    /what we offer[:\s]+(.*?)(?=\n\n|\n[A-Z]|$)/gi,
    /compensation[:\s]+(.*?)(?=\n\n|\n[A-Z]|$)/gi
  ];
  
  const benefits = [];
  
  benefitPatterns.forEach(pattern => {
    const matches = description.match(pattern);
    if (matches) {
      benefits.push(...matches.map(match => match.replace(/^(benefits?|perks?|what we offer|compensation)[:\s]+/i, '').trim()));
    }
  });
  
  return benefits;
}

// Extract experience level from job description
export function extractExperienceLevel(description) {
  const experiencePatterns = [
    /(\d+)[\s-]+years?[\s-]+experience/gi,
    /senior[\s-]+level/gi,
    /junior[\s-]+level/gi,
    /entry[\s-]+level/gi,
    /mid[\s-]+level/gi,
    /lead[\s-]+developer/gi,
    /principal[\s-]+engineer/gi,
    /staff[\s-]+engineer/gi
  ];
  
  const experience = [];
  
  experiencePatterns.forEach(pattern => {
    const matches = description.match(pattern);
    if (matches) {
      experience.push(...matches);
    }
  });
  
  return experience;
}

// Generate a concise job summary
export function generateJobSummary(jobData) {
  const summary = extractJobSummary(jobData.description);
  
  return {
    title: jobData.title,
    company: jobData.company,
    location: jobData.location,
    keySkills: summary.keySkills,
    experienceLevel: summary.experience.length > 0 ? summary.experience[0] : 'Not specified',
    requirements: summary.requirements.slice(0, 3), // Top 3 requirements
    responsibilities: summary.responsibilities.slice(0, 3), // Top 3 responsibilities
    benefits: summary.benefits.slice(0, 3) // Top 3 benefits
  };
}

// Calculate job match score based on skills
export function calculateJobMatch(jobSkills, userSkills) {
  if (!jobSkills || !userSkills || jobSkills.length === 0) {
    return 0;
  }
  
  const userSkillsLower = userSkills.map(skill => skill.toLowerCase());
  const jobSkillsLower = jobSkills.map(skill => skill.toLowerCase());
  
  const matchingSkills = jobSkillsLower.filter(skill => 
    userSkillsLower.some(userSkill => 
      userSkill.includes(skill) || skill.includes(userSkill)
    )
  );
  
  const matchPercentage = (matchingSkills.length / jobSkillsLower.length) * 100;
  return Math.round(matchPercentage);
}

// Extract salary information from job description
export function extractSalaryInfo(description) {
  const salaryPatterns = [
    /\$(\d{1,3}(?:,\d{3})*(?:k|K)?)[\s-]+(\$(\d{1,3}(?:,\d{3})*(?:k|K)?))?/g,
    /(\d{1,3}(?:,\d{3})*(?:k|K)?)[\s-]+(\d{1,3}(?:,\d{3})*(?:k|K)?)[\s-]+usd/g,
    /salary[\s-]+range[\s-]+(\$(\d{1,3}(?:,\d{3})*(?:k|K)?)[\s-]+(\$(\d{1,3}(?:,\d{3})*(?:k|K)?)))/gi,
    /compensation[\s-]+(\$(\d{1,3}(?:,\d{3})*(?:k|K)?)[\s-]+(\$(\d{1,3}(?:,\d{3})*(?:k|K)?)))/gi
  ];
  
  const salaries = [];
  
  salaryPatterns.forEach(pattern => {
    const matches = description.match(pattern);
    if (matches) {
      salaries.push(...matches);
    }
  });
  
  return salaries;
}

// Extract company information
export function extractCompanyInfo(description) {
  const companyInfo = {
    industry: extractIndustry(description),
    size: extractCompanySize(description),
    type: extractCompanyType(description)
  };
  
  return companyInfo;
}

// Extract industry from job description
export function extractIndustry(description) {
  const industries = [
    'technology', 'software', 'fintech', 'healthcare', 'ecommerce', 'education',
    'finance', 'banking', 'insurance', 'real estate', 'media', 'entertainment',
    'gaming', 'automotive', 'aerospace', 'manufacturing', 'retail', 'consulting',
    'marketing', 'advertising', 'telecommunications', 'energy', 'biotechnology',
    'pharmaceuticals', 'non-profit', 'government', 'startup', 'enterprise'
  ];
  
  const words = description.toLowerCase().match(/\b\w+\b/g) || [];
  const industryMatches = industries.filter(industry => 
    words.some(word => word.includes(industry) || industry.includes(word))
  );
  
  return industryMatches.slice(0, 3);
}

// Extract company size from job description
export function extractCompanySize(description) {
  const sizePatterns = [
    /(\d+)[\s-]+employees?/gi,
    /startup/gi,
    /small[\s-]+team/gi,
    /large[\s-]+company/gi,
    /fortune[\s-]+500/gi,
    /unicorn/gi
  ];
  
  const sizes = [];
  
  sizePatterns.forEach(pattern => {
    const matches = description.match(pattern);
    if (matches) {
      sizes.push(...matches);
    }
  });
  
  return sizes;
}

// Extract company type from job description
export function extractCompanyType(description) {
  const types = [];
  
  if (description.toLowerCase().includes('startup')) types.push('Startup');
  if (description.toLowerCase().includes('enterprise')) types.push('Enterprise');
  if (description.toLowerCase().includes('agency')) types.push('Agency');
  if (description.toLowerCase().includes('consulting')) types.push('Consulting');
  if (description.toLowerCase().includes('non-profit')) types.push('Non-profit');
  if (description.toLowerCase().includes('government')) types.push('Government');
  
  return types;
} 