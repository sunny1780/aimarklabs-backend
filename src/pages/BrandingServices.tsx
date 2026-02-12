import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Homecta from '../components/Homecta';
import BrandingHero from '../components/BrandingHero';
import BrandArchitectureSection from '../components/BrandArchitectureSection';
import BrandingOfferingsSection from '../components/BrandingOfferingsSection';
import Brandingfaq from '../components/Brandingfaq';
import Brandingblogs from '../components/Brandingblogs';

interface BrandingServicesProps {
  onLoginClick: () => void;
}

const BrandingServices: React.FC<BrandingServicesProps> = ({
  onLoginClick
}) => {
  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <Navbar onLoginClick={onLoginClick} />

      <main>
        <BrandingHero />
        <BrandArchitectureSection />
        <BrandingOfferingsSection />

        <Brandingfaq />
        <Brandingblogs />

        {/*
        <section className="py-14 sm:py-16">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-[#111827] text-white p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                  Ready to position your brand for the next stage of growth?
                </h2>
                <p className="mt-3 text-white/80 leading-relaxed">
                  Let&apos;s shape a brand identity that feels premium, performs across channels, and scales with your
                  business.
                </p>
              </div>
              <div className="flex lg:justify-end">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#F29335] text-white font-semibold hover:bg-[#de8126] transition-colors"
                >
                  Book a Branding Consultation
                </a>
              </div>
            </div>
          </div>
        </section>
        */}
      </main>

      <Homecta />
      <Footer />
    </div>
  );
};

export default BrandingServices;
