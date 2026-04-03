type Props = {
  label: string;
  count?: number;
};

const Checkbox = ({ label, count }: Props) => {
  return (
    <label className="flex items-center justify-between text-sm text-gray-600 cursor-pointer group">
      
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span>{label}</span>
      </div>

      {count !== undefined && (
        <span className="text-xs text-gray-400 group-hover:text-gray-600">
          {count}
        </span>
      )}
    </label>
  );
};

export default Checkbox;