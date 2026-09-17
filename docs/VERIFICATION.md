# Live-only edition verification

The live-only build removes local progress and simulated AI/review paths from the active backend. The former practice-mode ZIP is superseded.

Automated checks: shared progression engine, authentication/authorisation guards, fail-closed payment adapter, missing AI secret rejection, and a mocked live request preserving the Compass model/system-message boundary. Mocked tests do not contact or validate a live provider account.

Live Firebase-enabled production build and service-worker generation are checked locally. Node 24.19.0 is the available local runtime; CI and Functions target Node 22.

Not yet verified: actual deployment, account sign-up/sign-in, private uploads, reviewer workflow against Firebase, live AI response, and payments. No signed-in Firebase CLI was found, and the destination project has not been confirmed. No app was published or existing Compass deployment modified.

Browser inspection was declined on the earlier turn; visual and interactive browser QA remains incomplete. Java is unavailable, so emulator security tests are supplied but not executed here.

## Final package checks

39 automated checks passed: progression, account/role guards, chat/resource validation, and mocked live Guide/boss response contracts. The production build and offline shell generation passed after gamer chat and the editable Resource Hub were added. Firestore live listeners, moderation transactions, and owner editing still require deployed-project integration tests. No live deployment or payment integration is claimed.

## Owner-only Admin update

This edition adds a sole-owner identity check, private Admin screen, announcement editor, and owner-only review/moderation/resource controls. Tests cover missing claims, incorrect owner UID, legacy claims, anonymous calls, and bounded announcement input. The owner UID has not been configured because the user has not supplied their Firebase account UID or connected deployment access.

The owner-only edition passed 43 automated checks and the production build. Firebase/Storage rule emulator execution, browser QA, and live deployment remain unverified as described above.

## Preview launcher update

Production build passed. The dependency-free localhost preview server returned HTTP 200. A compiled view-only preview and Mac launcher are included. The browser-open request was blocked by automatic approval because of the prior browser denial; no visual inspection was performed. The preview does not simulate live actions.
