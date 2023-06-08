// Client ID and API key from the Google Developers Console
const CLIENT_ID = '79115543673-k3jsff4pelihartghfl0ll7g6kl70883.apps.googleusercontent.com';
const API_KEY = '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';

// ID of the Google Sheet where you want to store the data
const SPREADSHEET_ID = 'https://docs.google.com/spreadsheets/d/1deHbVvacMav5EucOmsaz7SF9btj35GCcq00wbwMAWiE/edit#gid=0';

// Array to store enter and exit times
let records = [];

// Load the Google Sheets API
function loadSheetsApi() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    scope: 'https://www.googleapis.com/auth/spreadsheets',
  }).then(() => {
    // API is loaded successfully
    console.log('Google Sheets API loaded.');

    // Retrieve existing records from the Google Sheet
    retrieveRecords();
  }, (error) => {
    console.error('Error loading Google Sheets API:', error);
  });
}

// Record the enter time
function recordEnterTime() {
  const currentTime = new Date().toLocaleString();
  records.push(['Enter', currentTime]);

  // Update the Google Sheet with the new record
  updateSheet();
}

// Record the exit time
function recordExitTime() {
  const currentTime = new Date().toLocaleString();
  records.push(['Exit', currentTime]);

  // Update the Google Sheet with the new record
  updateSheet();
}

// Update the Google Sheet with the records
function updateSheet() {
  gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A1:B',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: records
    }
  }).then(() => {
    console.log('Data updated successfully.');

    // Clear the records array
    records = [];

    // Display success message or perform other actions
  }, (error) => {
    console.error('Error updating data:', error);
  });
}

// Retrieve existing records from the Google Sheet
function retrieveRecords() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A:B',
  }).then((response) => {
    const values = response.result.values;
    if (values && values.length > 0) {
      records = values;
    }
  }, (error) => {
    console.error('Error retrieving data:', error);
  });
}

// Initialize the app
function initApp() {
  document.getElementById('enterBtn').addEventListener('click', recordEnterTime);
  document.getElementById('exitBtn').addEventListener('click', recordExitTime);

  gapi.load('client', loadSheetsApi);
}

// Load the app when the API library is ready
gapi.load('client:auth2', initApp);
