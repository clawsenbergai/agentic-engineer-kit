import { isOwnerAuthorized } from "./auth.js";
import { unauthorized } from "./http.js";

export function requireOwner(request) {
  if (!isOwnerAuthorized(request)) {
    return unauthorized();
  }
  return null;
}
