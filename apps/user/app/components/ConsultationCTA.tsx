import ConsultationCard from "./Card/ConsultationCard";



const ConsultationSection = () => {
  return (
    <section className="bg-white py-20 px-6 md:px-18">
      <div className="max-w-7xl mx-auto">

        {/* Card */}
        <div className="mt-10">
          <ConsultationCard
            title="Book a consultation and put your brand on the streets."
            subtitle=""
            image="/images/map.svg"
          />
        </div>
      </div>
    </section>
  );
};

export default ConsultationSection;