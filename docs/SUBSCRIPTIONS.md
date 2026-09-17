# Subscription-provider integration

No payment provider, currency, product ID, or price has been selected in code. Local practice takes no payments. Two explicit server-only seams live in `functions/adapters/subscription.js`.

## Checkout

Implement `createCheckoutSession({uid, email}) -> {url}` using the chosen provider's **server** SDK/API. The UID comes from Firebase Auth. Select the offer/price and success/cancel return URLs on the server; do not accept arbitrary prices or return URLs from the browser. Bind relevant secrets to the `createCheckout` callable. Save the provider customer-to-UID mapping server-side.

Return an HTTPS provider-hosted checkout URL. Add a server allowlist for your provider's checkout hosts. The client navigates to this URL. It must not mark membership active when a player reaches a success page or clicks a purchase button.

## Trusted webhook

Implement `verifyBillingEvent(rawBody, headers)` using the chosen provider's signature-verification routine. Verify the signature and acceptable timestamp against the **raw body before parsing or trusting fields**. Bind the webhook signing secret to `billingWebhook` via its Functions secret option.

Normalise a validated event to:

```js
{
  id: 'unique_provider_event_id', // letters, digits, underscores, hyphens; <=128 chars
  uid: 'firebase_auth_uid',      // resolve via trusted customer mapping
  active: true,                 // current paid/trial entitlement policy
  expiresAt: 1900000000000,      // epoch milliseconds, provider period end
  occurredAt: 1890000000000      // authoritative provider event time in milliseconds
}
```

The example timestamps describe the shape only. Never copy them as live values. If provider event IDs contain other characters, use a stable hash for the normalised document ID. Normalise cancellation, expiration, refund, and chargeback events too; define their access policy explicitly. When multiple events can share a timestamp, fetch the current subscription state from the provider and use an authoritative monotonic revision/time in your mapping to avoid ambiguity.

`billingWebhook` deduplicates event IDs, ignores older events for the entitlement, and writes an expiring entitlement atomically. An invalid signature, unconfigured adapter, or malformed event returns a failure and grants no access. Do not log secrets or entire payment payloads. Add a billing event retention policy appropriate to the provider's retry window.

## Turn on the gate

Set server `REQUIRE_MEMBERSHIP=true` only after sandbox tests. `access()` protects mission-stage actions, proof submission, and boss calls in Worlds 2–9. World 1 remains free. Guides, profile editing, and viewing previously submitted proofs remain available. This is a minimal policy and is easy to extend centrally if the product offer changes.

The client receives a read-only active status from `getPlayer`; it cannot create entitlements. An expired/inactive pass never deletes progress. An active pass never unlocks an unverified mission or bypasses a boss. LWA remains wholly outside the gate.

## Test before charging

Test checkout creation, cancellation, success webhook, invalid signature, duplicate event, out-of-order event, trial expiry, refund, subscription cancellation, invalid customer mapping, and a forged direct Firestore write. Provide customer-facing price/renewal/cancellation information through the actual offer and a provider customer portal before public sale. Portal creation is not included in this MVP; add it with the same authenticated server boundary as checkout.
