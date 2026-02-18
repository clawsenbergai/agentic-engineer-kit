const allowedIdentity = "agent:wallet:abc123";

function canExecute(identity) {
  return identity === allowedIdentity;
}

console.log({ identity: allowedIdentity, allowed: canExecute(allowedIdentity) });
console.log({ identity: "agent:wallet:revoked", allowed: canExecute("agent:wallet:revoked") });
