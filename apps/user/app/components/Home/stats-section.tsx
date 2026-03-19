"use client";

interface StatCardProps {
  title: string;
  description: string;
}

function StatCard({ title, description }: StatCardProps) {
  return (
    <div className="bg-white border border-[#C4C4C4] rounded-xl p-6 w-full max-w-66 transition">
      <h3 className="text-[#0177AB] font-bold text-[24px]">
        {title}
      </h3>
      <p className="text-[#304659] text-base font-normal mt-2 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function StatsSection() {
  const stats = [
    {
      title: "384K+ Billboards",
      description:
        "Deployed across all six geo-political zones in Nigeria.",
    },
    {
      title: "10M Impressions",
      description:
        "Delivering massive visibility for partner brands.",
    },
    {
      title: "100+ Locations",
      description:
        "From Lagos Island to Ibadan, Abeokuta, & Akure.",
    },
    {
      title: "98% Satisfaction",
      description:
        "Consistent support & successful delivery.",
    },
  ];

  return (
    <section className="w-full bg-white py-18 px-18">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="w-[450px]">
          <h2 className="text-[32px] font-semibold text-[#0D0A19]">
            We Turn Traffic Into Attention.
          </h2>
          <p className="text-[#333333] mt-2 text-base leading-relaxed font-normal">
            From static boards to digital screens, we give your business the visibility it deserves - everywhere your customers go.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              description={stat.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}