"use client";

import FilterSection from "./FilterSection";
import Checkbox from "./Checkbox";

const FilterSidebar = () => {
  return (
    <aside className="space-y-6">
      
      {/* Billboard Type */}
      <FilterSection title="Billboard Type" searchable>
        <input
          type="text"
          placeholder="e.g. Static Billboard"
          className="w-full px-3 py-2 text-sm bg-white border border-[#E0E0E0] rounded-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FilterSection>

      {/* Pricing */}
      <FilterSection title="Pricing">
        <Checkbox label="₦0 - ₦200,000" />
        <Checkbox label="₦200,000 - ₦500,000" />
        <Checkbox label="₦500,000 - ₦1,000,000" />
        <Checkbox label="₦1,000,000 - ₦2,000,000" />
        <Checkbox label="₦2,000,000 - ₦5,000,000" />
      </FilterSection>

      {/* Landmark */}
      <FilterSection title="Landmark" searchable>
        <input
          type="text"
          placeholder="e.g School"
          className="w-full px-3 py-2 text-sm bg-white border border-[#E0E0E0] rounded-sm outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        />

        <Checkbox label="Church" count={200} />
        <Checkbox label="School" count={100} />
        <Checkbox label="Beach" count={15} />
        <Checkbox label="Club" count={12} />
        <Checkbox label="Lounge" count={230} />
        <Checkbox label="Hotels" count={12} />
      </FilterSection>
    </aside>
  );
};

export default FilterSidebar;