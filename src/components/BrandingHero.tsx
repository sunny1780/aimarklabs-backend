import React from 'react';
import Folder from './Folder';

const folderImages = [
  '/images/1%20(1).png',
  '/images/2%20(1).png',
  '/images/3%20(1).png'
];

const BrandingHero: React.FC = () => {
  return (
    <section className="bg-[#eceef2] pt-12 sm:pt-16 pb-14 sm:pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-center min-h-[560px]">
          <div className="max-w-xl">
            <span className="inline-flex items-center rounded-[10px] border border-[#B3BDEF] bg-[#D7DDFC] text-[#272D55] text-[16px] sm:text-[18px] leading-none px-6 py-3 sm:px-5 sm:py-2.5">
              Branding
            </span>

           <h1 className="mt-12 sm:mt-14 text-[60px] leading-[0.98] font-semibold tracking-[-0.02em] text-[#1E1E1E]">
  Build Your Brand
  <br />
  Legacy
</h1>


           <a
  href="/contact"
  className="mt-12 inline-flex items-center justify-center rounded-[6px] bg-[#F29335] text-white text-[16px] leading-none px-8 py-4 sm:px-8 sm:py-4 hover:bg-[#df8428] transition-colors"
>
  Build Your Brand with Us
</a>

          </div>

          <div className="h-[420px] sm:h-[430px] rounded-none relative overflow-hidden flex items-center justify-center">
            <div style={{ height: '600px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Folder
                color="#f29335"
                size={2}
                className="custom-folder"
                items={folderImages.map(src => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="w-full h-full object-cover rounded-[10px]"
                  />
                ))}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandingHero;
