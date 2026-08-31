import "server-only";

/**
 * Safaricom Daraja (M-Pesa) — Lipa na M-Pesa Online / STK Push.
 * Docs: https://developer.safaricom.co.ke/
 */

const ENV = (process.env.MPESA_ENV ?? "sandbox").toLowerCase();
const BASE =
  ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

export function mpesaConfigured(): boolean {
  return Boolean(
    process.env.MPESA_CONSUMER_KEY &&
      process.env.MPESA_CONSUMER_SECRET &&
      process.env.MPESA_SHORTCODE &&
      process.env.MPESA_PASSKEY &&
      process.env.MPESA_CALLBACK_URL,
  );
}

export function devBypass(): boolean {
  return process.env.MPESA_DEV_BYPASS === "true" && ENV !== "production";
}

/** Normalise a Kenyan number to Daraja's 2547XXXXXXXX / 2541XXXXXXXX form. */
export function normalizePhone(input: string): string | null {
  let d = (input || "").replace(/\D/g, "");
  if (d.startsWith("254")) {
    // keep
  } else if (d.startsWith("0")) {
    d = "254" + d.slice(1);
  } else if (d.length === 9 && (d.startsWith("7") || d.startsWith("1"))) {
    d = "254" + d;
  } else if (d.startsWith("2540")) {
    d = "254" + d.slice(4);
  }
  return /^254(7|1)\d{8}$/.test(d) ? d : null;
}

function timestamp(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    d.getFullYear().toString() +
    p(d.getMonth() + 1) +
    p(d.getDate()) +
    p(d.getHours()) +
    p(d.getMinutes()) +
    p(d.getSeconds())
  );
}

async function getToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`,
  ).toString("base64");
  const res = await fetch(
    `${BASE}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` }, cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Daraja auth failed (${res.status})`);
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("Daraja auth: no access_token");
  return json.access_token;
}

export interface StkPushResult {
  merchantRequestId: string;
  checkoutRequestId: string;
  customerMessage: string;
}

export async function stkPush(params: {
  phone: string; // 2547XXXXXXXX
  amount: number; // whole KES
  accountRef: string; // <= 12 chars, shown on statement
  description: string; // <= 13 chars
}): Promise<StkPushResult> {
  const shortcode = process.env.MPESA_SHORTCODE!;
  const passkey = process.env.MPESA_PASSKEY!;
  const ts = timestamp();
  const password = Buffer.from(shortcode + passkey + ts).toString("base64");
  const txType =
    process.env.MPESA_TRANSACTION_TYPE ?? "CustomerPayBillOnline"; // or CustomerBuyGoodsOnline for Till

  const token = await getToken();
  const res = await fetch(`${BASE}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: ts,
      TransactionType: txType,
      Amount: Math.max(1, Math.round(params.amount)),
      PartyA: params.phone,
      PartyB: process.env.MPESA_PARTYB ?? shortcode,
      PhoneNumber: params.phone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: params.accountRef.slice(0, 12),
      TransactionDesc: params.description.slice(0, 13) || "Payment",
    }),
  });

  const json = (await res.json()) as Record<string, string>;
  if (!res.ok || json.ResponseCode !== "0") {
    throw new Error(
      json.errorMessage || json.ResponseDescription || `STK push failed (${res.status})`,
    );
  }
  return {
    merchantRequestId: json.MerchantRequestID,
    checkoutRequestId: json.CheckoutRequestID,
    customerMessage: json.CustomerMessage ?? "Check your phone to enter your M-Pesa PIN.",
  };
}

export interface StkQueryResult {
  resultCode: number;
  resultDesc: string;
}

/** Reconcile a payment when the callback is slow or missed. */
export async function stkQuery(
  checkoutRequestId: string,
): Promise<StkQueryResult | null> {
  const shortcode = process.env.MPESA_SHORTCODE!;
  const passkey = process.env.MPESA_PASSKEY!;
  const ts = timestamp();
  const password = Buffer.from(shortcode + passkey + ts).toString("base64");
  const token = await getToken();
  const res = await fetch(`${BASE}/mpesa/stkpushquery/v1/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: ts,
      CheckoutRequestID: checkoutRequestId,
    }),
  });
  const json = (await res.json()) as Record<string, string>;
  if (json.ResultCode === undefined) return null;
  return { resultCode: Number(json.ResultCode), resultDesc: json.ResultDesc ?? "" };
}
