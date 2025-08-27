# Job Application Tracker Chrome Extension

A Chrome extension that helps you automatically track your job applications by saving job information from any website.

## Features

- **Automatic Job Detection**: Automatically detects job pages on popular job sites (Lever, Greenhouse, Workday, Ashby, etc.)
- **Floating Save Button**: A blue floating button appears on job pages for easy saving
- **Multiple Save Methods**: 
  - Floating button on job pages
  - Right-click context menu
  - Keyboard shortcut (Ctrl/Cmd + Shift + S)
  - Extension popup button
- **Rich Data Extraction**: Automatically extracts:
  - Job title
  - Company name
  - Location
  - Application date
  - Source URL
- **Dashboard**: View and manage all saved applications in a local dashboard
- **Export Options**: Export your data as CSV or JSON
- **Search & Filter**: Search through applications and filter by status

## Installation

1. **Download the extension files** to a folder on your computer
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable Developer mode** (toggle in the top right)
4. **Click "Load unpacked"** and select the folder containing the extension files
5. **Pin the extension** to your toolbar for easy access

## How to Use

### Saving a Job Application

1. **Navigate to a job page** on any job site
2. **Look for the blue "Save to Job Tracker" button** that appears in the bottom right corner
3. **Click the button** to save the job information
4. **You'll see a notification** confirming the job was saved

### Alternative Save Methods

- **Right-click** anywhere on the page and select "Save job to tracker"
- **Use the keyboard shortcut** Ctrl+Shift+S (or Cmd+Shift+S on Mac)
- **Click the extension icon** and use the "Save Current Page" button

### Viewing Saved Applications

1. **Click the extension icon** and click "Open Dashboard →"
2. **Or right-click the extension icon** and select "Options"
3. **View all your saved applications** in a table format
4. **Edit any field** by clicking on it
5. **Change status** using the dropdown (applied, interview, offer, rejected)
6. **Delete applications** using the trash button
7. **Export your data** using the CSV or JSON buttons

### Features in the Dashboard

- **Search**: Search through job titles, companies, and locations
- **Status Filter**: Filter applications by status
- **Inline Editing**: Click any field to edit it
- **Export**: Download your data as CSV or JSON
- **Direct Links**: Click "Open" to visit the original job posting

## Supported Job Sites

The extension automatically detects and works on:
- Lever.co
- Greenhouse.io
- Workday
- Ashbyhq.com
- MyWorkdayJobs.com
- And many more (uses generic detection for other sites)

## Data Storage

All your job application data is stored locally in your browser using Chrome's local storage. Your data never leaves your computer and is not shared with any external services.

## Keyboard Shortcuts

- **Ctrl+Shift+S** (Windows/Linux) or **Cmd+Shift+S** (Mac): Save current page as job application

## Troubleshooting

- **Button not appearing**: Make sure you're on a job page. The extension detects job pages automatically.
- **Data not saving**: Check that the extension has the necessary permissions in `chrome://extensions/`
- **Dashboard not loading**: Try refreshing the page or restarting Chrome

## Development

This extension is built with:
- Vanilla JavaScript
- Chrome Extension Manifest V3
- Content scripts for page interaction
- Background service worker for data management

## License

This project is open source and available under the MIT License.
