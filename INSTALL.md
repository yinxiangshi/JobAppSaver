# Installation Guide

## Quick Install Steps

1. **Download all files** from this folder to your computer
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable Developer mode** (toggle switch in top right)
4. **Click "Load unpacked"** button
5. **Select the folder** containing all the extension files
6. **Pin the extension** to your toolbar (click the puzzle piece icon)

## What You'll See

- **Extension icon** in your Chrome toolbar
- **Blue floating button** on job pages
- **Right-click menu** option "Save job to tracker"
- **Keyboard shortcut** Ctrl+Shift+S (or Cmd+Shift+S on Mac)

## Testing the Extension

1. **Open the test.html file** in Chrome to see the floating button
2. **Click the extension icon** to open the popup
3. **Click "Open Dashboard →"** to view saved jobs

## Troubleshooting

- **Extension not loading**: Make sure all files are in the same folder
- **Button not appearing**: Check that Developer mode is enabled
- **Permission errors**: The extension needs storage and activeTab permissions

## Files Included

- `manifest.json` - Extension configuration
- `background.js` - Background service worker
- `contentScript.js` - Page interaction script
- `popup.html/js` - Extension popup
- `dashboard.html/js` - Job management dashboard
- `style.css` - Styling
- `icons/` - Extension icons
- `test.html` - Test page for verification
