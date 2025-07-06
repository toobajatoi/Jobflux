/**
 * Jobflux Chrome Extension - Background Service Worker
 * Created by Tooba Jatoi
 * Copyright © 2024 Tooba Jatoi. All rights reserved.
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('Jobflux extension installed');
  
  // Initialize default settings
  chrome.storage.local.set({
    openRouterApiKey: '',
    notionApiKey: '',
    notionDatabaseId: '',
    userResume: '',
    userPreferences: {
      tone: 'professional',
      includeSalary: false,
      maxMessageLength: 500
    }
  });
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateOutreach') {
    generateOutreachMessage(request.jobData)
      .then(response => sendResponse(response))
      .catch(error => sendResponse({ error: error.message }));
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'saveToNotion') {
    saveToNotion(request.jobData, request.message)
      .then(response => sendResponse(response))
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }
  
  if (request.action === 'getSettings') {
    chrome.storage.local.get(['openRouterApiKey', 'notionApiKey', 'notionDatabaseId', 'userResume', 'userPreferences'], (result) => {
      sendResponse(result);
    });
    return true;
  }
  
  if (request.action === 'saveSettings') {
    chrome.storage.local.set(request.settings, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Generate outreach message using OpenRouter API
async function generateOutreachMessage(jobData) {
  try {
    const settings = await getStorageData(['openRouterApiKey', 'userResume', 'userPreferences']);
    
    if (!settings.openRouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }
    
    const prompt = createPrompt(jobData, settings.userResume, settings.userPreferences);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://jobflux-extension.com',
        'X-Title': 'Jobflux Extension'
      },
      body: JSON.stringify({
        model: 'mistralai/mixtral-8x7b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are an expert job application assistant. Generate personalized outreach messages that are professional, specific, and compelling.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      message: data.choices[0].message.content,
      jobSummary: generateJobSummary(jobData)
    };
    
  } catch (error) {
    console.error('Error generating outreach message:', error);
    throw error;
  }
}

// Save job and message to Notion
async function saveToNotion(jobData, message) {
  try {
    const settings = await getStorageData(['notionApiKey', 'notionDatabaseId']);
    
    if (!settings.notionApiKey || !settings.notionDatabaseId) {
      throw new Error('Notion API key or database ID not configured');
    }
    
    const response = await fetch(`https://api.notion.com/v1/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.notionApiKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        parent: { database_id: settings.notionDatabaseId },
        properties: {
          'Job Title': {
            title: [{ text: { content: jobData.title } }]
          },
          'Company': {
            rich_text: [{ text: { content: jobData.company } }]
          },
          'URL': {
            url: jobData.url
          },
          'Status': {
            select: { name: 'Applied' }
          },
          'Date Applied': {
            date: { start: new Date().toISOString() }
          }
        },
        children: [
          {
            object: 'block',
            type: 'heading_2',
            heading_2: {
              rich_text: [{ text: { content: 'Generated Outreach Message' } }]
            }
          },
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{ text: { content: message } }]
            }
          },
          {
            object: 'block',
            type: 'heading_3',
            heading_3: {
              rich_text: [{ text: { content: 'Job Description' } }]
            }
          },
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{ text: { content: jobData.description.substring(0, 2000) + '...' } }]
            }
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Notion API request failed: ${response.status}`);
    }
    
    return { success: true, message: 'Saved to Notion successfully' };
    
  } catch (error) {
    console.error('Error saving to Notion:', error);
    throw error;
  }
}

// Helper function to get storage data
function getStorageData(keys) {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, resolve);
  });
}

// Create prompt for LLM
function createPrompt(jobData, userResume, preferences) {
  return `
Job Information:
- Title: ${jobData.title}
- Company: ${jobData.company}
- Location: ${jobData.location || 'Not specified'}
- Job Description: ${jobData.description.substring(0, 1500)}...

My Resume Summary: ${userResume || 'Not provided'}

Please generate:
1. A brief job summary (2-3 sentences)
2. A personalized LinkedIn DM message (${preferences.maxMessageLength} characters max)
3. A professional email cover letter (3-4 paragraphs)

Tone: ${preferences.tone}
Include salary discussion: ${preferences.includeSalary ? 'Yes' : 'No'}

Make the message specific to this role and company. Show enthusiasm and relevant experience.
`;
}

// Generate job summary
function generateJobSummary(jobData) {
  const keywords = extractKeywords(jobData.description);
  return {
    title: jobData.title,
    company: jobData.company,
    location: jobData.location,
    keySkills: keywords.slice(0, 5),
    description: jobData.description.substring(0, 200) + '...'
  };
}

// Extract keywords from job description
function extractKeywords(description) {
  const commonSkills = [
    'javascript', 'python', 'react', 'node.js', 'aws', 'docker', 'kubernetes',
    'machine learning', 'ai', 'data science', 'sql', 'mongodb', 'postgresql',
    'git', 'agile', 'scrum', 'api', 'rest', 'graphql', 'typescript', 'java',
    'c++', 'go', 'rust', 'vue', 'angular', 'next.js', 'express', 'django',
    'flask', 'fastapi', 'terraform', 'jenkins', 'ci/cd', 'microservices'
  ];
  
  const words = description.toLowerCase().match(/\b\w+\b/g) || [];
  const skillMatches = commonSkills.filter(skill => 
    words.some(word => word.includes(skill) || skill.includes(word))
  );
  
  return [...new Set(skillMatches)];
} 