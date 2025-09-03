/**
 * Flexible Spam Nuker for Gmail
 * - Scans recent emails
 * - Uses OpenAI API for configurable semantic spam detection
 * - Moves detected spam to Gmail Spam
 * 
 * Instructions:
 * 1. Copy this script into https://script.google.com/
 * 2. Replace OPENAI_API_KEY with your own key from https://platform.openai.com/
 * 3. Save, run `filterRecruiterSpam()`, and set up a time-based trigger (e.g. hourly)
 */

const config = {
  detect: ['recruiter spam', 'office leasing outreach'],
  model: 'gpt-3.5-turbo',
  bodyChars: 1200,
  cadenceHrs: 1,
}

// Set in Apps Script project settings UI
var OPENAI_API_KEY = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY')


// Main function: scans inbox, checks for spam, moves to spam
function filterRecruiterSpam() {
  // Search for emails from the last 1 day (adjust as needed)
  var threads = GmailApp.search('newer_than:1d');
  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    for (var j = 0; j < messages.length; j++) {
      var msg = messages[j];

      // Semantic check via OpenAI
      var subject = msg.getSubject()
      var body = msg.getPlainBody().substring(0, config.bodyChars);
      var checkString = `<subject>${subject}</subject>\n<body>${body}</body>`
      if (isConfiguredSpam(checkString)) {
        threads[i].moveToSpam();
        break;
      }
    }
  }
}

function isConfiguredSpam(emailText) {
  var prompt = `Is the following email a ${config.detect.join(' OR ')} message? Reply with only 'yes' or 'no'.\n\n` + emailText;
  var response = callOpenAI(prompt);
  return response.trim().toLowerCase().startsWith("yes");
}

function callOpenAI(prompt) {
  var url = "https://api.openai.com/v1/chat/completions";
  var payload = {
    "model": config.model,
    "messages": [
      { "role": "system", "content": "You are an email classifier." },
      { "role": "user", "content": prompt }
    ],
    "max_tokens": 5,
    "temperature": 0
  };
  var options = {
    "method": "post",
    "contentType": "application/json",
    "headers": {
      "Authorization": "Bearer " + OPENAI_API_KEY
    },
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };
  try {
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());
    var reply = json.choices[0].message.content;
    return reply;
  } catch (e) {
    Logger.log("OpenAI API error: " + e);
    return "no";
  }
}
