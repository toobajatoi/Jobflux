/**
 * Jobflux Chrome Extension - Content Script
 * Created by Tooba Jatoi
 * Copyright © 2024 Tooba Jatoi. All rights reserved.
 * 
 * Handles job data extraction from various job sites
 */

console.log('Jobflux: Content script loaded successfully!');

let jobData = null;
let isJobPage = false;

// Run immediately and after delays to handle dynamic loading
function initializeJobflux() {
  console.log('Jobflux: Initializing...');
  detectJobPage();
  if (isJobPage) {
    console.log('Jobflux: Job page detected, extracting data...');
    extractJobData();
    injectJobfluxButton();
  } else {
    console.log('Jobflux: Not a job page');
  }
}

// Run immediately
initializeJobflux();

// Run after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Jobflux: DOMContentLoaded event fired');
  initializeJobflux();
});

// Run after a delay to handle dynamic content
setTimeout(() => {
  console.log('Jobflux: Delayed initialization...');
  initializeJobflux();
}, 2000);

// Run after another delay for very slow loading
setTimeout(() => {
  console.log('Jobflux: Final delayed initialization...');
  initializeJobflux();
}, 5000);

// Also run on navigation changes (for SPA sites)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    console.log('Jobflux: URL changed, re-detecting job page...');
    lastUrl = url;
    setTimeout(() => {
      initializeJobflux();
    }, 1000); // Wait for page to load
  }
}).observe(document, { subtree: true, childList: true });

// Detect if current page is a job listing
function detectJobPage() {
  const url = window.location.href;
  isJobPage = (
    url.includes('linkedin.com/jobs/') ||
    url.includes('wellfound.com/jobs/') ||
    url.includes('indeed.com/viewjob') ||
    url.includes('indeed.com/job/')
  );
  console.log('Jobflux: URL check result:', { url, isJobPage });
}

// Extract job data based on the current site
function extractJobData() {
  const url = window.location.href;
  
  if (url.includes('linkedin.com')) {
    jobData = extractLinkedInJobData();
  } else if (url.includes('wellfound.com')) {
    jobData = extractWellfoundJobData();
  } else if (url.includes('indeed.com')) {
    jobData = extractIndeedJobData();
  }
  
  if (jobData) {
    console.log('Jobflux: Extracted job data:', jobData);
    chrome.runtime.sendMessage({
      action: 'jobDataExtracted',
      jobData: jobData
    });
  } else {
    console.log('Jobflux: No job data extracted');
  }
}

// Extract job data from LinkedIn
function extractLinkedInJobData() {
  try {
    console.log('Jobflux: Attempting to extract LinkedIn job data...');
    
    // Job title - try multiple selectors
    const titleElement = 
      document.querySelector('.job-details-jobs-unified-top-card__job-title') ||
      document.querySelector('[data-test-id="job-details-jobs-unified-top-card__job-title"]') ||
      document.querySelector('.jobs-unified-top-card__job-title') ||
      document.querySelector('h1') ||
      document.querySelector('.jobs-unified-top-card__title');
    
    // Company name - try multiple selectors
    const companyElement = 
      document.querySelector('.job-details-jobs-unified-top-card__company-name') ||
      document.querySelector('[data-test-id="job-details-jobs-unified-top-card__company-name"]') ||
      document.querySelector('.jobs-unified-top-card__company-name') ||
      document.querySelector('.job-details-jobs-unified-top-card__subtitle-primary-grouping') ||
      document.querySelector('.jobs-unified-top-card__subtitle-primary-grouping a') ||
      document.querySelector('.jobs-unified-top-card__subtitle-primary-grouping span');
    
    // Location - try multiple selectors
    const locationElement = 
      document.querySelector('.job-details-jobs-unified-top-card__bullet') ||
      document.querySelector('[data-test-id="job-details-jobs-unified-top-card__bullet"]') ||
      document.querySelector('.jobs-unified-top-card__bullet') ||
      document.querySelector('.jobs-unified-top-card__subtitle-primary-grouping .jobs-unified-top-card__bullet');
    
    // Job description - try multiple selectors
    const descriptionElement = 
      document.querySelector('.jobs-description__content') ||
      document.querySelector('[data-test-id="job-details-jobs-unified-top-card__job-description"]') ||
      document.querySelector('.jobs-box__html-content') ||
      document.querySelector('.jobs-description') ||
      document.querySelector('.jobs-box__html-content .jobs-description-content__text') ||
      document.querySelector('.jobs-description__content .jobs-box__html-content');
    
    console.log('Jobflux: Found elements:', {
      title: titleElement?.textContent?.trim(),
      company: companyElement?.textContent?.trim(),
      location: locationElement?.textContent?.trim(),
      description: descriptionElement?.textContent?.substring(0, 100) + '...'
    });
    
    if (!titleElement || !companyElement || !descriptionElement) {
      console.log('Jobflux: Missing required elements for LinkedIn job data');
      return null;
    }
    
    return {
      title: titleElement.textContent.trim(),
      company: companyElement.textContent.trim(),
      location: locationElement ? locationElement.textContent.trim() : '',
      description: descriptionElement.textContent.trim(),
      url: window.location.href,
      source: 'LinkedIn'
    };
  } catch (error) {
    console.error('Jobflux: Error extracting LinkedIn job data:', error);
    return null;
  }
}

