type Props = {
  title: string;
  children: React.ReactNode;
  searchable?: boolean;
};

const FilterSection = ({ title, children }: Props) => {
  return (
    <div className="bg-[#F8FBFD] rounded-md p-4">
      
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        {title}
      </h3>

      <div className="space-y-2">{children}</div>
    </div>
  );
};

export default FilterSection;