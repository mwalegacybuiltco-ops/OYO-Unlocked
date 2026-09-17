# Live OYO Compass integration

The initial placeholder has been replaced with a real request implementation derived from the user's existing Compass Functions architecture. Both use Firebase Secret Manager `OPENAI_API_KEY`, the `OPENAI_MODEL` parameter with the existing default `gpt-5`, and the Responses API. No different provider or model has been introduced.

`functions/adapters/compass.js` implements `guideReply` and `assessBoss`. `callCompass` makes a server-side request using the same API, a 45-second timeout, and no scripted fallback. The two callables in `functions/index.js` explicitly bind the secret. The Guide output is bounded text; boss output uses strict JSON schema and requires understanding, action, and checking criteria all to pass. It also generates a next objection reacting to the player response, which is persisted into the next round. The server still controls prerequisites, stale-response rejection, rewards, and world unlocks.

The role/level/rubric is a server-owned system instruction. Player messages, profiles, evidence summaries, and history are serialized into a separate untrusted user input. Raw files are not automatically sent. Provider response storage is disabled (`store:false`); the app stores a bounded history in the player's private Firestore state. Evidence verification remains an authorised human-review process, not an AI assertion that an event happened.

Official schema reference: [Structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs).

Source provenance: the user's OYO Compass `functions/index.js` in the saved July 15 project. That source used the OpenAI JavaScript SDK; this adapter uses the native HTTP transport of the same Responses API so no additional provider dependency is necessary. The existing model choice and secret names are preserved. A local mock test confirms request structure and error handling; an actual service call still needs project deployment and the secret.

Deploy only after confirming the destination. In a separate Firebase project, set the existing authorised credential with `firebase functions:secrets:set OPENAI_API_KEY`. Do not hard-code or copy the secret into source. If reusing the Compass Firebase project, first prepare isolated Hosting and merge rules; do not overwrite Compass's current app or access rules.
