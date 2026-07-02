import { supabase } from "@/integrations/supabase/client";

export type MediaItem = { path: string; type: "image" | "video" };

/** Upload a file into a per-user folder inside a bucket. Returns the storage path. */
export async function uploadFile(
  bucket: string,
  userId: string,
  file: File,
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

const cache = new Map<string, string>();

/** Create a signed URL for a private storage object (valid for 1 hour). */
export async function getSignedUrl(
  bucket: string,
  path: string | null | undefined,
): Promise<string | null> {
  if (!path) return null;
  const key = `${bucket}:${path}`;
  if (cache.has(key)) return cache.get(key)!;
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60);
  if (error || !data) return null;
  cache.set(key, data.signedUrl);
  return data.signedUrl;
}
