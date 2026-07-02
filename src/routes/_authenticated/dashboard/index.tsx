import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ImagePlus, Loader2, LogOut, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/PageShell";
import { StorageMedia } from "@/components/StorageMedia";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile, type MediaItem } from "@/lib/storage";
import { fetchMyPhotographer, fetchPosts } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: Dashboard,
});

function Dashboard() {
  const { user, signOut } = useAuth();
  const qc = useQueryClient();
  const userId = user?.id ?? "";

  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-photographer", userId],
    queryFn: () => fetchMyPhotographer(userId),
    enabled: !!userId,
  });

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">My studio</p>
            <h1 className="text-4xl">Manage your profile</h1>
          </div>
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>

        {isLoading ? (
          <div className="h-96 animate-pulse rounded-3xl bg-card" />
        ) : (
          <div className="space-y-10">
            <ProfileForm userId={userId} profile={profile ?? null} />
            {profile && <PostManager userId={userId} photographerId={profile.id} />}
          </div>
        )}
      </div>
    </PageShell>
  );
}

type ProfileShape = {
  id: string;
  name: string;
  location: string | null;
  device: string | null;
  packages: string | null;
  contact: string | null;
  bio: string | null;
  avatar_url: string | null;
} | null;

function ProfileForm({
  userId,
  profile,
}: {
  userId: string;
  profile: ProfileShape;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    location: "",
    device: "",
    packages: "",
    contact: "",
    bio: "",
  });
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? "",
        location: profile.location ?? "",
        device: profile.device ?? "",
        packages: profile.packages ?? "",
        contact: profile.contact ?? "",
        bio: profile.bio ?? "",
      });
      setAvatarPath(profile.avatar_url);
    }
  }, [profile]);

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = await uploadFile("avatars", userId, file);
      setAvatarPath(path);
      toast.success("Photo uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        user_id: userId,
        name: form.name,
        location: form.location || null,
        device: form.device || null,
        packages: form.packages || null,
        contact: form.contact || null,
        bio: form.bio || null,
        avatar_url: avatarPath,
      };
      const { error } = profile
        ? await supabase.from("photographers").update(payload).eq("id", profile.id)
        : await supabase.from("photographers").insert(payload);
      if (error) throw error;
      toast.success("Profile saved");
      qc.invalidateQueries({ queryKey: ["my-photographer", userId] });
      qc.invalidateQueries({ queryKey: ["photographers"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={save}
      className="rounded-3xl border border-border bg-card p-8 shadow-elegant"
    >
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="shrink-0">
          <div className="h-32 w-32 overflow-hidden rounded-2xl border border-border">
            <StorageMedia
              bucket="avatars"
              path={avatarPath}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <label className="mt-3 flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-secondary">
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ImagePlus className="h-3.5 w-3.5" />
            )}
            Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatar}
            />
          </label>
        </div>
        <div className="grid flex-1 gap-4 sm:grid-cols-2">
          <Field label="Name" value={form.name} onChange={set("name")} />
          <Field label="Location" value={form.location} onChange={set("location")} />
          <Field label="Device / gear" value={form.device} onChange={set("device")} />
          <Field label="Contact" value={form.contact} onChange={set("contact")} />
          <Field
            label="Packages & pricing"
            value={form.packages}
            onChange={set("packages")}
            className="sm:col-span-2"
          />
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Bio</Label>
            <Textarea
              value={form.bio}
              onChange={set("bio")}
              rows={4}
              placeholder="Tell clients about your style and experience…"
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        {profile && (
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link to="/photographers/$id" params={{ id: profile.id }}>
              View public profile
            </Link>
          </Button>
        )}
        <Button type="submit" className="ml-auto rounded-full" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {profile ? "Save changes" : "Create profile"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label>{label}</Label>
      <Input value={value} onChange={onChange} />
    </div>
  );
}

function PostManager({
  userId,
  photographerId,
}: {
  userId: string;
  photographerId: string;
}) {
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);

  const { data: posts } = useQuery({
    queryKey: ["posts", photographerId],
    queryFn: () => fetchPosts(photographerId),
  });

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded: MediaItem[] = [];
      for (const file of files) {
        const path = await uploadFile("post-media", userId, file);
        uploaded.push({
          path,
          type: file.type.startsWith("video") ? "video" : "image",
        });
      }
      setMedia((m) => [...m, ...uploaded]);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const createPost = async () => {
    if (!body.trim() && media.length === 0) {
      toast.error("Add a caption or media");
      return;
    }
    setPosting(true);
    try {
      const { error } = await supabase.from("posts").insert({
        photographer_id: photographerId,
        user_id: userId,
        body: body || null,
        media: media as unknown as never,
      });
      if (error) throw error;
      setBody("");
      setMedia([]);
      toast.success("Post published");
      qc.invalidateQueries({ queryKey: ["posts", photographerId] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to post");
    } finally {
      setPosting(false);
    }
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) return toast.error("Delete failed");
    toast.success("Post deleted");
    qc.invalidateQueries({ queryKey: ["posts", photographerId] });
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-elegant">
      <h2 className="text-2xl">Share an update</h2>
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        className="mt-4"
        placeholder="What did you shoot recently?"
      />
      {media.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {media.map((m, i) => (
            <div key={i} className="relative">
              <StorageMedia
                bucket="post-media"
                path={m.path}
                type={m.type}
                className="aspect-square w-full rounded-xl object-cover"
              />
              <button
                onClick={() => setMedia((arr) => arr.filter((_, x) => x !== i))}
                className="absolute right-1 top-1 rounded-full bg-background/80 p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 flex items-center gap-3">
        <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          Add media
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleFiles}
          />
        </label>
        <Button
          onClick={createPost}
          className="ml-auto rounded-full"
          disabled={posting}
        >
          {posting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Publish
        </Button>
      </div>

      <div className="mt-8 space-y-4">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="rounded-2xl border border-border p-4"
          >
            <div className="flex items-start justify-between gap-3">
              {post.body && <p className="text-sm">{post.body}</p>}
              <button
                onClick={() => deletePost(post.id)}
                className="ml-auto text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {post.media?.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {post.media.map((m, i) => (
                  <StorageMedia
                    key={i}
                    bucket="post-media"
                    path={m.path}
                    type={m.type}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
