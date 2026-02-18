const compatible = process.env.WEBMCP_COMPATIBLE === "true";

console.log({
  mode: compatible ? "experimental" : "fallback",
  reason: compatible
    ? "navigator.modelContext compatible surface detected"
    : "WebMCP unavailable, using HTTP tool fallback",
});
