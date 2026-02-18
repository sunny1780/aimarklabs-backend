import { motion } from 'framer-motion';

type SharedVideoProps = {
  className?: string;
  layoutId?: string;
  src: string;
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

const SharedVideo: React.FC<SharedVideoProps> = ({ className = '', layoutId, src }) => {
  const youtubeVideoId = getYouTubeVideoId(src);
  const youtubeEmbedUrl = youtubeVideoId
    ? `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${youtubeVideoId}&controls=1&rel=0&modestbranding=1`
    : null;

  return (
    <motion.div
      layoutId={layoutId}
      transition={{ type: 'spring', stiffness: 140, damping: 24, mass: 0.7 }}
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
