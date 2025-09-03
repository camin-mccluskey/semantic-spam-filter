# Semantic Spam Delete - Gmail Apps Script Template
[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

Allows filtering and flagging Gmail emails spam using natural language. Set up a cron trigger to clear your inbox of the
email you never want, at regular intervals.

## Installation & Apps Script Configuration

After cloning this template repo, run `pnpm install`. This will install [Clasp](https://github.com/google/clasp?tab=readme-ov-file#clasp-run) locally to work with your deployed 
Apps Script application. Then run `clasp login` to authenticate with your Google account.

Now initialise a new apps script:

```
pnpm run init
```

This will push a new standalone script to your Google Drive with the name 'Semantic Spam Delete'. Run `clasp open-script` 
to view the project. You'll now need to do 2 pieces of setup in the UI.

### Add your OpenAI API Key

In the left side settings menu at the bottom of the page you'll find a section called "Script Properties". Create a key
value pair there:

```
OPENAI_API_KEY :: <your-openai-key>
```

You can, of course, use any LLM model/provider with appropriate code changes.

At this point you can test your script in the editor UI by running the `main()` function.

### Configuring a trigger

Finally, you'll need to configure a cron trigger to clear your inbox at a predefined schedule. You can do this in the left
side triggers menu. Click "Add trigger" and configure the time period you'd like. All other settings can remain at their
defaults.

## Spam Detection Configuration

Everyone's definition of spam is different, you can edit the types of emails that you consider spam in the 
`config.detect` field at the top of the `./src/index.js` file.

## Deployment

To deploy your script:

```
pnpm run deploy
```

And that should be it. Depending on your cron schedule you'll see your spam folder fill up with the emails you never
wanted to see.

## Further Reading

If you want to make alterations to your deployment, tail logs, or test locally, you can follow the [Clasp](https://github.com/google/clasp?tab=readme-ov-file#clasp-run) 
documentation.
