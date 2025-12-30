import {
  Box,
  Stack,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";

import { useCars } from "../contexts/CarsContext";

import { Car } from "./Car";
import { Pagination } from "./shared/Pagination";

export function CarsList() {
  const {
    carsWithImage,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalCount,
    totalPages,
  } = useCars();
  const [collapsedCarId, setCollapsedCarId] = useState<string | null>(null);

  const stickyPaginationRef = useRef<HTMLDivElement | null>(null);
  const [isPaginationStuck, setIsPaginationStuck] = useState(false);

  useEffect(() => {
    const el = stickyPaginationRef.current!;

    let rafId = 0;
    const check = () => {
      const rect = el.getBoundingClientRect();
      const distanceToBottom = Math.abs(rect.bottom - window.innerHeight);
      setIsPaginationStuck(distanceToBottom <= 1.5);
    };

    const onScrollOrResize = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        check();
      });
    };

    check();
    document.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      document.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <Stack
      spacing={3}
      sx={{
        minHeight: 0,
        flex: "1 1 auto",
        height: "100%",
      }}
    >
      <Box
        sx={(theme) => ({
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "stretch",
          justifyContent: "flex-start",
          flex: "1 1 auto",
          minHeight: 0,
          [theme.breakpoints.up("sm")]: {
            overflowY: "auto",
            pr: 1,

            scrollbarWidth: "thin",
            scrollbarColor: `${alpha(theme.palette.common.white, 0.24)} ${alpha(
              theme.palette.common.white,
              0.06
            )}`,

            "&::-webkit-scrollbar": {
              width: 10,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: alpha(theme.palette.common.white, 0.06),
              borderRadius: 999,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: alpha(theme.palette.common.white, 0.24),
              borderRadius: 999,
              border: `2px solid ${alpha(theme.palette.common.white, 0.06)}`,
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: alpha(theme.palette.common.white, 0.34),
            },
          },
        })}
      >
        {carsWithImage.map(({ car, imageUrl }) => (
          <Box
            key={String(car.id)}
            sx={{
              flex: {
                xs: "1 1 100%",
                sm: "1 1 calc((100% - 16px) / 2)",
                md: "1 1 calc((100% - 32px) / 3)",
              },
              minWidth: 260,
              maxWidth: {
                xs: "100%",
                sm: "calc((100% - 16px) / 2)",
                md: "calc((100% - 32px) / 3)",
              },
            }}
          >
            <Car
              car={car}
              imageUrl={imageUrl}
              isFooterCollapsed={collapsedCarId === String(car.id)}
              onToggleFooterCollapsed={() => {
                const id = String(car.id);
                setCollapsedCarId((prev) => (prev === id ? null : id));
              }}
            />
          </Box>
        ))}
      </Box>

      <Box
        ref={stickyPaginationRef}
        sx={{
          position: { sm: "sticky" },
          bottom: { sm: 0 },
          zIndex: 1,
          backgroundColor: "transparent",
        }}
      >
        <Pagination
          page={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          transparentWhenStickyBottom={!isPaginationStuck}
        />
      </Box>
    </Stack>
  );
}
