"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  draggable?: boolean;
  onClick?: () => void;
};

/** Starts image requests before their rendered box reaches the viewport. */
export function DeferredImage({ src, alt, className, eager = false, draggable, onClick }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    if (eager) return;
    const image = ref.current;
    if (!image) return;

    const preloadMargin = Math.max(900, Math.round(window.innerHeight * 1.5));
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      // Give the browser roughly 1.5 screens to fetch and decode the image before it is visible.
      { rootMargin: `${preloadMargin}px 0px` },
    );

    observer.observe(image);
    return () => observer.disconnect();
  }, [eager, src]);

  return (
    <img
      ref={ref}
      src={eager || nearViewport ? src : undefined}
      data-deferred-src={eager || nearViewport ? undefined : src}
      alt={alt}
      className={className}
      loading={eager || nearViewport ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "low"}
      decoding="async"
      draggable={draggable}
      onClick={onClick}
    />
  );
}
