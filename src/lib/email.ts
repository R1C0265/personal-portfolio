// src/lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInquiryNotification(inquiry: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  quantity?: number | null;
  preferredContact: string;
  message?: string | null;
  product?: { name: string } | null;
}) {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) {
    console.warn("[email] Resend not configured — skipping");
    return;
  }

  await resend.emails.send({
    from:    process.env.FROM_EMAIL || "onboarding@resend.dev",
    to:      process.env.ADMIN_EMAIL,
    subject: `New inquiry from ${inquiry.customerName} — Waku Limited`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1A4D2E;padding:24px;text-align:center;border-radius:12px 12px 0 0">
          <h1 style="color:#C9A84C;margin:0">Waku Limited</h1>
          <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:14px">New Customer Inquiry</p>
        </div>
        <div style="padding:24px;background:#fafafa;border:1px solid #e5e5e5;font-size:14px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;font-weight:bold;width:40%">Name</td><td style="padding:8px">${inquiry.customerName}</td></tr>
            <tr style="background:#f5f5f5"><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${inquiry.customerEmail}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${inquiry.customerPhone}</td></tr>
            <tr style="background:#f5f5f5"><td style="padding:8px;font-weight:bold">Product</td><td style="padding:8px">${inquiry.product?.name ?? "Not specified"}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Quantity</td><td style="padding:8px">${inquiry.quantity ?? "Not specified"}</td></tr>
            <tr style="background:#f5f5f5"><td style="padding:8px;font-weight:bold">Contact via</td><td style="padding:8px">${inquiry.preferredContact}</td></tr>
            ${inquiry.message ? `<tr><td style="padding:8px;font-weight:bold">Message</td><td style="padding:8px">${inquiry.message}</td></tr>` : ""}
          </table>
        </div>
        <div style="background:#1A4D2E;padding:12px;text-align:center;border-radius:0 0 12px 12px">
          <p style="color:#C9A84C;margin:0;font-size:12px">Log in to the CRM to manage this inquiry</p>
        </div>
      </div>
    `,
  });
}
