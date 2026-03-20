import DealCard from "../Card/DealCard";


const deals = [
  {
    title: "Lamppost Advertising",
    image: "/images/transit.jpg",
    available: 2980,
  },
  {
    title: "Bus Shelter Advertising",
    image: "/images/transit.jpg",
    available: 1090,
  },
  {
    title: "Large Format Print",
    image: "/images/transit.jpg",
    available: 289,
  },
  {
    title: "Large Format",
    image: "/images/transit.jpg",
    available: 10980,
  },
];

const HotDealsSection = () => {
  return (
    <section className="bg-[#F0EFFB] py-20 px-6 md:px-18">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Hot Deals Section
          </h2>
          <p className="text-gray-500 text-sm mt-3 leading-relaxed">
            Choose from hundreds of billboard spots strategically placed for
            maximum visibility and impact.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-14">
          {deals.map((deal, index) => (
            <DealCard
              key={index}
              title={deal.title}
              image={deal.image}
              available={deal.available}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotDealsSection;