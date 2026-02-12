import React from 'react';

const offerings = [
  {
    title: 'Custom Web Application Development',
    description:
      'Build tailored web solutions with modern frameworks, API integrations, and cloud-native architecture optimized for performance, scalability, and user engagement.',
  },
  {
    title: 'Mobile App Development',
    description:
      'Develop native and cross-platform mobile applications with intuitive interfaces, offline capabilities, and seamless backend integration for exceptional user experiences.',
  },
  {
    title: 'E-Commerce Platform Solutions',
    description:
      'Engineer secure, conversion-optimized online stores with payment gateway integration, inventory management, and analytics systems that maximize revenue potential.',
  },
];

const DevelopmentOfferingsSection: React.FC = () => {
  return (
    <section className="bg-[#1D2255] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center">
    <span className="inline-flex items-center px-4 py-2 rounded-[8px] bg-[#D7DDFC] border border-[#B3BDEF] text-[#272D55] text-[14px] font-medium">
  What We Deliver
</span>



<h2 className="mt-6 text-[#FFFFFF] text-4xl sm:text-5xl lg:text-[60px] leading-[1.05] font-medium">
  Our Development Offerings
</h2>


        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {offerings.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-[#AAB4EA] bg-[#1E245A] p-5 sm:p-6 min-h-[280px] sm:min-h-[300px] flex flex-col"
            >
              <img
                src="/images/Vector.svg"
                alt=""
                aria-hidden="true"
                className="w-[30px] h-[30px]"
              />
              <div className="mt-auto">
                <h3 className="text-[#FFFFFF] text-[20px] leading-[1.2] font-medium">
                  {item.title}
                </h3>
                <p className="mt-4 text-[#FFFFFF] text-[16px] leading-[1.45] font-normal">
                  {item.description}
                </p>
              </div>

            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
<a
  href="/contact"
  className="inline-flex items-center rounded-[8px] bg-[#F29335] px-7 py-3 text-[#FFFFFF] text-[16px] font-medium hover:bg-[#e7862b] transition-colors"
>
  Start Your Development Project
</a>


        </div>
      </div>
    </section>
  );
};

export default DevelopmentOfferingsSection;
