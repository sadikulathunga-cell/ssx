import { supabase } from "@/integrations/supabase/client";
import type { MediaItem } from "@/lib/storage";

export interface Photographer {
  id: string;
  user_id: string;
  name: string;
  location: string | null;
  device: string | null;
  packages: string | null;
  contact: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  photographer_id: string;
  user_id: string;
  body: string | null;
  media: MediaItem[];
  created_at: string;
}

export async function fetchPhotographers(search?: string): Promise<Photographer[]> {
  let query = supabase
    .from("photographers")
    .select("*")
    .order("created_at", { ascending: false });
  if (search && search.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Photographer[];
}

export async function fetchPhotographer(id: string): Promise<Photographer | null> {
  const { data, error } = await supabase
    .from("photographers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Photographer | null;
}

export async function fetchMyPhotographer(
  userId: string,
): Promise<Photographer | null> {
  const { data, error } = await supabase
    .from("photographers")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data as Photographer | null;
}

export async function fetchPosts(photographerId: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("photographer_id", photographerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Post[];
}
