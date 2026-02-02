const Servicehero = () => {
  return (
    <section className=" py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-12">
        
        {/* LEFT CONTENT */}
        <div className="w-full md:w-1/2">
          <span className="inline-block bg-[#E8ECFF] text-[#4B5CFF] text-sm px-4 py-1 rounded-full mb-4">
            UI/UX Design
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Adaptive, Human- <br /> Centered Designs
          </h1>

          <p className="text-[#687076] mb-6 max-w-md">
            From strategy to execution, our numbers reflect the growth we
            create for our clients.
          </p>

          <button className="bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-lg font-medium">
            Get Designs That Convert
          </button>
        </div>

        {/* RIGHT IMAGE */}
  {/* RIGHT IMAGE */}
  <div className="w-full md:w-1/2 flex justify-center">
  <div className="rounded-2xl overflow-hidden w-full h-[240px] sm:h-[300px] md:h-[360px]">
    <img
      src="/images/service-hero.jpg"
      alt="UI UX Design"
      className="w-full h-full object-cover"
    />
  </div>
</div>




      </div>
    </section>
  );
};

export default Servicehero;
