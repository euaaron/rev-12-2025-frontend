import { useState } from "react";

import type { SortBy, SortDir } from "../types/carSorting";

type UseCarFiltersOptions = {
  initialMake?: string;
  initialModel?: string;
  initialColor?: string;
  initialYear?: string;
  initialSortBy?: SortBy;
  initialSortDir?: SortDir;
};

export function useCarFilters(options: UseCarFiltersOptions = {}) {
  const [filterMake, setFilterMake] = useState(options.initialMake ?? "");
  const [filterModel, setFilterModel] = useState(options.initialModel ?? "");
  const [filterColor, setFilterColor] = useState(options.initialColor ?? "");
  const [filterYear, setFilterYear] = useState(options.initialYear ?? "");

  const [sortBy, setSortBy] = useState<SortBy>(options.initialSortBy ?? "make");
  const [sortDir, setSortDir] = useState<SortDir>(options.initialSortDir ?? "asc");

  return {
    filterMake,
    setFilterMake,
    filterModel,
    setFilterModel,
    filterColor,
    setFilterColor,
    filterYear,
    setFilterYear,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
  };
}

export type CarFiltersState = ReturnType<typeof useCarFilters>;
