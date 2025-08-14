import React from "react";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const FilterBar = ({ filters, onFilterChange, onClearFilters }) => {
  const stageOptions = [
    { value: "cold-lead", label: "Cold Lead" },
    { value: "hot-lead", label: "Hot Lead" },
    { value: "estimate-sent", label: "Estimate Sent" },
    { value: "deal-closed", label: "Deal Closed" },
  ];

  const priorityOptions = [
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-card p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <Select
          placeholder="Filter by stage"
          options={stageOptions}
          value={filters.stage || ""}
          onChange={(e) => onFilterChange("stage", e.target.value)}
          className="min-w-[180px]"
        />
        
        <Select
          placeholder="Filter by priority"
          options={priorityOptions}
          value={filters.priority || ""}
          onChange={(e) => onFilterChange("priority", e.target.value)}
          className="min-w-[180px]"
        />

        <Button
          variant="ghost"
          icon="X"
          onClick={onClearFilters}
          className="text-gray-500"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;