// Extract job data from Wellfound
function extractWellfoundJobData() {
  try {
    // Job title
    const titleElement = document.querySelector('h1') ||
                        document.querySelector('[data-testid="job-title"]');
    
    // Company name
    const companyElement = document.querySelector('[data-testid="company-name"]') ||
                          document.querySelector('.company-name') ||
                          document.querySelector('a[href*="/company/"]');
    
    // Location
    const locationElement = document.querySelector('[data-testid="location"]') ||
                           document.querySelector('.location');
    
    // Job description
    const descriptionElement = document.querySelector('[data-testid="job-description"]') ||
                              document.querySelector('.job-description') ||
                              document.querySelector('.description');
    
    if (!titleElement || !companyElement || !descriptionElement) {
      return null;
    }
    
    return {
      title: titleElement.textContent.trim(),
      company: companyElement.textContent.trim(),
      location: locationElement ? locationElement.textContent.trim() : '',
      description: descriptionElement.textContent.trim(),
      url: window.location.href,
      source: 'Wellfound'
    };
  } catch (error) {
    console.error('Jobflux: Error extracting Wellfound job data:', error);
    return null;
  }
}

// Extract job data from Indeed
function extractIndeedJobData() {
  try {
    // Job title
    const titleElement = document.querySelector('[data-testid="jobsearch-JobInfoHeader-title"]') ||
                        document.querySelector('h1') ||
                        document.querySelector('.jobsearch-JobInfoHeader-title');
    
    // Company name
    const companyElement = document.querySelector('[data-testid="jobsearch-JobInfoHeader-companyName"]') ||
                          document.querySelector('.jobsearch-JobInfoHeader-companyName') ||
                          document.querySelector('a[data-company-name]');
    
    // Location
    const locationElement = document.querySelector('[data-testid="jobsearch-JobInfoHeader-locationText"]') ||
                           document.querySelector('.jobsearch-JobInfoHeader-locationText');
    
    // Job description
    const descriptionElement = document.querySelector('[data-testid="jobsearch-JobComponent-description"]') ||
                              document.querySelector('.jobsearch-JobComponent-description') ||
                              document.querySelector('#jobDescriptionText');
    
    if (!titleElement || !companyElement || !descriptionElement) {
      return null;
    }
    
    return {
      title: titleElement.textContent.trim(),
      company: companyElement.textContent.trim(),
      location: locationElement ? locationElement.textContent.trim() : '',
      description: descriptionElement.textContent.trim(),
      url: window.location.href,
      source: 'Indeed'
    };
  } catch (error) {
    console.error('Jobflux: Error extracting Indeed job data:', error);
    return null;
  }
}

// Inject Jobflux button into the page
function injectJobfluxButton() {
  // Remove existing button if present
  const existingButton = document.getElementById('jobflux-button');
  if (existingButton) {
    existingButton.remove();
  }
  
  // Create button
  const button = document.createElement('div');
  button.id = 'jobflux-button';
  button.className = 'jobflux-floating-button';
  button.innerHTML = `
    <div class="jobflux-button-content">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Jobflux</span>
    </div>
  `;
  
  // Add click handler
  button.addEventListener('click', () => {
    if (jobData) {
      openJobfluxPopup();
    } else {
      showNotification('No job data found. Please refresh the page.', 'error');
    }
  });
  
  // Add to page
  document.body.appendChild(button);
}

