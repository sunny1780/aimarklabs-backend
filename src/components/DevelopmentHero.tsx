import React from 'react';

const DevelopmentHero: React.FC = () => {
  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/images/video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[#040912]/65" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center px-5 sm:px-6 lg:px-8">
        <div className="text-center">
   <span className="inline-flex items-center rounded-[8px] border border-[#D7DDFC] bg-[#D7DDFC] px-5 py-2 text-[14px] font-medium text-[#272D55]">
  Development
</span>



        <h1 className="mt-6 text-white text-5xl sm:text-6xl lg:text-[60px] leading-[0.95] font-semibold">
  Solutions That
  <br />
  Perform
</h1>


         <a
  href="/contact"
  className="mt-8 inline-flex items-center rounded-lg bg-[#F29335] px-7 py-3 text-white text-[16px] font-medium hover:bg-[#e7862b] transition-colors"
>
  Launch Your Digital Platform
</a>

        </div>
      </div>
    </section>
  );
};

export default DevelopmentHero;
