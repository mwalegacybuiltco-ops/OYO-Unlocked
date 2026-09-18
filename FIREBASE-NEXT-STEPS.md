# Your Firebase project is connected in the files

Project: oyo-unlocked. The supplied Firebase web configuration is now in .env, and .firebaserc selects this project. These local configuration files are ignored by Git. The included preview has been rebuilt with this web configuration. Analytics is not enabled because the game does not need it.

## In Firebase Console

1. Select oyo-unlocked and enable the Blaze billing plan for Functions and Storage.
2. Authentication → Sign-in method → enable Email/Password. Configure your password-reset email template.
3. Create Firestore in production mode and enable Storage with locked rules. Deployment installs the supplied app rules.
4. Authentication → Settings → Authorized domains: ensure oyo-unlocked.web.app and oyo-unlocked.firebaseapp.com are listed.

## Deploy from the extracted repository

With Node.js 22, pnpm 11.19.0, and the Firebase CLI installed:

```sh
pnpm install --frozen-lockfile
cd functions
pnpm --ignore-workspace install --frozen-lockfile --ignore-scripts
cd ..
firebase login
pnpm build
firebase deploy --project oyo-unlocked --only firestore:rules,firestore:indexes,storage,functions,hosting
```


If using Google Cloud CLI, configure proof-file downloads:

```sh
gcloud storage buckets update gs://oyo-unlocked.firebasestorage.app --cors-file=storage.cors.local.json
```

After successful deployment, the default Hosting address is https://oyo-unlocked.web.app. No deployment was performed while preparing this ZIP.

Create your personal account in the deployed app. Copy its UID from Firebase Authentication, then follow README.md → Owner-only Admin to register that exact UID using scripts/set-owner.mjs. There is no default admin password.

PayPal subscriptions are not integrated yet. REQUIRE_MEMBERSHIP remains false so the unconnected payment integration does not lock out players. Configure and test PayPal server verification before selling paid access.

The ZIP includes public web configuration in ignored local files for convenience. GitHub uploads/clones do not automatically recreate ignored .env files: configure them separately in the deployment environment. Never commit private keys or service-account files.
Guides and Bosses now use the built-in adaptive engine. No AI API key, model, or external provider is needed. If you previously deployed an older edition, deploy the updated Functions and Hosting together. Previously stored provider secrets are no longer referenced by this code; no existing cloud secret has been changed or deleted.
