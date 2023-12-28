# Email Responder

This Node.js server automates email replies for your Gmail account while you're away.

## Features

- Checks for new, unread emails in your Gmail inbox.
- Sends a pre-defined reply to emails that have no prior replies from you.
- Adds a custom label (e.g., "Auto Replied") to replied emails and moves them to the label.
- Repeats the check and reply process at random intervals between 45 and 120 seconds.

## Prerequisites

- Node.js and npm installed
- A Google Cloud Platform project with the Gmail API enabled
- OAuth client credentials for your project

## Installation

- Clone this repository.
- Navigate to the project directory in your terminal
- Run `npm install` to install dependencies.

## Setup

- Create a `credentials.json` to add your API credentials. Add your gmail api secrets inside JSON file.
- File content will look like this:

```json
{
  "web": {
    "client_id": "",
    "project_id": "",
    "auth_uri": "",
    "token_uri": "",
    "auth_provider_x509_cert_url": "",
    "client_secret": "",
    "redirect_uris": ["http://localhost:3000/oauth2callback"]
  }
}
```

- Fill empty fields with your credentials

## Running the Server

- Run `npm start` to start the server.

## Testing

- Send a test email to your Gmail account.
- The server should automatically send a reply after a random interval.

## Additional Notes

- The reply message content can be customized in the code.
- The label name can also be modified in the code.
- Refer to the official Google APIs documentation for more information on the Gmail API and OAuth authentication.