// Open Jobflux popup
function openJobfluxPopup() {
  // Remove existing popup if present
  const existingPopup = document.getElementById('jobflux-popup');
  if (existingPopup) existingPopup.remove();

  // Create popup container
  const popup = document.createElement('div');
  popup.id = 'jobflux-popup';
  popup.className = 'jobflux-popup';
  popup.innerHTML = `
    <div class="jobflux-popup-content">
      <div class="jobflux-popup-header">
        <h3>Jobflux - Generate Outreach</h3>
        <button class="jobflux-close-btn" id="jobflux-close-btn">×</button>
      </div>
      <div class="jobflux-popup-body">
        <div class="jobflux-job-summary">
          <h4>${jobData.title}</h4>
          <p><strong>${jobData.company}</strong> • ${jobData.location}</p>
        </div>
        <div class="jobflux-actions">
          <button id="generate-outreach" class="jobflux-btn jobflux-btn-primary">
            Generate Outreach Message
          </button>
          <button id="copy-job-data" class="jobflux-btn jobflux-btn-secondary">
            Copy Job Data
          </button>
        </div>
        <div id="jobflux-result" class="jobflux-result" style="display: none;">
          <div class="jobflux-loading">Generating your personalized message...</div>
        </div>
      </div>
    </div>
  `;

  // Add to page
  document.body.appendChild(popup);

  // Attach event listeners
  document.getElementById('generate-outreach').onclick = generateOutreach;
  document.getElementById('copy-job-data').onclick = copyJobData;
  document.getElementById('jobflux-close-btn').onclick = () => popup.remove();

  // Close popup when clicking outside
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.remove();
    }
  });

  // Event delegation for dynamically generated copy buttons
  popup.addEventListener('click', function(e) {
    if (e.target.classList.contains('jobflux-copy-btn')) {
      copyToClipboard(e.target.previousElementSibling.textContent);
    }
    if (e.target.classList.contains('jobflux-btn-primary') && e.target.textContent.includes('Send Email')) {
      sendEmail();
    }
    if (e.target.classList.contains('jobflux-btn-secondary') && e.target.textContent.includes('Save to Notion')) {
      const message = e.target.closest('.jobflux-outreach-content')?.textContent || '';
      saveToNotion(message);
    }
  });
}

// Generate outreach message
async function generateOutreach() {
  const generateBtn = document.getElementById('generate-outreach');
  const resultDiv = document.getElementById('jobflux-result');
  
  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = '<div class="jobflux-loading">Generating your personalized message...</div>';
  
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'generateOutreach',
      jobData: jobData
    });
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    displayOutreachResult(response);
  } catch (error) {
    resultDiv.innerHTML = `
      <div class="jobflux-error">
        <p>Error: ${error.message}</p>
        <p>Please check your API key in the extension settings.</p>
      </div>
    `;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate Outreach Message';
  }
}

// Display outreach result
function displayOutreachResult(response) {
  const resultDiv = document.getElementById('jobflux-result');
  
  // Parse the response to separate different sections
  const content = response.message;
  const sections = content.split(/\d+\.\s+/).filter(section => section.trim());
  
  let html = '<div class="jobflux-outreach-content">';
  
  if (sections.length >= 3) {
    html += `
      <div class="jobflux-section">
        <h4>Job Summary</h4>
        <p>${sections[0].trim()}</p>
      </div>
      <div class="jobflux-section">
        <h4>LinkedIn DM</h4>
        <div class="jobflux-message">
          <p>${sections[1].trim()}</p>
          <button class="jobflux-copy-btn" onclick="copyToClipboard(this.previousElementSibling.textContent)">
            Copy Message
          </button>
        </div>
      </div>
      <div class="jobflux-section">
        <h4>Email Cover Letter</h4>
        <div class="jobflux-message">
          <p>${sections[2].trim()}</p>
          <button class="jobflux-copy-btn" onclick="copyToClipboard(this.previousElementSibling.textContent)">
            Copy Letter
          </button>
        </div>
      </div>
    `;
  } else {
    html += `<p>${content}</p>`;
  }
  
  html += `
    <div class="jobflux-actions">
      <button class="jobflux-btn jobflux-btn-secondary" onclick="saveToNotion('${response.message.replace(/'/g, "\\'")}')">
        Save to Notion
      </button>
      <button class="jobflux-btn jobflux-btn-primary" onclick="sendEmail()">
        Send Email
      </button>
    </div>
  </div>`;
  
  resultDiv.innerHTML = html;
}

// Copy job data to clipboard
function copyJobData() {
  const data = {
    title: jobData.title,
    company: jobData.company,
    location: jobData.location,
    description: jobData.description,
    url: jobData.url
  };
  
  navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
    showNotification('Job data copied to clipboard!', 'success');
  });
}

// Copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Copied to clipboard!', 'success');
  });
}

// Save to Notion
async function saveToNotion(message) {
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'saveToNotion',
      jobData: jobData,
      message: message
    });
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    showNotification('Saved to Notion successfully!', 'success');
  } catch (error) {
    showNotification(`Error saving to Notion: ${error.message}`, 'error');
  }
}

// Send email
function sendEmail() {
  const subject = `Application for ${jobData.title} position at ${jobData.company}`;
  const body = encodeURIComponent(`Dear Hiring Manager,\n\nI am writing to express my interest in the ${jobData.title} position at ${jobData.company}.\n\n[Your personalized message here]\n\nBest regards,\n[Your name]`);
  
  window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${body}`);
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `jobflux-notification jobflux-notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getJobData') {
    sendResponse(jobData);
  }
}); 