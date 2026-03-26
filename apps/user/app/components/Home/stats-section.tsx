"use client";

interface StatCardProps {
  title: string;
  description: string;
}

function StatCard({ title, description }: StatCardProps) {
  return (
    <div className="bg-white border border-[#c4c4c490] rounded-xl p-6 w-full sm:max-w-66 transition">
      <h3 className="text-[#0177AB] font-bold sm:text-[24px] text-[6vw]">
        {title}
      </h3>
      <p className="text-[#304659] sm:text-base text-[4vw] font-normal mt-2 leading-relaxed">
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
    <section className="w-full bg-white sm:py-18 sm:px-18 px-5 py-18">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="sm:w-112.5 w-full">
          <h2 className="sm:text-[32px] text-[5.5vw] font-semibold text-[#0D0A19]">
            We Turn Traffic Into Attention.
          </h2>
          <p className="text-[#333333] mt-2 sm:text-base text-[3.5vw] leading-relaxed font-normal">
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