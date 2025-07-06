# AutoScout - AI Job Scraper & Cold Outreach Automator

💼 A free Chrome extension that auto-detects jobs on LinkedIn, Wellfound, or Indeed, scrapes key job info, and generates a customized cover letter/email + outreach message using free LLM APIs — then lets the user send it via LinkedIn DM, email, or Notion save.

## 🚀 Features

### Core Features
- **Smart Job Detection**: Automatically detects job listings on LinkedIn, Wellfound, and Indeed
- **AI-Powered Outreach**: Generates personalized LinkedIn DMs and email cover letters using OpenRouter's free LLM models
- **One-Click Actions**: Copy messages to clipboard, send emails, or save to Notion
- **Recent Job History**: Track and revisit previously viewed jobs
- **Customizable Settings**: Adjust message tone, length, and personal information

### Advanced Features
- **Smart Matching Engine**: Rates match between job post and your resume via keyword overlap
- **Multi-Platform Support**: Works seamlessly across LinkedIn, Wellfound, and Indeed
- **Notion Integration**: Save jobs and generated messages directly to your Notion database
- **Professional UI**: Modern, intuitive interface with smooth animations
- **Real-time Processing**: Instant job data extraction and message generation

## 🛠 Tech Stack

- **Frontend**: Vanilla JavaScript, Chrome Extension Manifest v3
- **AI/LLM**: OpenRouter API (free models like Mixtral, Gemma, Claude)
- **Storage**: Chrome Storage API, Notion API (optional)
- **Styling**: Modern CSS with gradients and animations
- **APIs**: OpenRouter, Notion, Chrome Extension APIs

## 📦 Installation

### Method 1: Load Unpacked Extension (Development)

1. **Clone or Download** this repository
   ```bash
   git clone https://github.com/yourusername/autoscout-extension.git
   cd autoscout-extension
   ```

2. **Open Chrome** and navigate to `chrome://extensions/`

3. **Enable Developer Mode** by toggling the switch in the top right

4. **Click "Load unpacked"** and select the `autoscout` folder

5. **Pin the extension** to your toolbar for easy access

### Method 2: Chrome Web Store (Coming Soon)

1. Visit the Chrome Web Store
2. Search for "AutoScout"
3. Click "Add to Chrome"
4. Follow the setup instructions

## ⚙️ Setup & Configuration

### 1. Get Your OpenRouter API Key

