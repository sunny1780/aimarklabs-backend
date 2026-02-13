import CardSwap, { Card } from './CardSwap';

const Servicehero = () => {
  return (
    <>
      <section className="py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-12">
          {/* LEFT CONTENT */}
          <div className="w-full md:w-1/2 service-hero-left">
            <span className="inline-block bg-[#E8ECFF] text-[#4B5CFF] text-sm px-4 py-1 rounded-full mb-4">
             Creative
            </span>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Design That Boosts <br /> Conversions
            </h1>

            <p className="text-[#687076] mb-6 max-w-md">
              From strategy to execution, our numbers reflect the growth we
              create for our clients.
            </p>

         <button className="relative group bg-[#F29335] hover:bg-orange-600 transition px-6 py-3 rounded-lg font-medium overflow-hidden text-white">
  <span className="relative z-10">Get Designs That Convert</span>
  <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <span className="absolute -inset-y-1 -left-10 w-20 rotate-12 bg-white/40 blur-md group-hover:translate-x-[220%] transition-transform duration-700" />
  </span>
</button>

          </div>

          {/* RIGHT CARDS */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div
              className="service-hero-image w-full max-w-[520px] h-[400px] sm:h-[420px] md:h-[420px] relative overflow-hidden"
            >
              <CardSwap
                width={320}
                height={220}
                cardDistance={42}
                verticalDistance={34}
                delay={3000}
                pauseOnHover={false}
              >
                <Card customClass="p-6 text-white shadow-xl">
                  <h3 className="text-2xl font-semibold mb-2">Card 1</h3>
                  <p className="text-sm text-slate-300">Your content here</p>
                </Card>
                <Card customClass="p-6 text-white shadow-xl">
                  <h3 className="text-2xl font-semibold mb-2">Card 2</h3>
                  <p className="text-sm text-slate-300">Your content here</p>
                </Card>
                <Card customClass="p-6 text-white shadow-xl">
                  <h3 className="text-2xl font-semibold mb-2">Card 3</h3>
                  <p className="text-sm text-slate-300">Your content here</p>
                </Card>
              </CardSwap>
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

          .service-hero-image {
            transform-origin: center;
            /* box-shadow: 0 20px 60px rgba(15, 23, 42, 0.25); */
            opacity: 0;
            transform: translateX(24px) scale(0.98);
            animation: serviceHeroImageIn 0.8s ease-out 0.1s forwards,
                       serviceHeroImageFloat 14s ease-in-out 0.9s infinite alternate;
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

          @keyframes serviceHeroImageIn {
            from {
              opacity: 0;
              transform: translateX(28px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }

          @keyframes serviceHeroImageFloat {
            0% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            50% {
              transform: translate3d(0, -10px, 0) scale(1.01);
            }
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }
          }
        `}
      </style>
    </>
  );
};

export default Servicehero;
