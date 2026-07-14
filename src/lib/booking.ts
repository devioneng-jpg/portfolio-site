export const BOOKING_URL = "https://cal.com/dtharpe";

export function createBookingUrl({
  name,
  email,
}: {
  name?: string;
  email?: string;
} = {}) {
  const url = new URL(BOOKING_URL);
  if (name) url.searchParams.set("name", name);
  if (email) url.searchParams.set("email", email);
  return url.toString();
}
