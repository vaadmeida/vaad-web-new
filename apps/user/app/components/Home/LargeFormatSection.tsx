import LargeFormatCard from "../Card/LargeFormatCard";


const LargeFormatSection = () => {
  return (
    <section className="bg-white py-20 px-6 md:px-18">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-lg">
          <h2 className="text-[6vw] sm:text-3xl font-semibold text-[#0D0A19]">
            Large Format Print
          </h2>
          <p className="text-[#333333] sm:text-sm text-[3.5vw] font-normal mt-3 leading-relaxed">
            From idea to installation - we make outdoor advertising easy,
            measurable, and unforgettable.
          </p>
        </div>

        {/* Card */}
        <div className="mt-10">
          <LargeFormatCard
            title="Large Format Print"
            image="/images/large-format.jpg"
          />
        </div>
      </div>
    </section>
  );
};

export default LargeFormatSection;