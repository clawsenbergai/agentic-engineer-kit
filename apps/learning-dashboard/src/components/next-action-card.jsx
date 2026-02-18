import Link from "next/link";

export function NextActionCard({ nextAction }) {
  if (!nextAction) return null;

  return (
    <section className="next-action-card">
      <p className="next-action-label">Next best action</p>
      <h3>{nextAction.actionText}</h3>
      <Link className="primary-button" href={nextAction.ctaPath}>
        Do this now
      </Link>
    </section>
  );
}
