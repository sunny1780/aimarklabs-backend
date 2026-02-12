import React from 'react';

const BrandingHero: React.FC = () => {
  return (
    <section className="bg-[#eceef2] pt-12 sm:pt-16 pb-14 sm:pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-center min-h-[560px]">
          <div className="max-w-xl">
            <span className="inline-flex items-center rounded-[10px] border border-[#B3BDEF] bg-[#D7DDFC] text-[#272D55] text-[16px] sm:text-[18px] leading-none px-6 py-3 sm:px-5 sm:py-2.5">
              Branding
            </span>

            <h1 className="mt-12 sm:mt-14 text-[52px] sm:text-[62px] lg:text-[72px] leading-[0.98] font-semibold tracking-[-0.02em] text-[#1E1E1E]">
              Build Your Brand
              <br />
              Legacy
            </h1>

            <a
              href="/contact"
              className="mt-12 inline-flex items-center justify-center rounded-[6px] bg-[#F29335] text-white text-[20px] sm:text-[24px] leading-none px-8 py-4 sm:px-8 sm:py-4 hover:bg-[#df8428] transition-colors"
            >
              Build Your Brand with Us
            </a>
          </div>

          <div className="bg-[#020016] h-[420px] sm:h-[430px] rounded-none relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[360px] h-[280px] sm:w-[420px] sm:h-[310px]">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[230px] h-[120px] sm:w-[250px] sm:h-[130px] bg-[#e1964b] rounded-[16px]" />

                <div className="absolute bottom-[95px] left-1/2 -translate-x-1/2 w-[100px] h-[54px] bg-[#d18a44] rounded-[20px]" />

                <div className="absolute top-[55px] left-[10px] w-[190px] h-[110px] sm:w-[210px] sm:h-[120px] bg-[#d7d7d7] rounded-[20px] rotate-[-16deg]" />
                <div className="absolute top-[55px] right-[10px] w-[190px] h-[110px] sm:w-[210px] sm:h-[120px] bg-[#d7d7d7] rounded-[20px] rotate-[16deg]" />
                <div className="absolute top-[15px] left-1/2 -translate-x-1/2 w-[180px] h-[110px] sm:w-[200px] sm:h-[130px] bg-[#ededed] rounded-[20px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandingHero;
