import { memo, useMemo } from "react";

const Index = (props: {
  types: string[];
  clickType: (type: string) => void;
  selectedTypes: string[];
}) => {
  return (
    <section className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <span>Types:</span>
      {props.types?.map((item) => (
        <button
          key={item}
          className={`p-4 border ${
            props.selectedTypes?.includes(item) ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => props?.clickType?.(item)}
        >
          {item}
        </button>
      ))}
    </section>
  );
};

export default memo(Index);
