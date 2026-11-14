import { cn } from "@/lib/utils";
import { DeferredImage } from "@/components/site/deferred-image";

type Props = { src: string | null; alt: string; className?: string; label?: string; eager?: boolean };

export function Media({ src, alt, className, label, eager }: Props) {
  if (!src) {
    return (
      <div className={cn("grid place-items-center bg-muted", className)} role="img" aria-label={alt}>
        <span className="meta">{label ?? "no image"}</span>
      </div>
    );
  }
  // Keep plain <img> sources for uploads and data URLs, but request them before they enter the viewport.
  return <DeferredImage src={src} alt={alt} className={cn("object-cover", className)} eager={eager} />;
}
