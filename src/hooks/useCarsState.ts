import { useMutation, useQuery } from "@apollo/client";
import { useMediaQuery } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { CREATE_CAR, GET_CARS } from "../graphql/queries";
import type { SortBy, SortDir } from "../types/carSorting";
import type { ICar } from "../types/ICar";
import { getCarImage } from "../utils/image";
import { parseOptionalInt } from "../utils/parseOptionalInt";
import {
  isSortBy,
  isSortDir,
  sanitizeHttpUrl,
  sanitizeTextInput,
} from "../utils/safeInput";

import { useCarFilters, type CarFiltersState } from "./useCarFilters";

export type DeviceKind = "mobile" | "tablet" | "desktop";

function getDeviceKind({
  isMobile,
  isTablet,
  isDesktop,
}: {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}): DeviceKind {
  if (isDesktop) return "desktop";
  if (isTablet) return "tablet";
  if (isMobile) return "mobile";
  return "mobile";
}

export type CarsFiltersInput = {
  filterMake: string;
  filterModel: string;
  filterColor: string;
  filterYear: string;
  sortBy: SortBy;
  sortDir: SortDir;
};

const EMPTY_CARS: ICar[] = [];
const DEFAULT_PAGE_SIZE = 25;

type CreateCarResult = {
  createCar: ICar;
};

type CreateCarVars = {
  params: {
    make: string;
    model: string;
    year: number;
    color: string;

    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
};

export type CarsDataState = {
  loading: boolean;
  error: unknown;

  creating: boolean;
  createError: unknown;

  cars: ICar[];
  carsWithImage: Array<{ car: ICar; imageUrl: string }>;

  device: DeviceKind;

  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  totalCount: number;
  totalPages: number;

  createCar: (params: CreateCarVars["params"]) => Promise<ICar | undefined>;
  lastCreatedCar: ICar | undefined;

  refetch: () => Promise<unknown>;
};

function useCarsData(filters: CarsFiltersInput): CarsDataState {
  const isMobile = useMediaQuery("(max-width:640px)");
  const isTablet = useMediaQuery("(min-width:641px) and (max-width:1023px)");
  const isDesktop = useMediaQuery("(min-width:1024px)");

  const device = getDeviceKind({ isMobile, isTablet, isDesktop });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [
    filters.filterMake,
    filters.filterModel,
    filters.filterColor,
    filters.filterYear,
    filters.sortBy,
    filters.sortDir,
  ]);

  const [lastCreatedCar, setLastCreatedCar] = useState<ICar | undefined>(
    undefined
  );

  const { loading, error, data, refetch } = useQuery<{
    carsPage: { items: ICar[]; totalCount: number };
  }>(GET_CARS, {
    variables: {
      make: sanitizeTextInput(filters.filterMake).trim(),
      model: sanitizeTextInput(filters.filterModel).trim(),
      color: sanitizeTextInput(filters.filterColor).trim(),
      year: parseOptionalInt(filters.filterYear),
      sortBy: isSortBy(filters.sortBy) ? filters.sortBy : "make",
      sortDir: isSortDir(filters.sortDir) ? filters.sortDir : "asc",
      page,
      pageSize,
      isDesktop,
      isTablet,
      isMobile,
    },
  });

  const [createCarMutation, { loading: creating, error: createError }] =
    useMutation<CreateCarResult, CreateCarVars>(CREATE_CAR);

  const [cachedCarsPage, setCachedCarsPage] = useState<{
    items: ICar[];
    totalCount: number;
  }>({ items: EMPTY_CARS, totalCount: 0 });

  useEffect(() => {
    if (data?.carsPage) setCachedCarsPage(data.carsPage);
  }, [data?.carsPage]);

  const cars = cachedCarsPage.items ?? EMPTY_CARS;
  const totalCount = cachedCarsPage.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));

  useEffect(() => {
    setPage((prev) => Math.min(Math.max(1, prev), totalPages));
  }, [totalPages]);

  const carsWithImage = useMemo(() => {
    return cars.map((car) => ({
      car,
      imageUrl: getCarImage(car, device),
    }));
  }, [cars, device]);

  async function createCar(params: CreateCarVars["params"]) {
    try {
      const make = sanitizeTextInput(params.make).trim();
      const model = sanitizeTextInput(params.model).trim();
      const color = sanitizeTextInput(params.color).trim();
      const year = Number(params.year);
      if (!make || !model || !color) return undefined;
      if (
        !Number.isInteger(year) ||
        year < 1886 ||
        year > new Date().getFullYear() + 1
      ) {
        return undefined;
      }

      const safeParams: CreateCarVars["params"] = {
        make,
        model,
        color,
        year,
      };

      const mobile = params.mobile ? sanitizeHttpUrl(params.mobile) : undefined;
      const tablet = params.tablet ? sanitizeHttpUrl(params.tablet) : undefined;
      const desktop = params.desktop ? sanitizeHttpUrl(params.desktop) : undefined;
      if (mobile) safeParams.mobile = mobile;
      if (tablet) safeParams.tablet = tablet;
      if (desktop) safeParams.desktop = desktop;

      const result = await createCarMutation({
        variables: { params: safeParams },
      });

      const created = result.data?.createCar;
      setLastCreatedCar(created);

      await refetch();
      return created;
    } catch {
      return undefined;
    }
  }

  return {
    loading,
    error,
    creating,
    createError,
    cars,
    carsWithImage,
    device,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalCount,
    totalPages,
    createCar,
    lastCreatedCar,
    refetch,
  };
}

export type CarsState = CarFiltersState & CarsDataState;

export function useCarsState(): CarsState {
  const filters = useCarFilters();
  const data = useCarsData(filters);
  return { ...filters, ...data };
}
