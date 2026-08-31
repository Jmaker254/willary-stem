import "server-only";

/**
 * Best-effort transactional email via Resend. When RESEND_API_KEY is unset this
 * is a no-op so form submissions never fail just because email isn't configured.
 */
export async function sendNotification(subject: string, body: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  const from = process.env.EMAIL_FROM ?? "Willary STEM <onboarding@resend.dev>";
  if (!key || !to) {
    console.info(`[email:skipped] ${subject}`);
    return;
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(key);
    await resend.emails.send({
      from,
      to,
      subject,
      text: body,
    });
  } catch (err) {
    console.error("[email:error]", err);
  }
}

export async function sendMail(
  to: string,
  subject: string,
  body: string,
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Willary STEM <onboarding@resend.dev>";
  if (!key) {
    console.info(`[email:skipped] to=${to} subject=${subject}`);
    return;
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(key);
    await resend.emails.send({ from, to, subject, text: body });
  } catch (err) {
    console.error("[email:error]", err);
  }
}
