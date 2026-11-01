const SIMULATED_DELAY_MS = 800;

export function buildContactRequest({ name, email, message }) {
  return {
    url: '/api/contact',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    }),
  };
}

// Simulated: no network request is made. To go live, replace the timeout with
// fetch(url, options) and throw when the response is not ok.
export async function submitContactForm(values) {
  const { url, ...options } = buildContactRequest(values);
  console.debug('Simulated contact request', url, options);
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
  return { ok: true };
}
