// Prompt templates for generating personalized outreach messages

// Base system prompt for the LLM
export const SYSTEM_PROMPT = `You are an expert job application assistant with deep knowledge of the tech industry and recruitment best practices. Your goal is to help job seekers create compelling, personalized outreach messages that stand out to recruiters and hiring managers.

Key principles:
1. Be specific and reference the job/company details
2. Show genuine enthusiasm and interest
3. Highlight relevant experience and skills
4. Keep messages concise and professional
5. Use the specified tone and style
6. Include a clear call-to-action
7. Avoid generic templates - make each message unique

Always structure your response with clear sections:
1. Job Summary (2-3 sentences)
2. LinkedIn DM (specified character limit)
3. Email Cover Letter (3-4 paragraphs)`;

// Template for professional tone
export const PROFESSIONAL_TEMPLATE = `
Job Information:
- Title: {title}
- Company: {company}
- Location: {location}
- Job Description: {description}

My Background: {resume}

Please generate:
1. A brief job summary (2-3 sentences)
2. A professional LinkedIn DM message ({maxLength} characters max)
3. A formal email cover letter (3-4 paragraphs)

Tone: Professional and polished
Include salary discussion: {includeSalary}

Focus on:
- Specific skills and experience that match the role
- Company research and industry knowledge
- Professional achievements and metrics
- Clear value proposition
- Professional closing with call-to-action`;

// Template for friendly tone
export const FRIENDLY_TEMPLATE = `
Job Information:
- Title: {title}
- Company: {company}
- Location: {location}
- Job Description: {description}

My Background: {resume}

Please generate:
1. A brief job summary (2-3 sentences)
2. A friendly LinkedIn DM message ({maxLength} characters max)
3. A warm email cover letter (3-4 paragraphs)

Tone: Friendly and approachable
Include salary discussion: {includeSalary}

Focus on:
- Personal connection to the company/role
- Enthusiasm and passion for the work
- Collaborative and team-oriented approach
- Cultural fit and values alignment
- Warm, engaging closing`;

// Template for enthusiastic tone
export const ENTHUSIASTIC_TEMPLATE = `
Job Information:
- Title: {title}
- Company: {company}
- Location: {location}
- Job Description: {description}

My Background: {resume}

Please generate:
1. A brief job summary (2-3 sentences)
2. An enthusiastic LinkedIn DM message ({maxLength} characters max)
3. A passionate email cover letter (3-4 paragraphs)

Tone: Enthusiastic and energetic
Include salary discussion: {includeSalary}

Focus on:
- Excitement about the opportunity
- Passion for the company's mission
- Eagerness to contribute and grow
- Innovative thinking and creativity
- Dynamic and forward-thinking approach`;

// Template for formal tone
export const FORMAL_TEMPLATE = `
Job Information:
- Title: {title}
- Company: {company}
- Location: {location}
- Job Description: {description}

My Background: {resume}

Please generate:
1. A brief job summary (2-3 sentences)
2. A formal LinkedIn DM message ({maxLength} characters max)
3. A traditional email cover letter (3-4 paragraphs)

Tone: Formal and traditional
Include salary discussion: {includeSalary}

Focus on:
- Traditional business language
- Structured and methodical approach
- Professional qualifications and credentials
- Industry expertise and experience
- Formal business closing`;

