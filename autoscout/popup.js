/**
 * Jobflux Chrome Extension - Popup Script
 * Created by Tooba Jatoi
 * Copyright © 2024 Tooba Jatoi. All rights reserved.
 */

document.addEventListener('DOMContentLoaded', () => {
  initializePopup();
});

let currentJobData = null;
let generatedContent = null;

// Initialize popup
async function initializePopup() {
  setupTabNavigation();
  loadSettings();
  checkCurrentPage();
  loadRecentJobs();
  setupEventListeners();
}

// Setup tab navigation
function setupTabNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab;
      
      // Update active nav button
      navButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update active tab content
      tabContents.forEach(tab => tab.classList.remove('active'));
      document.getElementById(targetTab).classList.add('active');
    });
  });
}

// Load settings from storage
async function loadSettings() {
  try {
    const settings = await chrome.runtime.sendMessage({ action: 'getSettings' });
    
    document.getElementById('openrouter-key').value = settings.openRouterApiKey || '';
    document.getElementById('notion-key').value = settings.notionApiKey || '';
    document.getElementById('notion-database').value = settings.notionDatabaseId || '';
    document.getElementById('user-resume').value = settings.userResume || '';
    
    if (settings.userPreferences) {
      document.getElementById('message-tone').value = settings.userPreferences.tone || 'professional';
      document.getElementById('max-length').value = settings.userPreferences.maxMessageLength || 500;
      document.getElementById('include-salary').checked = settings.userPreferences.includeSalary || false;
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

// Check current page for job data
async function checkCurrentPage() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (isJobSite(tab.url)) {
      // Try to get job data from content script
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getJobData' });
      
      if (response && response.title) {
        currentJobData = response;
        showJobInfo(response);
        updateStatus('Job detected', 'success');
      } else {
        showNoJob();
        updateStatus('No job data found', 'warning');
      }
    } else {
      showNoJob();
      updateStatus('Not a job site', 'info');
    }
  } catch (error) {
    console.error('Error checking current page:', error);
    showNoJob();
    updateStatus('Error checking page', 'error');
  }
}

// Check if URL is a job site
function isJobSite(url) {
  return (
    url.includes('linkedin.com/jobs/') ||
    url.includes('wellfound.com/jobs/') ||
    url.includes('indeed.com/viewjob') ||
    url.includes('indeed.com/job/')
  );
}

// Show job information
function showJobInfo(jobData) {
  document.getElementById('job-info').style.display = 'block';
  document.getElementById('no-job').style.display = 'none';
  
  document.getElementById('job-title').textContent = jobData.title;
  document.getElementById('job-company').textContent = jobData.company;
  document.getElementById('job-location').textContent = jobData.location || 'Location not specified';
}

// Show no job state
function showNoJob() {
  document.getElementById('job-info').style.display = 'none';
  document.getElementById('no-job').style.display = 'block';
}

// Update status indicator
function updateStatus(text, type = 'info') {
  const statusText = document.getElementById('status-text');
  const statusDot = document.getElementById('status-dot');
  
  statusText.textContent = text;
  statusDot.className = `status-dot status-${type}`;
}

// Load recent jobs from storage
async function loadRecentJobs() {
  try {
    const result = await chrome.storage.local.get(['recentJobs']);
    const recentJobs = result.recentJobs || [];
    
    const recentJobsList = document.getElementById('recent-jobs-list');
    recentJobsList.innerHTML = '';
    
    if (recentJobs.length === 0) {
      recentJobsList.innerHTML = '<p class="no-recent-jobs">No recent jobs</p>';
      return;
    }
    
    recentJobs.slice(0, 5).forEach(job => {
      const jobElement = createRecentJobElement(job);
      recentJobsList.appendChild(jobElement);
    });
  } catch (error) {
    console.error('Error loading recent jobs:', error);
  }
}

// Create recent job element
function createRecentJobElement(job) {
  const div = document.createElement('div');
  div.className = 'recent-job-item';
  div.innerHTML = `
    <div class="recent-job-content">
      <h4>${job.title}</h4>
      <p>${job.company}</p>
      <small>${new Date(job.timestamp).toLocaleDateString()}</small>
    </div>
    <button class="recent-job-action" data-url="${job.url}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 17L17 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7 7H17V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `;
  
  div.querySelector('.recent-job-action').addEventListener('click', () => {
    chrome.tabs.create({ url: job.url });
  });
  
  return div;
}

// Setup event listeners
function setupEventListeners() {
  // Generate outreach button
  document.getElementById('generate-btn').addEventListener('click', generateOutreach);
  
  // Copy job data button
  document.getElementById('copy-job-btn').addEventListener('click', copyJobData);
  
  // Settings buttons
  document.getElementById('save-settings').addEventListener('click', saveSettings);
  document.getElementById('reset-settings').addEventListener('click', resetSettings);
  
  // Modal buttons
  document.getElementById('close-modal').addEventListener('click', closeModal);
  document.getElementById('copy-all').addEventListener('click', copyAllContent);
  document.getElementById('save-notion').addEventListener('click', saveToNotion);
  document.getElementById('send-email').addEventListener('click', sendEmail);
  
  // Footer links
  document.getElementById('help-link').addEventListener('click', showHelp);
  document.getElementById('feedback-link').addEventListener('click', showFeedback);
}

// Generate outreach message
async function generateOutreach() {
  if (!currentJobData) {
    showNotification('No job data available', 'error');
    return;
  }
  
  const loadingOverlay = document.getElementById('loading-overlay');
  loadingOverlay.style.display = 'flex';
  
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'generateOutreach',
      jobData: currentJobData
    });
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    generatedContent = response;
    showResultModal(response);
    
    // Save to recent jobs
    await saveToRecentJobs(currentJobData);
    
  } catch (error) {
    showNotification(`Error: ${error.message}`, 'error');
  } finally {
    loadingOverlay.style.display = 'none';
  }
}

