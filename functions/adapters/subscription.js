/** Provider-neutral payment integration. See docs/SUBSCRIPTIONS.md. */
export async function createCheckoutSession({uid,email}){
 // CONNECT HERE: use the existing/chosen provider SDK on the server.
 // Use a server-owned price ID and allowlisted return URL, and attach the authenticated uid.
 // Return {url:'https://provider-hosted-checkout/...'}.
 void uid;void email;throw new Error('Membership checkout is not configured yet.');
}
export async function verifyBillingEvent(rawBody,headers){
 // CONNECT HERE: cryptographically verify provider signature on rawBody before parsing.
 // Return {id:string,uid:string,active:boolean,expiresAt:number,occurredAt:number}.
 // Map provider customer to an authenticated UID through a SERVER-OWNED record.
 void rawBody;void headers;throw new Error('Billing webhook adapter is not configured.');
}
