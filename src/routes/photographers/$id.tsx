import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Mail, MapPin, Package, Smartphone } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { StorageMedia } from "@/components/StorageMedia";
import { Button } from "@/components/ui/button";
import { fetchPhotographer, fetchPosts } from "@/lib/queries";

export const Route = createFileRoute("/photographers/$id")({
  component: PhotographerDetail,
});

function PhotographerDetail() {
  const { id } = useParams({ from: "/photographers/$id" });
  const { data: p, isLoading } = useQuery({
    queryKey: ["photographer", id],
    queryFn: () => fetchPhotographer(id),
  });
  const { data: posts } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => fetchPosts(id),
    enabled: !!p,
  });

  if (isLoading) {
    return (
      <PageShell>
        <div className="mx-auto max-w-5xl px-6 py-24">
          <div className="h-72 animate-pulse rounded-3xl bg-card" />
        </div>
      </PageShell>
    );
  }

  if (!p) {
    return (
      <PageShell>
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <h1 className="text-3xl">Photographer not found</h1>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/photographers">Back to directory</Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  const details = [
    { icon: MapPin, label: "Location", value: p.location },
    { icon: Smartphone, label: "Device", value: p.device },
    { icon: Package, label: "Packages", value: p.packages },
    { icon: Mail, label: "Contact", value: p.contact },
  ].filter((d) => d.value);

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link
          to="/photographers"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Directory
        </Link>

        <div className="grid gap-8 md:grid-cols-[280px,1fr]">
          <div>
            <div className="aspect-square overflow-hidden rounded-3xl border border-border">
              <StorageMedia
                bucket="avatars"
                path={p.avatar_url}
                alt={p.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl">{p.name}</h1>
            {p.bio && (
              <p className="mt-4 text-muted-foreground">{p.bio}</p>
            )}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {details.map((d) => (
                <div
                  key={d.label}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <d.icon className="h-3.5 w-3.5" /> {d.label}
                  </p>
                  <p className="mt-1 text-sm">{d.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="mb-6 text-2xl">Recent work</h2>
          {!posts || posts.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-border py-16 text-center text-muted-foreground">
              No posts yet.
            </p>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-3xl border border-border bg-card p-6"
                >
                  {post.body && <p className="mb-4">{post.body}</p>}
                  {post.media?.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {post.media.map((m, i) => (
                        <StorageMedia
                          key={i}
                          bucket="post-media"
                          path={m.path}
                          type={m.type}
                          className="aspect-square w-full rounded-2xl object-cover"
                        />
                      ))}
                    </div>
                  )}
                  <p className="mt-4 text-xs text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
