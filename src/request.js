export default async function request(url, options = {}) {
  const fetchOptions = {
    ...options,
    headers: {
      ...(options.headers || {}),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  };
  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    throw new TypeError(
      `Network request to ${response.url} failed: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
}