// LinkedIn DM specific templates
export const LINKEDIN_DM_TEMPLATES = {
  professional: `Hi {recruiter_name},

I came across the {title} position at {company} and I'm very interested in this opportunity. With my background in {key_skill_1} and {key_skill_2}, I believe I can bring valuable expertise to your team.

I'm particularly excited about {company_specific_point} and would love to discuss how my experience aligns with your needs.

Would you be available for a brief conversation this week?

Best regards,
{name}`,

  friendly: `Hey {recruiter_name}! 👋

I just saw the {title} role at {company} and it looks like a perfect fit! I love what you're doing with {company_specific_point} and think my experience with {key_skill_1} could be really valuable.

Would love to chat about this opportunity if you have a few minutes this week!

Thanks,
{name}`,

  enthusiastic: `Hi {recruiter_name}! 🚀

I'm super excited about the {title} position at {company}! Your work on {company_specific_point} is exactly the kind of challenge I'm looking for, and I'd love to bring my {key_skill_1} and {key_skill_2} expertise to your team.

Can we schedule a quick call to discuss this opportunity?

Looking forward to connecting!
{name}`,

  formal: `Dear {recruiter_name},

I am writing to express my interest in the {title} position at {company}. Upon reviewing the job description, I believe my qualifications in {key_skill_1} and {key_skill_2} align well with your requirements.

I am particularly drawn to {company_specific_point} and would welcome the opportunity to discuss how my background can contribute to your organization's success.

I would appreciate the opportunity to speak with you at your convenience.

Sincerely,
{name}`
};

// Email cover letter templates
export const EMAIL_TEMPLATES = {
  professional: `Subject: Application for {title} Position at {company}

Dear {hiring_manager},

I am writing to express my strong interest in the {title} position at {company}. With my background in {key_skill_1} and {key_skill_2}, I am confident in my ability to contribute effectively to your team.

{company_specific_paragraph}

My experience includes {relevant_experience_1} and {relevant_experience_2}, which I believe directly align with the requirements of this role. I am particularly drawn to {company_specific_point} and am excited about the opportunity to contribute to such innovative work.

{achievement_paragraph}

I would welcome the opportunity to discuss how my skills and experience can benefit {company} and contribute to your continued success. I am available for an interview at your convenience and can be reached at {phone} or {email}.

Thank you for considering my application. I look forward to the possibility of joining your team.

Best regards,
{name}`,

  friendly: `Subject: Excited about the {title} opportunity at {company}!

Hi {hiring_manager},

I hope this email finds you well! I'm reaching out because I'm really excited about the {title} position at {company}. After learning about your work on {company_specific_point}, I knew I had to apply.

{company_specific_paragraph}

I've been working with {key_skill_1} and {key_skill_2} for several years, and I think my experience could be a great fit for what you're looking for. I love collaborating with teams and solving complex problems together.

{achievement_paragraph}

I'd love to chat more about this opportunity and learn more about the team and culture at {company}. I'm flexible with timing and can be reached at {phone} or {email}.

Thanks so much for considering my application!

Best,
{name}`,

  enthusiastic: `Subject: 🚀 Thrilled to apply for {title} at {company}!

Hi {hiring_manager},

I'm absolutely thrilled about the {title} opportunity at {company}! Your work on {company_specific_point} is exactly the kind of innovative project I'm passionate about, and I can't wait to potentially be part of it.

{company_specific_paragraph}

I bring extensive experience in {key_skill_1} and {key_skill_2}, and I'm always excited to tackle new challenges and learn new technologies. I believe in the power of collaboration and creative problem-solving.

{achievement_paragraph}

I'm incredibly excited about the possibility of joining your team and contributing to {company}'s mission. I'm available for a call anytime this week and can be reached at {phone} or {email}.

Can't wait to connect!

Cheers,
{name}`,

  formal: `Subject: Application for {title} Position - {name}

Dear {hiring_manager},

I am submitting my application for the {title} position at {company}. After carefully reviewing the job description and researching your organization, I am confident that my qualifications and experience make me an excellent candidate for this role.

{company_specific_paragraph}

My professional background includes significant experience in {key_skill_1} and {key_skill_2}, with a proven track record of delivering results in similar environments. I am particularly interested in {company_specific_point} and believe my expertise aligns well with your organizational objectives.

{achievement_paragraph}

I am available for an interview at your earliest convenience and can be contacted at {phone} or {email}. I look forward to discussing how my qualifications can contribute to {company}'s continued success.

Thank you for your time and consideration.

Sincerely,
{name}`
};

