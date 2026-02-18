import React from 'react';

const Homefive: React.FC = () => {
  return (
    <section
      className="bg-[#F7F9FB] py-16 px-4 sm:px-6 lg:px-10"
      style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <span className="inline-flex items-center justify-center h-9 px-3 py-2 rounded border border-[#B3BDEF] text-[16px] font-semibold tracking-wide text-[#272D55] bg-[#D7DDFC]">
              Testimonials
            </span>
          </div>
          <h2
            className="text-gray-900 mb-4 w-[687px] max-w-full mx-auto text-center"
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 500,
              fontSize: '60px',
              lineHeight: '100%',
              letterSpacing: '0.5%'
            }}
          >
            Hear What Our Clients Have to Say
          </h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-2xl mx-auto">
            Real feedback from brands we've helped grow through smart marketing.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div
          className="relative rounded-3xl py-8 px-4 sm:px-6 bg-no-repeat"
          style={{
            backgroundImage: "url('/images/bbgg.png')",
            backgroundSize: '60%',
            backgroundPosition: 'center 70%'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {/* Card 1 */}
          <div className="wave-card wave-delay-0 bg-gradient-to-br from-[#F2F2F4]/80 via-[#F2F2F4]/40 to-[#F2F2F4]/20 backdrop-blur-xl rounded-3xl px-8 py-8 border border-[#656565]/10 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-6">
              {/* <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div> */}
              <div className="pt-2">
                <h3 className="font-bold text-gray-900 text-lg mb-1">Courtney</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                 Founder & App Owner</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-base">
         "Working with Al Mark Labs has been an outstanding experience. From development to overall digital growth, their team handled everything with precision and creativity. Their professionalism and dedication truly stand out."

            </p>
          </div>

          {/* Card 2 */}
          <div className="wave-card wave-delay-1 bg-gradient-to-br from-[#F2F2F4]/80 via-[#F2F2F4]/40 to-[#F2F2F4]/20 backdrop-blur-xl rounded-3xl px-8 py-8 border border-[#656565]/10 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-6">
              {/* <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div> */}
              <div className="pt-2">
                <h3 className="font-bold text-gray-900 text-lg mb-1">Quan</h3>
                <p className="text-sm text-gray-500 leading-relaxed"> Founder, Trading Services</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-base">
              "Al Mark Labs brought clarity and structure to my online presence. Their strategic approach and consistent support have made a noticeable difference. Reliable, knowledgeable, and results-driven team."
            </p>
          </div>

          {/* Card 3 */}
          <div className="wave-card wave-delay-2 bg-gradient-to-br from-[#F2F2F4]/80 via-[#F2F2F4]/40 to-[#F2F2F4]/20 backdrop-blur-xl rounded-3xl px-8 py-8 border border-[#656565]/10 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-6">
              {/* <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div> */}
              <div className="pt-2">
                <h3 className="font-bold text-gray-900 text-lg mb-1">Joslene</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Director</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-base">
              "The team at Al Mark Labs understands brand growth deeply. Their thoughtful strategies and attention to detail helped elevate our visibility and engagement. Smooth process and excellent communication throughout."
            </p>
          </div>

          {/* Card 4 */}
          <div className="wave-card wave-delay-0 bg-gradient-to-br from-[#F2F2F4]/80 via-[#F2F2F4]/40 to-[#F2F2F4]/20 backdrop-blur-xl rounded-3xl px-8 py-8 border border-[#656565]/10 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-6">
              {/* <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div> */}
              <div className="pt-2">
                <h3 className="font-bold text-gray-900 text-lg mb-1">Shahid Pervaiz</h3>
                <p className="text-sm text-gray-500 leading-relaxed"> Founder</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-base">
              "Al Mark Labs delivered exactly what we needed with efficiency and expertise. Their understanding of digital platforms and user experience has strengthened our online presence. Highly satisfied with the collaboration."
            </p>
          </div>

          {/* Card 5 */}
          <div className="wave-card wave-delay-1 bg-gradient-to-br from-[#F2F2F4]/80 via-[#F2F2F4]/40 to-[#F2F2F4]/20 backdrop-blur-xl rounded-3xl px-8 py-8 border border-[#656565]/10 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-6">
              {/* <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div> */}
              <div className="pt-2">
                <h3 className="font-bold text-gray-900 text-lg mb-1">Jacob</h3>
                <p className="text-sm text-gray-500 leading-relaxed">CEO</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-base">
"Choosing Al Mark Labs was a game-changer for our digital presence. Their strategies are insightful and yield great results. Exceptional service.""
            </p>
          </div>

          {/* Card 6 */}
          <div className="wave-card wave-delay-2 bg-gradient-to-br from-[#F2F2F4]/80 via-[#F2F2F4]/40 to-[#F2F2F4]/20 backdrop-blur-xl rounded-3xl px-8 py-8 border border-[#656565]/10 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-6">
              {/* <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div> */}
              <div className="pt-2">
                <h3 className="font-bold text-gray-900 text-lg mb-1">Mark</h3>
                <p className="text-sm text-gray-500 leading-relaxed">CEO</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-base">
             "Exceptional digital marketing services by Al Mark Labs. Saw a significant increase in traffic and engagement. I highly recommend their approach."
             </p>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homefive;
