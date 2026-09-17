# OYO: UNLOCKED — Firebase + Community edition

This edition uses Firebase accounts and server-saved progress. It restores in-game community chat and keeps all nine worlds, 18 missions, expanded training, owner admin, LWA links, and Compass AI integration. It has not been deployed. Device-only gameplay is disabled; existing offline saves are not imported into trusted Firebase progress.

## Community

Signed-in players share a realtime room with the latest 100 messages. Messages are limited to 800 characters and 10 per minute. Players can report messages. Your registered owner account can remove messages, mute posting for 24 hours, and resolve reports. All writes go through authenticated server functions; player identity is taken from the saved profile. Establish your community guidelines and moderation routine before launch.

## Password recovery

Enable Email/Password authentication and configure authorized domains and password-reset email templates in Firebase. Character & settings includes sign-up, sign-in, and Forgot your password. Reset links use Firebase’s secure email flow. There is no hidden account bypass.

## Optional online services

- In Online account mode, accounts, player state, missions, evidence, XP, and unlocks use Firebase.
- Online proof requires your registered owner review; players cannot approve their own evidence.
- Guides and boss assessments use the same architecture found in the user's OYO Compass project: Firebase callable Functions, the `OPENAI_API_KEY` Secret Manager secret, the `OPENAI_MODEL` parameter (existing default `gpt-5`), and the Responses API.
- Guide context includes the player's business, verified work, Guide level, and recent conversation. Bosses use a structured three-part assessment, with all criteria required to pass.
- A provider outage, missing secret, refusal, incomplete response, or malformed assessment grants no rewards.
- No new provider or replacement model was selected. The transport uses the standard HTTP endpoint of the same API used by Compass.

The original Compass source was found in the user's separate July 15 workspace after the first delivery. Its saved `useLiveAICoach` flag was false; finding the implementation does not prove that its secret or callable is deployed.

## Online launch requirements

1. A confirmed Firebase destination for this app and a signed-in Firebase CLI.
2. Auth, Firestore, Storage, Functions, and Hosting enabled for that destination.
3. The existing Compass API credential stored as `OPENAI_API_KEY` in that project's Secret Manager.
4. Your sole owner account registered with the supplied trusted setup utility.
5. A tested deployment, including actual account creation, evidence review, a Guide reply, and a boss round.

**Do not deploy these standalone rules or hosting files over an existing Compass project without planning a separate Hosting site and merging database/storage rules.** The safe default is a separate Firebase project for UNLOCKED. The same AI architecture can be used there with the appropriate secret. No existing app has been overwritten.

## Quick visual preview

On a Mac, double-click `Open OYO Preview.command`. It serves the included `preview/` build at http://127.0.0.1:4181/ and opens your browser. Keep the launcher running. Node.js 22 or the existing bundled Codex runtime is required. Without Firebase, you can inspect the interface, but gameplay and accounts require configuration.

`index.html` is a web-app entry point, not a standalone document that can be opened directly from Finder. The included preview is a snapshot; rebuild with `pnpm build` after source changes and use `pnpm preview` to inspect that new build.

## Local setup for the live app

Install Node.js 22 and pnpm 11.19.0, then:

```sh
pnpm install --frozen-lockfile
cd functions
pnpm --ignore-workspace install --frozen-lockfile --ignore-scripts
cd ..
cp .env.example .env
```

Copy the six Firebase Web app config fields from the selected project's console to `.env`. Web app config is public in a browser build; private API credentials must never use a `VITE_` name. Firebase configuration is required in this edition.

```sh
pnpm dev
```

Without Firebase config, accounts, gameplay, and community are unavailable. Live mode needs deployed Functions even when the frontend is running locally. For isolated development, Firebase emulators remain supported through `VITE_USE_EMULATORS=true`; they are not a live deployment.

## Firebase deployment

Use a new, dedicated project unless an existing-project merge has been deliberately prepared. Enable Email/Password Auth, Firestore, and Storage. Confirm any billing requirements in Firebase; this repository does not activate billing.

```sh
npm install -g firebase-tools
firebase login
cp .firebaserc.example .firebaserc
# Replace the project placeholder in .firebaserc with the confirmed project ID.
cp functions/.env.example functions/.env.YOUR_PROJECT_ID
firebase functions:secrets:set OPENAI_API_KEY
# Enter the existing Compass API key only into Firebase's secure terminal prompt.
pnpm build
firebase deploy --only firestore:rules,firestore:indexes,storage,functions,hosting
```

The Guide and battle functions explicitly bind `OPENAI_API_KEY`. The default model matches Compass; configure `OPENAI_MODEL` in the Functions environment if your actual Compass deployment uses a different value. Never paste a key into chat, GitHub, or client code. Do not copy a service-account file into this repository.

After deployment, set Auth authorised domains for the actual Hosting URL. Configure private Storage downloads with `storage.cors.example.json`, replacing its origin with the actual app origin:

```sh
gcloud storage buckets update gs://YOUR_ACTUAL_BUCKET --cors-file=storage.cors.local.json
```

## Owner-only Admin

Only **your registered Firebase UID** can open Owner Admin and use its server operations. The backend requires both the `owner` claim and an exact match to the single protected `privateConfig/owner` record. Legacy reviewer, moderator, or resource-admin claims do not grant access in this edition. Players cannot edit this private owner record or promote themselves.

One-time setup, after creating your own app account:

```sh
gcloud auth application-default login
export GOOGLE_CLOUD_PROJECT=YOUR_CONFIRMED_PROJECT_ID
node scripts/set-owner.mjs YOUR_FIREBASE_AUTH_UID
```

