import { TrackCard } from "@/components/track-card";
import { getTracks } from "@/lib/repository";

export default async function TracksPage() {
  const tracks = await getTracks();

  return (
    <div className="page-stack">
      <header className="section-head">
        <h1>Track map</h1>
        <p className="muted-text">Choose one track and push one milestone to validated completion.</p>
      </header>

      <div className="track-grid">
        {tracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}
