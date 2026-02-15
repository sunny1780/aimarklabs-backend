import { motion } from 'framer-motion';

type SharedVideoProps = {
  className?: string;
  layoutId?: string;
  src: string;
};

const SharedVideo: React.FC<SharedVideoProps> = ({ className = '', layoutId, src }) => {
  return (
    <motion.div
      layoutId={layoutId}
      transition={{ type: 'spring', stiffness: 140, damping: 24, mass: 0.7 }}
      className={`overflow-hidden rounded-2xl ring-1 ring-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.25)] bg-black/5 ${className}`}
    >
      <video
        className="w-full h-full object-cover"
        src={src}
        autoPlay
        loop
        muted
        playsInline
      />
    </motion.div>
  );
};

export default SharedVideo;
