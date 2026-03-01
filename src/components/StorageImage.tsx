import { useState, useEffect } from "react";
import supabase from "../../utils/supabase";

interface StorageImageProps {
  path: string | null;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}

/**
 * Extracts the storage path from a full Supabase public URL.
 * e.g. "https://xxx.supabase.co/storage/v1/object/public/portfolio/skills/123.png"
 *   => "skills/123.png"
 */
const extractPath = (url: string): string => {
  const marker = "/storage/v1/object/public/portfolio/";
  const idx = url.indexOf(marker);
  if (idx !== -1) return url.substring(idx + marker.length);
  return url;
};

/**
 * Renders an image from Supabase Storage by downloading it through
 * the authenticated client — bypasses CORS / OpaqueResponseBlocking issues.
 *
 * Accepts either a full public URL or a bare storage path.
 * If `path` starts with "blob:" it's treated as a local preview URL.
 */
const StorageImage = ({
  path,
  alt,
  className,
  fallback,
}: StorageImageProps) => {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!path) {
      setSrc(null);
      return;
    }

    // Local blob URL (preview) — use directly
    if (path.startsWith("blob:")) {
      setSrc(path);
      return;
    }

    let revoke: string | null = null;

    const load = async () => {
      const storagePath = extractPath(path);
      const { data, error: dlError } = await supabase.storage
        .from("portfolio")
        .download(storagePath);

      if (dlError || !data) {
        setError(true);
        return;
      }

      const url = URL.createObjectURL(data);
      revoke = url;
      setSrc(url);
    };

    load();

    return () => {
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [path]);

  if (!path || error) {
    return fallback ? <>{fallback}</> : null;
  }

  if (!src) {
    return (
      <div
        className={
          className +
          " animate-pulse bg-gray-800 flex items-center justify-center"
        }
      >
        <div className="w-6 h-6 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin" />
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} />;
};

export default StorageImage;