// Function to get template based on tone
export function getTemplateByTone(tone) {
  const templates = {
    professional: PROFESSIONAL_TEMPLATE,
    friendly: FRIENDLY_TEMPLATE,
    enthusiastic: ENTHUSIASTIC_TEMPLATE,
    formal: FORMAL_TEMPLATE
  };
  
  return templates[tone] || PROFESSIONAL_TEMPLATE;
}

// Function to get LinkedIn DM template by tone
export function getLinkedInTemplateByTone(tone) {
  return LINKEDIN_DM_TEMPLATES[tone] || LINKEDIN_DM_TEMPLATES.professional;
}

// Function to get email template by tone
export function getEmailTemplateByTone(tone) {
  return EMAIL_TEMPLATES[tone] || EMAIL_TEMPLATES.professional;
}

// Function to fill template with data
export function fillTemplate(template, data) {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return data[key] || match;
  });
}

// Function to generate personalized prompt
export function generatePersonalizedPrompt(jobData, userResume, preferences) {
  const template = getTemplateByTone(preferences.tone);
  
  const data = {
    title: jobData.title,
    company: jobData.company,
    location: jobData.location || 'Not specified',
    description: jobData.description.substring(0, 1500) + '...',
    resume: userResume || 'Not provided',
    maxLength: preferences.maxMessageLength,
    includeSalary: preferences.includeSalary ? 'Yes' : 'No'
  };
  
  return fillTemplate(template, data);
}

// Function to extract company-specific talking points
export function extractCompanyTalkingPoints(description, company) {
  const talkingPoints = [];
  
  // Look for company-specific projects, products, or initiatives
  const projectPatterns = [
    /we are working on (.*?)(?=\.|,|;)/gi,
    /our (.*?) platform/gi,
    /we're building (.*?)(?=\.|,|;)/gi,
    /our mission is to (.*?)(?=\.|,|;)/gi
  ];
  
  projectPatterns.forEach(pattern => {
    const matches = description.match(pattern);
    if (matches) {
      talkingPoints.push(...matches);
    }
  });
  
  // Look for technology mentions
  const techPatterns = [
    /using (.*?)(?=\.|,|;|to|for)/gi,
    /built with (.*?)(?=\.|,|;)/gi,
    /technology stack includes (.*?)(?=\.|,|;)/gi
  ];
  
  techPatterns.forEach(pattern => {
    const matches = description.match(pattern);
    if (matches) {
      talkingPoints.push(...matches);
    }
  });
  
  return talkingPoints.slice(0, 3); // Return top 3 talking points
}

// Function to generate company-specific paragraph
export function generateCompanySpecificParagraph(talkingPoints, company) {
  if (talkingPoints.length === 0) {
    return `I am particularly drawn to ${company}'s innovative approach and the opportunity to work on cutting-edge projects.`;
  }
  
  const point = talkingPoints[0];
  return `I am particularly excited about ${company}'s work on ${point.toLowerCase()}. This aligns perfectly with my interests and experience, and I would love to contribute to such innovative initiatives.`;
}

// Function to generate achievement paragraph
export function generateAchievementParagraph(userResume) {
  if (!userResume) {
    return `I am confident that my technical skills and collaborative approach would make me a valuable addition to your team.`;
  }
  
  // Extract potential achievements from resume
  const achievementPatterns = [
    /increased (.*?) by (.*?)/gi,
    /improved (.*?) by (.*?)/gi,
    /led (.*?) team/gi,
    /managed (.*?) project/gi,
    /developed (.*?) solution/gi
  ];
  
  const achievements = [];
  achievementPatterns.forEach(pattern => {
    const matches = userResume.match(pattern);
    if (matches) {
      achievements.push(...matches);
    }
  });
  
  if (achievements.length > 0) {
    return `In my previous roles, I have successfully ${achievements[0].toLowerCase()}, demonstrating my ability to deliver results and drive positive outcomes.`;
  }
  
  return `I am confident that my technical skills and collaborative approach would make me a valuable addition to your team.`;
} 