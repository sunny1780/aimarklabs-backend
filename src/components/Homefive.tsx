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
            <span className="inline-flex items-center px-5 py-3 rounded-md text-[16px] font-semibold tracking-wide text-[#272D55] bg-[#D7DDFC] shadow-sm border border-[#B3BDEF]">
              Testimonials
            </span>
          </div>
          <h2 className="text-[60px] font-extrabold text-gray-900 leading-tight mb-4">
            Hear What Our Clients Have to Say
          </h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-2xl mx-auto">
            Real feedback from brands we've helped grow through smart marketing.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="wave-card wave-delay-0 bg-gradient-to-br from-white/70 via-white/40 to-white/10 backdrop-blur-xl rounded-3xl px-8 py-8 border border-white/40 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div>
              <div className="pt-2">
                <h3 className="font-bold text-gray-900 text-lg mb-1">Megan</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Student at New York University</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-base">
              "This cup is fantastic! It is so well insulated. I live in the desert, and it keeps my cold drinks cold in the heat"
            </p>
          </div>

          {/* Card 2 */}
          <div className="wave-card wave-delay-1 bg-gradient-to-br from-white/70 via-white/40 to-white/10 backdrop-blur-xl rounded-3xl px-8 py-8 border border-white/40 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div>
              <div className="pt-2">
                <h3 className="font-bold text-gray-900 text-lg mb-1">Jerry Tang</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Recent graduate, Marketing at Sweatpals</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-base">
              "Joining Mate community is the best thing I have ever done. The projects I worked on gave me the experience I needed in content Marketing"
            </p>
          </div>

          {/* Card 3 */}
          <div className="wave-card wave-delay-2 bg-gradient-to-br from-white/70 via-white/40 to-white/10 backdrop-blur-xl rounded-3xl px-8 py-8 border border-white/40 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div>
              <div className="pt-2">
                <h3 className="font-bold text-gray-900 text-lg mb-1">Jerry Tang</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Recent graduate, Marketing at Sweatpals</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-base">
              "I love the color. It's even better in person. I love that iron flask gives you multiple lids as well. It's sturdy."
            </p>
          </div>

          {/* Card 4 */}
          <div className="wave-card wave-delay-0 bg-gradient-to-br from-white/70 via-white/40 to-white/10 backdrop-blur-xl rounded-3xl px-8 py-8 border border-white/40 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div>
              <div className="pt-2">
                <h3 className="font-bold text-gray-900 text-lg mb-1">David K.</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Recent graduate, Marketing at Sweatpals</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-base">
              "I love the color. It's even better in person. I love that iron flask gives you multiple lids as well. It's sturdy. It is kept my cold beverages clothes for way longer than I had expected it to."
            </p>
          </div>

          {/* Card 5 */}
          <div className="wave-card wave-delay-1 bg-gradient-to-br from-white/70 via-white/40 to-white/10 backdrop-blur-xl rounded-3xl px-8 py-8 border border-white/40 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div>
              <div className="pt-2">
                <h3 className="font-bold text-gray-900 text-lg mb-1">Megan</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Student at New York University</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-base">
              "I absolutely love this cup. I've bought several different brands and there's always something I end up not liking about them. This one checks all of the boxes."
            </p>
          </div>

          {/* Card 6 */}
          <div className="wave-card wave-delay-2 bg-gradient-to-br from-white/70 via-white/40 to-white/10 backdrop-blur-xl rounded-3xl px-8 py-8 border border-white/40 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div>
              <div className="pt-2">
                <h3 className="font-bold text-gray-900 text-lg mb-1">David K.</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Recent graduate</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-base">
              "I absolutely love this cup. I've bought several different brands and there's always something"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homefive;