import { getSettingsHealth } from "@/lib/repository";

export default async function SettingsPage() {
  const health = await getSettingsHealth();

  return (
    <div className="page-stack">
      <header className="section-head">
        <h1>Settings</h1>
        <p className="muted-text">Single-user mode, provider health, and local auth token hints.</p>
      </header>

      <section className="settings-card">
        <h2>Environment health</h2>
        <dl>
          <div className="settings-row">
            <dt>Storage mode</dt>
            <dd>{health.mode}</dd>
          </div>
          <div className="settings-row">
            <dt>Claude</dt>
            <dd>{health.providerStatus.claude}</dd>
          </div>
          <div className="settings-row">
            <dt>OpenAI fallback</dt>
            <dd>{health.providerStatus.openai}</dd>
          </div>
          <div className="settings-row">
            <dt>Owner token required</dt>
            <dd>{health.auth.ownerTokenRequired ? "yes" : "no"}</dd>
          </div>
        </dl>
      </section>

      <section className="settings-card">
        <h2>Owner token (browser)</h2>
        <p className="muted-text">
          If `DASHBOARD_OWNER_TOKEN` is enabled, save it in localStorage key
          `learning_dashboard_owner_token` to use API actions from the UI.
        </p>
        <pre className="code-block">
          {'localStorage.setItem("learning_dashboard_owner_token", "your-token")'}
        </pre>
      </section>
    </div>
  );
}
