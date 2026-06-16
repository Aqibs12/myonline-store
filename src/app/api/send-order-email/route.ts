import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import type { OrderItem, ShippingAddress, PaymentMethod } from "@/types";

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME ?? "My Online Store";
const FROM_EMAIL = process.env.FROM_EMAIL ?? "orders@myonlinestore.com";

interface EmailPayload {
  to: string;
  orderId: string;
  trackingNumber: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress;
}

function formatPrice(amount: number) {
  return `Rs ${amount.toLocaleString("en-PK")}`;
}

function buildEmailHtml(p: EmailPayload): string {
  const paymentLabels: Record<PaymentMethod, string> = {
    cod: "Cash on Delivery",
    jazzcash: "JazzCash",
    easypaisa: "Easypaisa",
  };

  const itemRows = p.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;">
          ${item.name} <span style="color:#888;">× ${item.quantity}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;text-align:right;white-space:nowrap;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#0f766e;padding:28px 32px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:22px;letter-spacing:0.5px;">${STORE_NAME}</h1>
          </td>
        </tr>

        <!-- Hero -->
        <tr>
          <td style="padding:32px 32px 0;text-align:center;">
            <div style="display:inline-block;background:#f0fdfb;border-radius:50%;width:64px;height:64px;line-height:64px;font-size:28px;margin-bottom:16px;">✓</div>
            <h2 style="margin:0 0 8px;font-size:20px;color:#111;">Order Confirmed!</h2>
            <p style="margin:0;font-size:14px;color:#555;">Thank you for shopping with us. We'll get your order ready soon.</p>
          </td>
        </tr>

        <!-- Tracking + Order ID -->
        <tr>
          <td style="padding:24px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#f0fdfb;border:1px solid #99f6e4;border-radius:8px;padding:16px;width:48%;text-align:center;">
                  <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;">Tracking Number</div>
                  <div style="font-size:18px;font-weight:bold;color:#0f766e;letter-spacing:1px;">${p.trackingNumber}</div>
                </td>
                <td style="width:4%;"></td>
                <td style="background:#f8f8f8;border:1px solid #e5e5e5;border-radius:8px;padding:16px;width:48%;text-align:center;">
                  <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;">Order ID</div>
                  <div style="font-size:13px;font-weight:bold;color:#333;word-break:break-all;">${p.orderId}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Order Items -->
        <tr>
          <td style="padding:0 32px 24px;">
            <h3 style="margin:0 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:0.6px;color:#888;">Order Summary</h3>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${itemRows}
              <tr>
                <td style="padding:10px 0;font-size:14px;color:#555;">Subtotal</td>
                <td style="padding:10px 0;font-size:14px;color:#555;text-align:right;">${formatPrice(p.subtotal)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:14px;color:#555;">Standard Shipping</td>
                <td style="padding:6px 0;font-size:14px;color:#555;text-align:right;">${formatPrice(p.shippingFee)}</td>
              </tr>
              <tr>
                <td style="padding:12px 0 0;font-size:16px;font-weight:bold;color:#111;border-top:2px solid #eee;">Total</td>
                <td style="padding:12px 0 0;font-size:16px;font-weight:bold;color:#0f766e;text-align:right;border-top:2px solid #eee;">${formatPrice(p.total)}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Shipping & Payment -->
        <tr>
          <td style="padding:0 32px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:top;width:48%;">
                  <h3 style="margin:0 0 10px;font-size:14px;text-transform:uppercase;letter-spacing:0.6px;color:#888;">Ship To</h3>
                  <p style="margin:0;font-size:14px;color:#333;line-height:1.6;">
                    <strong>${p.shippingAddress.fullName}</strong><br>
                    ${p.shippingAddress.address}<br>
                    ${p.shippingAddress.city}<br>
                    ${p.shippingAddress.phone}
                    ${p.shippingAddress.notes ? `<br><em style="color:#888;">${p.shippingAddress.notes}</em>` : ""}
                  </p>
                </td>
                <td style="width:4%;"></td>
                <td style="vertical-align:top;width:48%;">
                  <h3 style="margin:0 0 10px;font-size:14px;text-transform:uppercase;letter-spacing:0.6px;color:#888;">Payment</h3>
                  <p style="margin:0;font-size:14px;color:#333;">${paymentLabels[p.paymentMethod]}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8f8f8;padding:20px 32px;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;font-size:12px;color:#999;">Questions? Reply to this email or contact us — we're happy to help.</p>
            <p style="margin:8px 0 0;font-size:12px;color:#ccc;">© ${new Date().getFullYear()} ${STORE_NAME}</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  let payload: EmailPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!payload.to || !payload.to.includes("@")) {
    return NextResponse.json({ error: "No valid email address" }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: `${STORE_NAME} <${FROM_EMAIL}>`,
      to: payload.to,
      subject: `Order confirmed — ${payload.trackingNumber}`,
      html: buildEmailHtml(payload),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[send-order-email]", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
