import { motion } from "framer-motion";
import { cn } from "./lib/utils";
import { Filter } from "./App";

export const FilterTabs = ({
  filter,
  onChange,
}: {
  filter: Filter;
  onChange: (filter: Filter) => void;
}) => {
  const tabs = ["all", "active", "completed"] as const;

  return (
    <div className="flex relative border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <div className="flex w-full p-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            onClick={() => onChange(tab)}
            className={cn(
              "flex-1 px-4 py-2 text-sm font-medium relative rounded-md transition-all duration-200",
              filter === tab
                ? "text-white font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <span className="relative z-10">
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </span>
            {filter === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-[#ff4153] rounded-md shadow-lg"
                style={{ zIndex: 0 }}
                initial={false}
                transition={{
                  type: "spring",
                  bounce: 0.1,
                  duration: 0.3,
                  stiffness: 150,
                  damping: 20,
                }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
