# Job Application Tracker

A Chrome extension to save job applications from any website and track them in a local dashboard.

## Features

- **Multiple Save Methods**: Context menu, floating button, or popup
- **Smart Company Detection**: Uses 8 different strategies to identify company names
- **Automatic Job Detection**: Works on popular job sites (Lever, Greenhouse, Workday, etc.)
- **Local Storage**: All data stored locally in your browser
- **Beautiful Dashboard**: Modern, responsive interface to view and manage applications
- **Cross-Platform**: Works on Windows, Mac, and Linux

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the folder containing the extension
5. The extension icon should appear in your toolbar

## Usage

### Method 1: Context Menu
- Right-click anywhere on a job page
- Select "Save job to tracker"

### Method 2: Floating Button
- On supported job sites, a blue "Save to Job Tracker" button will appear
- Click it to save the current job

### Method 3: Extension Popup
- Click the extension icon in your toolbar
- Click "Save Current Page"

### Viewing Your Jobs
- Click the extension icon → "View Dashboard"
- Or right-click the extension icon → "Options"

## Company Name Detection

The extension uses 8 different strategies to identify company names:

1. **CSS Selectors**: Common company-related CSS classes and attributes
2. **Page Title Patterns**: Extracts company from titles like "Job at Company"
3. **URL Analysis**: Identifies company from subdomains and paths
4. **Meta Tags**: Reads company information from page metadata
5. **Image Alt Text**: Extracts company names from logo alt text
6. **Structured Data**: Parses JSON-LD schema markup
7. **Open Graph Tags**: Reads social media metadata
8. **Navigation Elements**: Searches breadcrumbs and navigation for company names

This multi-strategy approach ensures company names are detected even when they're displayed as images or logos.

## Troubleshooting

### Company Name Not Detected?
1. The extension will try multiple detection strategies automatically
2. Use the context menu or floating button as alternatives
3. Check the troubleshooting guide for detailed solutions

### Need Help?
- Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
- Use the test.html file to verify functionality
- Check browser console for error messages

## Supported Job Sites

- Lever.co
- Greenhouse.io
- Workday
- Ashbyhq.com
- MyWorkdayJobs.com
- General job posting sites

## Development

### Project Structure
```
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── contentScript.js       # Content script for job detection
├── popup.html/js         # Extension popup interface
├── dashboard.html/js      # Job management dashboard
├── style.css             # Styling
├── icons/                # Extension icons
├── test.html             # Test page for debugging
└── TROUBLESHOOTING.md    # Troubleshooting guide
```

### Recent Improvements
- **Enhanced Company Detection**: Added 8 different strategies for better company name identification
- **Beautiful UI**: Modern, gradient-based design with smooth animations
- **Image Logo Support**: Company names can now be extracted from image alt text
- **Structured Data Support**: Added JSON-LD schema markup parsing
- **Better Error Handling**: Improved error handling and user feedback
- **Responsive Dashboard**: Beautiful, modern dashboard interface

### Testing
1. Open `test.html` in your browser
2. Try all save methods (context menu, floating button, etc.)
3. Verify company name detection works correctly
4. Check that jobs appear in the dashboard

## Contributing

Feel free to submit issues and enhancement requests! The extension is designed to be easily extensible for new job sites and features.

## License

This project is open source and available under the [MIT License](LICENSE).
