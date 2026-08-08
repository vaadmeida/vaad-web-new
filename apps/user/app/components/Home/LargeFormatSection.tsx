import LargeFormatCard from "../Card/LargeFormatCard";


const LargeFormatSection = () => {
  return (
    <section className="bg-white py-20 px-6 md:px-18">
      <div className="max-w-7xl mx-auto">

        {/* Card */}
        <div className="mt-10">
          <LargeFormatCard
            title="Large Format Print"
            subtitle="Add print and installation to any booking at checkout. We handle production and mounting. Request a print quote."
            image="/images/lg.jpg"
          />
        </div>
      </div>
    </section>
  );
};

export default LargeFormatSection;