import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Camera, MapPin, Search } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { StorageMedia } from "@/components/StorageMedia";
import { Input } from "@/components/ui/input";
import { fetchPhotographers } from "@/lib/queries";

export const Route = createFileRoute("/photographers/")({
  component: PhotographersPage,
});

function PhotographersPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["photographers"],
    queryFn: () => fetchPhotographers(),
  });

  const filtered = (data ?? []).filter((p) =>
    [p.name, p.location, p.device]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <PageShell>
      <section className="border-b border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="eyebrow mb-3">The directory</p>
          <h1 className="text-4xl md:text-5xl">Discover photographers</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Explore talented photographers, see their latest work and find the
            right match for your next shoot.
          </p>
          <div className="relative mt-8 max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, location or device…"
              className="h-12 rounded-full pl-11"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-3xl border border-border bg-card"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border py-24 text-center">
            <Camera className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
            <p className="text-lg">No photographers found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search
                ? "Try a different search."
                : "Be the first to join the directory."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <Link
                key={p.id}
                to="/photographers/$id"
                params={{ id: p.id }}
                className="group overflow-hidden rounded-3xl border border-border bg-card shadow-elegant transition-transform hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <StorageMedia
                    bucket="avatars"
                    path={p.avatar_url}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl">{p.name}</h3>
                  {p.location && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {p.location}
                    </p>
                  )}
                  {p.device && (
                    <p className="mt-3 inline-block rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                      {p.device}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
