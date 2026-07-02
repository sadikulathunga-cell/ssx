import { useQuery } from "@tanstack/react-query";
import { getSignedUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

interface StorageMediaProps {
  bucket: string;
  path: string | null | undefined;
  type?: "image" | "video";
  alt?: string;
  className?: string;
}

export function StorageMedia({
  bucket,
  path,
  type = "image",
  alt = "",
  className,
}: StorageMediaProps) {
  const { data: url } = useQuery({
    queryKey: ["signed-url", bucket, path],
    queryFn: () => getSignedUrl(bucket, path),
    enabled: !!path,
    staleTime: 1000 * 60 * 30,
  });

  if (!path || !url) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className,
        )}
      >
        <ImageIcon className="h-6 w-6 opacity-40" />
      </div>
    );
  }

  if (type === "video") {
    return <video src={url} controls className={className} />;
  }

  return <img src={url} alt={alt} className={className} loading="lazy" />;
}
