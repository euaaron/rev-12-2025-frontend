import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { lazy, Suspense, useState } from "react";

import { CarsFiltersSidebar } from "../components/CarsFiltersSidebar";
import { NewCar } from "../components/NewCar";
import { useCars } from "../contexts/CarsContext";

const CarsList = lazy(async () => {
  const module = await import("../components/CarsList");
  return { default: module.CarsList };
});

export function Cars() {
  const { loading, error, createError } = useCars();

  const [showFilters, setShowFilters] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const theme = useTheme();
  const fullScreenCreate = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container
      maxWidth={false}
      sx={{
        pb: 4,
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        px: { xs: 2, sm: 3, md: 4 },
        width: "100%",
        maxWidth: 1920,
        mx: "auto",
      }}
    >
        <Stack spacing={3} sx={{ flex: "1 1 auto", minHeight: 0 }}>
          <Box
            sx={(theme) => ({
              position: "sticky",
              top: 0,
              zIndex: theme.zIndex.appBar,
              backgroundColor: "transparent",
              pt: 4,
              pb: 2,
            })}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h4" component="h1">
                Cars
              </Typography>

              <Button
                variant="contained"
                onClick={() => setIsCreateOpen(true)}
                endIcon={<AddCircleOutlineIcon fontSize="small" />}
              >
                New Car
              </Button>
            </Stack>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              alignItems: { xs: "stretch", md: "stretch" },
              flex: "1 1 auto",
              minHeight: 0,
            }}
          >
            {/* Sidebar filters */}
            <Box
              sx={{
                width: { xs: "100%", md: showFilters ? 320 : "auto" },
                flex: { xs: "0 0 auto", md: showFilters ? "0 0 320px" : "0 0 auto" },
                position: { md: "sticky" },
                top: { md: 88 },
                alignSelf: { md: "flex-start" },
              }}
            >
              {showFilters ? (
                <CarsFiltersSidebar
                  onToggle={() => setShowFilters(false)}
                  toggleAriaLabel="Hide filters"
                />
              ) : (
                <Paper variant="outlined" sx={{ p: 1, display: "inline-flex" }}>
                  <IconButton
                    aria-label="Show filters"
                    onClick={() => setShowFilters(true)}
                  >
                    <FilterListIcon />
                  </IconButton>
                </Paper>
              )}
            </Box>

            {/* Main content */}
            <Box
              sx={{
                flex: "1 1 auto",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
              }}
            >
              <Stack spacing={3} sx={{ flex: "1 1 auto", minHeight: 0 }}>
                {createError ? (
                  <Alert severity="error">Failed to create car.</Alert>
                ) : null}

                {error ? <Alert severity="error">{error.message}</Alert> : null}

                <Box
                  sx={{
                    flex: "1 1 auto",
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Suspense
                      fallback={
                        <Box
                          sx={{ display: "flex", justifyContent: "center", py: 6 }}
                        >
                          <CircularProgress />
                        </Box>
                      }
                    >
                      <Box
                        sx={{
                          flex: "1 1 auto",
                          minHeight: 0,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <CarsList />
                      </Box>
                    </Suspense>
                  )}
                </Box>
              </Stack>
            </Box>
          </Box>
        </Stack>

        <Dialog
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          fullWidth
          maxWidth="sm"
          fullScreen={fullScreenCreate}
          BackdropProps={{
            sx: {
              backdropFilter: "blur(6px)",
            },
          }}
        >
          <DialogTitle sx={{ position: "relative" }}>
            Add a new car
            <IconButton
              aria-label="Close"
              onClick={() => setIsCreateOpen(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <NewCar onSubmitted={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
    </Container>
  );
}
