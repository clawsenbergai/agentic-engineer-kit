import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="page-stack">
      <h1>Not found</h1>
      <p className="muted-text">The requested track or resource does not exist in this dashboard.</p>
      <Link href="/" className="primary-button">
        Back to dashboard
      </Link>
    </div>
  );
}
