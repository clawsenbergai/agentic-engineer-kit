export function extractOwnerToken(request) {
  const auth = request.headers.get("authorization");
  const headerToken = request.headers.get("x-owner-token");

  if (headerToken) return headerToken.trim();

  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }

  return "";
}

export function isOwnerAuthorized(request) {
  const configuredToken = process.env.DASHBOARD_OWNER_TOKEN;
  if (!configuredToken) return true;
  const incoming = extractOwnerToken(request);
  return incoming.length > 0 && incoming === configuredToken;
}
