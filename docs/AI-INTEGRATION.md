# Built-in adaptive coaching

The former external provider adapter has been removed. There are no model requests, model parameters, or AI credential bindings. Firebase Functions askGuide and battle call functions/game/coaching.js directly.

Guide memory lives in game.coaching[guideId]: answers, pending question, current topic, latest outcome, turn count, and timestamp. Transactions prevent concurrent answers from overwriting game state. Six independent guided workflows cover strategy, branding/content, offers, discovery/closing, metrics, and action planning. Explicit concern choices select budget, trust, timing, decision-authority, or fit strategies. Higher earned Guide levels add tradeoff and alternative-explanation questions. Reset affects only that Guide’s planning memory; player XP, proof, and missions stay intact. Recent conversation remains available.

Boss scenarios vary by world and round. A scenario identifier includes attempt count to reject stale submissions. The server checks prerequisites, entitlement policy, selected strategy and outcome-check IDs, and reflection length. Rewards are applied transactionally only after correct choices. Reflection meaning and real-world results are not automatically verified. Owner review still gates the missions leading to each boss. Correct-choice IDs are not secrets; this is an educational exercise, not a proctored exam.

To expand coaching, edit discovery questions, topic rules, scripts, and bossCases in coaching.js, then rebuild and deploy. Keep question IDs stable to preserve existing saved answers. No provider SDK, credential, or additional AI bill is required. Firebase hosting/database/function usage still has its normal costs.
