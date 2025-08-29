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

## Supported Job Sites

- Lever.co
- Greenhouse.io
- Workday
- Ashbyhq.com
- MyWorkdayJobs.com
- General job posting sites

## Contributing

Feel free to submit issues and enhancement requests! The extension is designed to be easily extensible for new job sites and features.

## License

This project is open source and available under the [MIT License](LICENSE).
