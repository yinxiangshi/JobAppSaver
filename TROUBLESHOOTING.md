# Job Application Tracker - Troubleshooting Guide

## Issue 1: Company Name Not Detected

### Symptoms
- Company name shows as "Unknown Company"
- Company name is incorrect or incomplete
- Company name is missing even when visible on the page

### Solutions

#### 1. Check Page Structure
The extension uses multiple strategies to detect company names:
- **Strategy 1**: Common CSS selectors (`[data-company]`, `.company`, etc.)
- **Strategy 2**: Page title patterns ("Job Title at Company")
- **Strategy 3**: URL analysis (subdomain extraction)
- **Strategy 4**: Meta tags (`og:site_name`, `application-name`)
- **Strategy 5**: Image alt text and logos
- **Strategy 6**: Structured data (JSON-LD)
- **Strategy 7**: Open Graph tags

#### 2. Manual Company Detection
If automatic detection fails:
1. Use the context menu (right-click → "Save job to tracker")
2. Use the floating "Save to Job Tracker" button
3. Use the popup "Save Current Page" button

#### 3. Improve Company Detection
For specific websites, you can:
1. Check the page source for company information
2. Look for structured data in `<script type="application/ld+json">` tags
3. Check meta tags for company information
4. Look for company logos with descriptive alt text

## Issue 2: Extension Not Working on Specific Sites

### Common Job Sites
The extension is designed to work on:
- Lever.co
- Greenhouse.io
- Workday
- Ashbyhq.com
- MyWorkdayJobs.com
- General job posting sites

### Solutions
1. **Check if site is supported**: Look for the floating "Save to Job Tracker" button
2. **Use alternative methods**: Context menu, popup, or floating button
3. **Report unsupported sites**: The extension can be enhanced for new job platforms

## Issue 3: Data Not Saving

### Symptoms
- Jobs don't appear in the dashboard
- "Saved!" message appears but job is missing
- Storage errors in console

### Solutions

#### 1. Check Storage Permissions
1. Go to `chrome://extensions/`
2. Find Job Application Tracker
3. Ensure "Storage" permission is granted

#### 2. Clear and Reset
1. Go to `chrome://extensions/`
2. Click "Details" on Job Application Tracker
3. Click "Clear data"
4. Reload the extension

#### 3. Check Console for Storage Errors
1. Open Developer Tools
2. Look for storage-related error messages
3. Check if the extension has write permissions

## Issue 4: Extension Crashes or Freezes

### Symptoms
- Extension popup doesn't open
- Background script errors
- Extension becomes unresponsive

### Solutions

#### 1. Restart Extension
1. Go to `chrome://extensions/`
2. Toggle the extension off and on
3. Refresh any open job pages

#### 2. Check for Conflicts
1. Disable other extensions temporarily
2. Test if the issue persists
3. Re-enable extensions one by one

#### 3. Reinstall Extension
1. Remove the extension completely
2. Clear browser cache
3. Reinstall from the source

## Issue 5: Dashboard Not Loading or Displaying Incorrectly

### Symptoms
- Dashboard shows blank page
- Styling looks broken
- Jobs don't appear in the table

### Solutions

#### 1. Check File Loading
1. Ensure all CSS and JavaScript files are properly loaded
2. Check browser console for 404 errors
3. Verify the extension files are complete

#### 2. Clear Browser Cache
1. Clear Chrome's cache and cookies
2. Reload the dashboard page
3. Try opening in an incognito window

#### 3. Check Extension Permissions
1. Go to `chrome://extensions/`
2. Ensure all required permissions are granted
3. Check for any permission errors

## Getting Help

### Debug Information
When reporting issues, include:
1. Browser version and OS
2. Extension version
3. Console error messages
4. Steps to reproduce the issue
5. URL of the problematic job page

### Test Page
Use the included `test.html` file to verify basic functionality:
1. Open test.html in your browser
2. Try all saving methods
3. Check if company name is detected correctly
4. Verify data appears in the dashboard

### Common Debug Commands
- Check browser console for extension messages
- Use `chrome://extensions/` to monitor extension status
- Verify extension files are properly loaded
