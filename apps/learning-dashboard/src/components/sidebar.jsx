"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { ProgressRing } from "@/components/progress-ring";

export function Sidebar({ tracks = [], overallScore = 0 }) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <Link href="/" className="brand-link">
          Agentic Engineer
        </Link>
        <div className="sidebar-overall">
          <ProgressRing value={overallScore} size={38} stroke={3} showLabel={false} />
          <span>{Math.round(overallScore)}/100</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Tracks">
        {tracks.map((track) => {
          const active = pathname === `/tracks/${track.id}`;
          return (
            <Link
              key={track.id}
              href={`/tracks/${track.id}`}
              className={clsx("track-nav-item", active && "track-nav-item-active")}
            >
              <ProgressRing value={track.score} size={28} stroke={2.5} />
              <div>
                <p>{track.name}</p>
                <span>{track.status.replaceAll("_", " ")}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Link href="/tracks" className={clsx("footer-link", pathname === "/tracks" && "footer-link-active")}>Tracks</Link>
        <Link href="/evidence" className={clsx("footer-link", pathname === "/evidence" && "footer-link-active")}>Evidence</Link>
        <Link href="/gaps" className={clsx("footer-link", pathname === "/gaps" && "footer-link-active")}>Gaps</Link>
        <Link href="/settings" className={clsx("footer-link", pathname === "/settings" && "footer-link-active")}>Settings</Link>
      </div>
    </aside>
  );
}
