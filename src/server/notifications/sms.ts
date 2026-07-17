import { BookingStatus } from "@prisma/client";

type BookingSmsDetails = {
  bookingCode: string;
  customerName: string;
  phone: string;
  serviceName: string;
  startsAt: Date;
  status: BookingStatus;
};

type SmsMessage = {
  body: string;
  to: string;
};

const NOTIFIABLE_STATUSES = new Set<BookingStatus>([
  BookingStatus.CONFIRMED,
  BookingStatus.CANCELLED,
]);
const DEFAULT_PUBLIC_APP_URL = "https://salon-mate-nine.vercel.app";

export function normalizeSmsPhoneNumber(phone: string, countryCode = process.env.SMS_DEFAULT_COUNTRY_CODE ?? "94") {
  const normalizedPhone = phone.trim().replace(/[\s()-]/g, "");
  if (normalizedPhone.startsWith("+")) return normalizedPhone.slice(1);
  if (normalizedPhone.startsWith("0")) return `${countryCode}${normalizedPhone.slice(1)}`;
  return `${countryCode}${normalizedPhone}`;
}

function buildBookingStatusUrl(bookingCode: string) {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? DEFAULT_PUBLIC_APP_URL).replace(/\/+$/, "");

  return `${appUrl}/booking/${encodeURIComponent(bookingCode)}`;
}

function formatAppointmentDate(startsAt: Date) {
  return new Intl.DateTimeFormat("en-LK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(startsAt);
}

function formatAppointmentTime(startsAt: Date) {
  return new Intl.DateTimeFormat("en-LK", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(startsAt);
}

export function buildBookingStatusSms(details: BookingSmsDetails): SmsMessage | null {
  if (!NOTIFIABLE_STATUSES.has(details.status)) return null;

  const salonName = process.env.SMS_SALON_NAME ?? "Salon Mate";
  const appointment = `${details.serviceName} on ${formatAppointmentDate(details.startsAt)} at ${formatAppointmentTime(details.startsAt)}`;
  const bookingStatusUrl = buildBookingStatusUrl(details.bookingCode);
  const statusLinkText = bookingStatusUrl ? ` View booking status: ${bookingStatusUrl}` : "";
  const greeting = `${salonName}: Hi ${details.customerName},`;
  const body = details.status === BookingStatus.CONFIRMED
    ? `${greeting} your booking ${details.bookingCode} for ${appointment} is confirmed.${statusLinkText}`
    : `${greeting} your booking ${details.bookingCode} for ${appointment} has been cancelled.${statusLinkText}`;

  return {
    body,
    to: normalizeSmsPhoneNumber(details.phone),
  };
}

type NotifyLkResponse = {
  status?: string;
  data?: unknown;
};

async function sendNotifyLkSms(message: SmsMessage) {
  const userId = process.env.NOTIFY_LK_USER_ID;
  const apiKey = process.env.NOTIFY_LK_API_KEY;
  const senderId = process.env.NOTIFY_LK_SENDER_ID;

  if (!userId || !apiKey || !senderId) return false;

  const form = new URLSearchParams({
    user_id: userId,
    api_key: apiKey,
    sender_id: senderId,
    to: message.to,
    message: message.body,
  });
  const response = await fetch("https://app.notify.lk/api/v1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });

  const result = await response.json() as NotifyLkResponse;
  if (!response.ok || result.status !== "success") {
    throw new Error(`Notify.lk rejected the message (${response.status}): ${JSON.stringify(result.data ?? result)}`);
  }

  return true;
}

export async function sendBookingStatusSms(details: BookingSmsDetails) {
  const message = buildBookingStatusSms(details);
  if (!message) return false;

  return sendNotifyLkSms(message);
}
