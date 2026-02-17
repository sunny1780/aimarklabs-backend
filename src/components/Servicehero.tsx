import Stack from './Stack';
import TextType from './TextType';

const serviceImages = [
  '/images/onee.png',
  '/images/twoo.png',
  '/images/threee.png'
];

const Servicehero = () => {
  return (
    <>
      <section className="pt-10 sm:pt-12 pb-14 sm:pb-20 overflow-hidden min-h-[520px] md:min-h-[700px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col-reverse md:flex-row items-center gap-8 sm:gap-12">
          {/* LEFT CONTENT */}
          <div className="w-full md:w-1/2 service-hero-left">
            <span className="inline-block bg-[#E8ECFF] text-[#4B5CFF] text-sm px-4 py-1 rounded-full mb-4">
             Creative
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
              <TextType
                text={['Design That Boosts\nConversions']}
                as="span"
                typingSpeed={75}
                pauseDuration={2000}
                showCursor
                cursorCharacter="|"
                loop={false}
                startOnVisible
              />
            </h1>

            <p className="text-[#687076] text-sm sm:text-base mb-6 max-w-md">
              From strategy to execution, our numbers reflect the growth we
              create for our clients.
            </p>

         <button className="relative group bg-[#F29335] hover:bg-orange-600 transition px-5 sm:px-6 py-3 rounded-lg font-medium overflow-hidden text-white text-sm sm:text-base w-full sm:w-auto">
  <span className="relative z-10">Get Designs That Convert</span>
  <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <span className="absolute -inset-y-1 -left-10 w-20 rotate-12 bg-white/40 blur-md group-hover:translate-x-[220%] transition-transform duration-700" />
  </span>
</button>

          </div>

          {/* RIGHT STACK */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[400px] lg:h-[400px]">
              <Stack
                randomRotation={false}
                sensitivity={200}
                sendToBackOnClick={false}
                autoplay={true}
                autoplayDelay={2500}
                hoverToCycle={false}
                cards={serviceImages.map((src, i) => (
                  <div key={i} className="relative w-full h-full rounded-2xl overflow-hidden">
                    <img 
                      src={src} 
                      alt={`card-${i + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40"></div>
                    <div className="absolute top-6 left-6 z-10">
                      <h3 className="text-lg sm:text-2xl font-semibold text-white">
                        {i === 0 ? 'Design' : i === 1 ? 'Branding' : 'Experience'}
                      </h3>
                    </div>
                  </div>
                ))}
                pauseOnHover={false}
              />
            </div>
          </div>

        </div>
      </section>

      {/* Local styles for professional motion */}
      <style>
        {`
          .service-hero-left {
            opacity: 0;
            transform: translateX(-24px);
            animation: serviceHeroLeftIn 0.7s ease-out forwards;
          }

          @keyframes serviceHeroLeftIn {
            from {
              opacity: 0;
              transform: translateX(-28px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </>
  );
};

export default Servicehero;