Use your own UID from Firebase Authentication. Sign out/in afterward. The **Owner Admin** navigation item appears only for your account. The setup script refuses to add a different owner when one is already registered. These restrictions protect application-level access; Google Cloud/Firebase project administrators still retain infrastructure access, so keep those project roles private too.

Inside Owner Admin you can:

- View player and pending proof counts.
- Add/edit/remove your main LWA referral and product-specific links.
- Write, edit, enable, or hide a player announcement.
- Review player proof, approve it, or request revision.

The Admin screen is hidden from normal users, but real protection comes from server checks and database/storage rules, not from hiding a button. Even a manually entered `#admin` route or forged client request cannot grant admin powers. Publicly displayed announcements/resource links remain visible to players by design; their editing controls are private.

Owner proof reviews cannot approve evidence submitted under the same owner UID. Review status and XP are committed together. Game worlds, curriculum, and payment-provider integration remain source-code changes requiring deployment; the owner screen is not a general-purpose code editor or a tool to bypass game gates.

Set review, moderation, retention, and deletion procedures before public launch. The controls do not replace human review operations. Evidence uploads remain private, immutable to clients, and capped at 5 MB. Redeploy BOTH Firestore and Storage rules with this edition so older reviewer-claim access is removed.

## Included gameplay

Nine worlds: Foundation; Brand & Message; Offer Creation; Visibility; Conversations; Sales Arena; Customer Experience; Growth & Systems; Wealth & Freedom. Each has two missions and a three-round boss.

Learn → Practice (an interactive lesson exercise, not an app simulation mode) → Build → Do It IRL → Submit Proof → Verify → Unlock.

The game includes profiles/sigils, starting paths, XP, skills, six levelling Guides, options, achievements, Proof Vault, Resource Hub, responsive layouts, reduced motion, optional sound, and a PWA offline shell. Actual cloud game actions require connectivity. XP and options are not income guarantees or professional certifications.


## Add your LWA and product-specific links inside the app

Your owner account can edit these without changing code after deployment:

1. Create/sign into your own app account and find its UID in Firebase Authentication.
2. In a trusted administrator terminal, authenticate Google Cloud Application Default Credentials for the confirmed project, then register your UID as the sole owner:

```sh
gcloud auth application-default login
export GOOGLE_CLOUD_PROJECT=YOUR_CONFIRMED_PROJECT_ID
node scripts/set-owner.mjs YOUR_FIREBASE_AUTH_UID
```

3. Sign out/in to refresh your account token.
4. Open **Resource Hub → Manage your LWA links**.
5. Add your main LWA referral URL. Use **Add product link** for each specific product: name, description, its exact referral URL, and an optional related world. Save.

Up to 20 individual product links are supported. Referral query parameters are preserved. A saved empty list removes product links. Only your registered owner account can update this configuration; players cannot overwrite it. Concurrent owner edits are protected by a revision check.

All links are labelled optional, external, and potentially paid. Referral disclosures are shown. No proof gate, world, mission, or boss depends on buying through these links.

`VITE_LWA_URL`/`VITE_LWA_LABEL` remain optional initial defaults when no Resources configuration has been saved. Once you save in the owner editor, that saved configuration takes precedence.

## Strategies, closing, and evolving objections

The Guides have distinct live coaching instructions: business diagnosis and a seven-day plan; content hooks and post examples; scoped offers; discovery questions and closing scripts; metrics/experiments; and realistic action planning. The Closer specifically works through fit, timing, budget, authority, trust, and ethical next steps. Responses should include usable language and measurement rather than generic encouragement.

Bosses assess understanding, the proposed action, and how to check fit/results. They produce specific feedback plus the next objection based on the player's response. Failed responses continue the unresolved concern; successful ones add a harder constraint. AI responses still require the configured live service and are not guaranteed to be correct. Players should critically review strategies in their own context.

## Membership

Checkout/webhook adapters remain unconnected until a payment provider and offer are supplied. `REQUIRE_MEMBERSHIP=false` permits a live unpaid launch. Do not enable the membership gate until checkout, signed webhooks, cancellations, and entitlements have been tested. See [SUBSCRIPTIONS.md](docs/SUBSCRIPTIONS.md).

## GitHub

Upload the extracted source folder contents, including dotfiles, not the ZIP as a single file. Keep `.env`, `.firebaserc`, credentials, `node_modules`, and `dist` out of Git. The supplied `.gitignore` covers these.

```sh
git init
git add .
git status
# Confirm no private configuration is staged.
git commit -m "Build OYO Unlocked live-only app"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/oyo-unlocked.git
git push -u origin main
```

Uploading to GitHub alone does not deploy Firebase Functions or make AI live.

## Checks

```sh
pnpm test
pnpm test:server
pnpm build
# Requires Firebase CLI and a supported Java runtime:
pnpm test:rules
```

The live-only build and automated tests are recorded in [VERIFICATION.md](docs/VERIFICATION.md). Browser inspection was previously declined; no browser workaround is used. Actual Firebase and AI calls cannot be confirmed until project access and deployment are available.

Implementation: `src/` for the game; `functions/game/` for the curriculum/state machine; `functions/index.js` for trusted cloud actions; `functions/adapters/compass.js` for the live Compass integration. See [AI-INTEGRATION.md](docs/AI-INTEGRATION.md) and [ASSETS.md](docs/ASSETS.md).

Community chat is built into this edition.

## Included training

All nine worlds have two missions each (18 total). Every world includes an expanded lesson, worked example, workshop, and quality check. Brand training includes positioning, voice, colors/fonts, profile copy, and reader testing. Other worlds cover research, offers, content, outreach, discovery/closing, objections, delivery, systems, and sustainable planning. Edit functions/game/training.js and functions/game/content.js to customize.