1. Visit [OpenRouter.ai](https://openrouter.ai)
2. Sign up for a free account
3. Navigate to your API keys section
4. Copy your API key (starts with `sk-or-v1-`)

### 2. Configure the Extension

1. **Click the AutoScout extension icon** in your Chrome toolbar
2. **Go to the Settings tab**
3. **Enter your OpenRouter API key** in the designated field
4. **Add your resume summary** (optional but recommended for better personalization)
5. **Adjust your preferences**:
   - Message tone (Professional, Friendly, Enthusiastic, Formal)
   - Maximum message length
   - Include salary discussion

### 3. Optional: Notion Integration

1. **Create a Notion integration**:
   - Go to [Notion Integrations](https://www.notion.so/my-integrations)
   - Click "New integration"
   - Give it a name and select your workspace
   - Copy the integration token

2. **Create a Notion database** with these properties:
   - Job Title (Title)
   - Company (Text)
   - URL (URL)
   - Status (Select)
   - Date Applied (Date)

3. **Get your database ID**:
   - Open your database in Notion
   - Copy the ID from the URL (the part after the last slash)

4. **Add to extension settings**:
   - Paste your Notion API key
   - Paste your database ID

## 🎯 How to Use

### Basic Usage

1. **Navigate to a job listing** on LinkedIn, Wellfound, or Indeed
2. **Look for the AutoScout floating button** (bottom right corner)
3. **Click the button** to open the AutoScout popup
4. **Click "Generate Outreach"** to create personalized messages
5. **Copy, send, or save** your generated content

### Using the Extension Popup

1. **Click the extension icon** in your Chrome toolbar
2. **View current job information** (if on a job page)
3. **Generate outreach messages** directly from the popup
4. **Access recent jobs** and settings

### Advanced Features

#### Custom Message Tones
- **Professional**: Formal, business-like language
- **Friendly**: Warm, approachable tone
- **Enthusiastic**: Energetic and passionate
- **Formal**: Traditional business correspondence

#### Notion Integration
- **Automatic saving**: Jobs and messages saved to your Notion database
- **Structured data**: Organized with job title, company, URL, and status
- **Rich content**: Includes generated messages and job descriptions

#### Recent Jobs
- **Track applications**: View your recent job interactions
- **Quick access**: Click to revisit job listings
- **Application history**: Keep track of your job search progress

## 🔧 Development

### Project Structure
```
autoscout/
├── manifest.json          # Extension configuration
├── background.js          # Service worker
├── content.js            # Content script for job sites
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── styles.css            # Styling for popup and content
├── utils/
│   ├── summarizer.js     # Job analysis utilities
│   └── prompt_templates.js # AI prompt templates
└── README.md             # This file
```

### Key Components

#### Content Script (`content.js`)
- Detects job pages on supported sites
- Extracts job data (title, company, description)
- Injects floating AutoScout button
- Handles user interactions on job pages

#### Background Script (`background.js`)
- Manages API calls to OpenRouter
- Handles Notion integration
- Stores user settings and recent jobs
- Processes messages between components

#### Popup Interface (`popup.html/js`)
- Settings management
- Job information display
- Recent jobs tracking
- Message generation interface

### Adding New Job Sites

To add support for new job sites:

1. **Update `manifest.json`**:
   ```json
   "content_scripts": [
     {
       "matches": [
         "https://*.newsite.com/jobs/*"
       ],
       "js": ["content.js"]
     }
   ]
   ```

2. **Add extraction function in `content.js`**:
   ```javascript
   function extractNewSiteJobData() {
     // Add DOM selectors for the new site
     const titleElement = document.querySelector('.job-title');
     const companyElement = document.querySelector('.company-name');
     // ... more selectors
     
     return {
       title: titleElement.textContent.trim(),
       company: companyElement.textContent.trim(),
       // ... more fields
     };
   }
   ```

3. **Update the main extraction logic**:
   ```javascript
   if (url.includes('newsite.com')) {
     jobData = extractNewSiteJobData();
   }
   ```

## 🎨 Customization

### Styling
The extension uses modern CSS with CSS custom properties. You can customize:
- Color scheme in `styles.css`
- Button styles and animations
- Modal and popup appearances

### Prompts
Modify AI prompts in `utils/prompt_templates.js`:
- Adjust message tones
- Add new templates
- Customize system prompts

### Features
Extend functionality by:
- Adding new API integrations
- Implementing additional export options
- Creating custom job analysis tools

## 🔒 Privacy & Security

- **Local Processing**: Job data is processed locally in your browser
- **API Keys**: Stored securely in Chrome's local storage
- **No Data Collection**: We don't collect or store your personal information
- **Open Source**: Transparent code for security review

## 🐛 Troubleshooting

### Common Issues

**Extension not detecting jobs**
- Refresh the job page
- Check if the site is supported (LinkedIn, Wellfound, Indeed)
- Ensure the extension is enabled

**API errors**
- Verify your OpenRouter API key is correct
- Check your internet connection
- Ensure you have sufficient API credits

**Notion integration not working**
- Verify your Notion API key and database ID
- Ensure your database has the required properties
- Check that your integration has access to the database

**Messages not generating**
- Check your OpenRouter API key
- Verify your resume summary is added
- Try refreshing the page and regenerating

### Debug Mode

Enable debug logging:
1. Open Chrome DevTools
2. Go to the Console tab
3. Look for "AutoScout:" prefixed messages

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly** on supported job sites
5. **Submit a pull request**

### Development Setup

1. **Clone the repository**
2. **Load as unpacked extension** in Chrome
3. **Make changes** to the code
4. **Reload the extension** in `chrome://extensions/`
5. **Test your changes**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenRouter** for providing free LLM API access
- **Notion** for their excellent API and database features
- **Chrome Extension community** for documentation and examples
- **Job seekers everywhere** for inspiration and feedback

## 📞 Support

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check this README and inline code comments
- **Community**: Join our discussions for help and tips

## 🚀 Roadmap

### Upcoming Features
- [ ] Google Docs integration
- [ ] Job post tracking and notifications
- [ ] AI-based resume critique
- [ ] Multi-language support
- [ ] Advanced job matching algorithms
- [ ] Integration with more job sites
- [ ] Mobile app companion

### Version History
- **v1.0.0**: Initial release with core features
- **v1.1.0**: Added Notion integration
- **v1.2.0**: Enhanced job matching and UI improvements

---

**Made with ❤️ for job seekers everywhere**

*AutoScout - Your AI-powered job hunting companion* 