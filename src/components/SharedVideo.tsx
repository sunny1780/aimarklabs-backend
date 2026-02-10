type SharedVideoProps = {
  className?: string;
  src: string;
};

const SharedVideo: React.FC<SharedVideoProps> = ({ className = '', src }) => {
  return (
    <div
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
    </div>
  );
};

export default SharedVideo;