// Show result modal
function showResultModal(response) {
  const modal = document.getElementById('result-modal');
  const modalBody = document.getElementById('modal-body');
  
  // Parse the response to separate different sections
  const content = response.message;
  const sections = content.split(/\d+\.\s+/).filter(section => section.trim());
  
  let html = '<div class="outreach-content">';
  
  if (sections.length >= 3) {
    html += `
      <div class="outreach-section">
        <h4>Job Summary</h4>
        <p>${sections[0].trim()}</p>
      </div>
      <div class="outreach-section">
        <h4>LinkedIn DM</h4>
        <div class="message-content">
          <p>${sections[1].trim()}</p>
          <button class="copy-btn" onclick="copyToClipboard('${sections[1].trim().replace(/'/g, "\\'")}')">
            Copy Message
          </button>
        </div>
      </div>
      <div class="outreach-section">
        <h4>Email Cover Letter</h4>
        <div class="message-content">
          <p>${sections[2].trim()}</p>
          <button class="copy-btn" onclick="copyToClipboard('${sections[2].trim().replace(/'/g, "\\'")}')">
            Copy Letter
          </button>
        </div>
      </div>
    `;
  } else {
    html += `<p>${content}</p>`;
  }
  
  html += '</div>';
  
  modalBody.innerHTML = html;
  modal.style.display = 'flex';
}

// Close modal
function closeModal() {
  document.getElementById('result-modal').style.display = 'none';
}

// Copy job data
async function copyJobData() {
  if (!currentJobData) {
    showNotification('No job data available', 'error');
    return;
  }
  
  const data = {
    title: currentJobData.title,
    company: currentJobData.company,
    location: currentJobData.location,
    description: currentJobData.description,
    url: currentJobData.url
  };
  
  try {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    showNotification('Job data copied to clipboard!', 'success');
  } catch (error) {
    showNotification('Failed to copy job data', 'error');
  }
}

// Copy all content
async function copyAllContent() {
  if (!generatedContent) {
    showNotification('No content to copy', 'error');
    return;
  }
  
  try {
    await navigator.clipboard.writeText(generatedContent.message);
    showNotification('All content copied to clipboard!', 'success');
  } catch (error) {
    showNotification('Failed to copy content', 'error');
  }
}

// Save to Notion
async function saveToNotion() {
  if (!generatedContent || !currentJobData) {
    showNotification('No content to save', 'error');
    return;
  }
  
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'saveToNotion',
      jobData: currentJobData,
      message: generatedContent.message
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
  if (!currentJobData) {
    showNotification('No job data available', 'error');
    return;
  }
  
  const subject = `Application for ${currentJobData.title} position at ${currentJobData.company}`;
  const body = encodeURIComponent(`Dear Hiring Manager,\n\nI am writing to express my interest in the ${currentJobData.title} position at ${currentJobData.company}.\n\n[Your personalized message here]\n\nBest regards,\n[Your name]`);
  
  window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${body}`);
}

// Save settings
async function saveSettings() {
  const settings = {
    openRouterApiKey: document.getElementById('openrouter-key').value,
    notionApiKey: document.getElementById('notion-key').value,
    notionDatabaseId: document.getElementById('notion-database').value,
    userResume: document.getElementById('user-resume').value,
    userPreferences: {
      tone: document.getElementById('message-tone').value,
      maxMessageLength: parseInt(document.getElementById('max-length').value),
      includeSalary: document.getElementById('include-salary').checked
    }
  };
  
  try {
    await chrome.runtime.sendMessage({ action: 'saveSettings', settings });
    showNotification('Settings saved successfully!', 'success');
  } catch (error) {
    showNotification('Failed to save settings', 'error');
  }
}

// Reset settings
async function resetSettings() {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    try {
      await chrome.runtime.sendMessage({ action: 'saveSettings', settings: {
        openRouterApiKey: '',
        notionApiKey: '',
        notionDatabaseId: '',
        userResume: '',
        userPreferences: {
          tone: 'professional',
          includeSalary: false,
          maxMessageLength: 500
        }
      }});
      
      loadSettings();
      showNotification('Settings reset to defaults', 'success');
    } catch (error) {
      showNotification('Failed to reset settings', 'error');
    }
  }
}

// Save to recent jobs
async function saveToRecentJobs(jobData) {
  try {
    const result = await chrome.storage.local.get(['recentJobs']);
    const recentJobs = result.recentJobs || [];
    
    // Add new job to the beginning
    const newJob = {
      ...jobData,
      timestamp: Date.now()
    };
    
    // Remove duplicate if exists
    const filteredJobs = recentJobs.filter(job => job.url !== jobData.url);
    filteredJobs.unshift(newJob);
    
    // Keep only last 10 jobs
    const updatedJobs = filteredJobs.slice(0, 10);
    
    await chrome.storage.local.set({ recentJobs: updatedJobs });
    loadRecentJobs();
  } catch (error) {
    console.error('Error saving to recent jobs:', error);
  }
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Copy to clipboard (global function for onclick handlers)
window.copyToClipboard = async function(text) {
  try {
    await navigator.clipboard.writeText(text);
    showNotification('Copied to clipboard!', 'success');
  } catch (error) {
    showNotification('Failed to copy to clipboard', 'error');
  }
};

// Show help
function showHelp() {
  chrome.tabs.create({
    url: 'https://github.com/yourusername/autoscout-extension#readme'
  });
}

// Show feedback
function showFeedback() {
  chrome.tabs.create({
    url: 'https://github.com/yourusername/autoscout-extension/issues'
  });
} 