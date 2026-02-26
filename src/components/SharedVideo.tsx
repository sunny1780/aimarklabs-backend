import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type SharedVideoProps = {
  className?: string;
  layoutId?: string;
  src: string;
  /** For mobile - layoutId doesn't work on iOS Safari, use slide-down instead */
  entranceAnimation?: 'slideDown';
};

const getYouTubeVideoId = (url: string): string | null => {
  const shortMatch = url.match(/youtu\.be\/([^?&/]+)/i);
  if (shortMatch?.[1]) {
    return shortMatch[1];
  }

  const watchMatch = url.match(/[?&]v=([^?&/]+)/i);
  if (watchMatch?.[1]) {
    return watchMatch[1];
  }

  const embedMatch = url.match(/youtube\.com\/embed\/([^?&/]+)/i);
  if (embedMatch?.[1]) {
    return embedMatch[1];
  }

  return null;
};

const SharedVideo: React.FC<SharedVideoProps> = ({
  className = '',
  layoutId,
  src,
  entranceAnimation,
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const useEntranceAnimation = entranceAnimation === 'slideDown' && !prefersReducedMotion;
  const slideDownProps = useEntranceAnimation
    ? {
        initial: { y: -40, opacity: 0 } as const,
        animate: { y: 0, opacity: 1 } as const,
        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
      }
    : {};

  const youtubeVideoId = getYouTubeVideoId(src);
  const youtubeEmbedUrl = youtubeVideoId
    ? `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${youtubeVideoId}&controls=1&rel=0&modestbranding=1`
    : null;

  return (
    <motion.div
      {...slideDownProps}
      style={{
        backfaceVisibility: 'hidden' as const,
        WebkitBackfaceVisibility: 'hidden',
      }}
      className={`overflow-hidden rounded-2xl ring-1 ring-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.25)] bg-black/5 ${className}`}
    >
      {youtubeEmbedUrl ? (
        <iframe
          className="w-full h-full"
          src={youtubeEmbedUrl}
          title="YouTube video player"
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <video
          className="w-full h-full object-cover"
          src={src}
          autoPlay
          loop
          muted
          playsInline
        />
      )}
    </motion.div>
  );
};

export default SharedVideo;
