CREATE POLICY "Public read avatars and media"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('avatars', 'post-media'));

CREATE POLICY "Users upload to own folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('avatars', 'post-media') AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users update own files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('avatars', 'post-media') AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users delete own files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('avatars', 'post-media') AND (storage.foldername(name))[1] = auth.uid()::text);