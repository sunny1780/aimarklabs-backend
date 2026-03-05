import React from 'react';

const BlogHero: React.FC = () => {
  return (
    <>
      <section
        className="relative min-h-[95vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-10 overflow-hidden"
        style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
      >
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/images/AboutHero.png"
            alt=""
            className="w-full h-full object-cover blog-hero-bg"
          />
        </div>

        <div className="relative z-10 flex items-center justify-center text-center">
          <h1
            className="blog-hero-heading text-[#272D55] uppercase"
            style={{
              fontFamily: "'Manrope', 'Segoe UI', sans-serif",
              fontWeight: 600,
              fontSize: 'clamp(48px, 12vw, 198px)',
              lineHeight: '100%',
              letterSpacing: '-0.02em',
            }}
          >
            <span className="blog-hero-letter">B</span>
            <span className="blog-hero-letter">L</span>
            <span className="blog-hero-letter">O</span>
            <span className="blog-hero-letter">G</span>
          
          </h1>
        </div>
      </section>

      {/* Local styles mirroring INDUSTRIES hero animation */}
      <style>
        {`
          .blog-hero-bg {
            transform-origin: center;
            animation: blogHeroBgPan 26s ease-in-out infinite alternate;
          }

          .blog-hero-heading {
            display: inline-flex;
            gap: 0.02em;
          }

          .blog-hero-letter {
            display: inline-block;
            opacity: 0;
            transform: translateY(22px);
            animation: blogHeroLetterIn 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
          }

          .blog-hero-letter:nth-child(1) { animation-delay: 0.05s; }
          .blog-hero-letter:nth-child(2) { animation-delay: 0.08s; }
          .blog-hero-letter:nth-child(3) { animation-delay: 0.11s; }
          .blog-hero-letter:nth-child(4) { animation-delay: 0.14s; }
          .blog-hero-letter:nth-child(5) { animation-delay: 0.17s; }

          @keyframes blogHeroBgPan {
            0% {
              transform: scale(1.03) translate3d(-10px, 0, 0);
            }
            50% {
              transform: scale(1.06) translate3d(0, -8px, 0);
            }
            100% {
              transform: scale(1.03) translate3d(10px, 0, 0);
            }
          }

          @keyframes blogHeroLetterIn {
            0% {
              opacity: 0;
              transform: translateY(26px);
            }
            60% {
              opacity: 1;
              transform: translateY(-4px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  );
};

export default BlogHero;
