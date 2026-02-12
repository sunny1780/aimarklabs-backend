import React from 'react';

const blogTags = Array.from({ length: 15 }, () => 'sdjbcewiycbesjdbcsdh');

const BlogExtra = () => {
  return (
    <section className="bg-[#F3F5F7] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center px-4 py-2 rounded-[8px] bg-[#D7DDFC] border border-[#B3BDEF] text-[#272D55] text-[14px] font-medium">
            Blogs
          </span>
          <h2 className="mt-5 text-[#111111] text-4xl sm:text-5xl lg:text-[72px] leading-[1.05] font-medium">
            Stay Informed About The Trends
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {blogTags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="inline-flex items-center justify-center rounded-full bg-[#E9EDF6] text-[#111111] text-sm sm:text-base lg:text-[16px] px-6 py-3 leading-none"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 rounded-[6px] bg-[#F29335] px-8 py-3 text-white text-[16px] font-medium hover:bg-[#e88f2b] transition-colors"
          >
            Learn More
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogExtra;
