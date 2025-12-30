import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import type { SortBy, SortDir } from "../contexts/CarsContext";
import { useCars } from "../contexts/CarsContext";
import {
  sanitizeDigitsInput,
  sanitizeTextInput,
  isSortBy,
  isSortDir,
} from "../utils/safeInput";

export function CarsFiltersSidebar({
  onToggle,
  toggleAriaLabel,
}: {
  onToggle?: () => void;
  toggleAriaLabel?: string;
}) {
  const {
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
  } = useCars();

  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        p: 2,
        backgroundColor: alpha(theme.palette.background.paper, 0.62),
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      })}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="h2">
            Filters
          </Typography>
          {onToggle ? (
            <IconButton aria-label={toggleAriaLabel ?? "Toggle filters"} onClick={onToggle}>
              <FilterListIcon />
            </IconButton>
          ) : null}
        </Stack>

        <TextField
          label="Make"
          value={filterMake}
          onChange={(e) => setFilterMake(sanitizeTextInput(e.target.value))}
          slotProps={{ htmlInput: { maxLength: 64 } }}
          fullWidth
        />
        <TextField
          label="Model"
          value={filterModel}
          onChange={(e) => setFilterModel(sanitizeTextInput(e.target.value))}
          slotProps={{ htmlInput: { maxLength: 64 } }}
          fullWidth
        />
        <TextField
          label="Color"
          value={filterColor}
          onChange={(e) => setFilterColor(sanitizeTextInput(e.target.value))}
          slotProps={{ htmlInput: { maxLength: 64 } }}
          fullWidth
        />
        <TextField
          label="Year"
          value={filterYear}
          onChange={(e) => setFilterYear(sanitizeDigitsInput(e.target.value, 4))}
          slotProps={{
            htmlInput: {
              inputMode: "numeric",
              maxLength: 4,
              pattern: "\\d{4}",
            },
          }}
          fullWidth
        />

        <Divider />

        <Typography variant="h6" component="h2">
          Sort
        </Typography>

        <FormControl fullWidth>
          <InputLabel id="sort-by-label">Sort by</InputLabel>
          <Select<SortBy>
            labelId="sort-by-label"
            label="Sort by"
            value={sortBy}
            onChange={(e) => {
              const next = e.target.value;
              if (isSortBy(next)) setSortBy(next);
            }}
          >
            <MenuItem value="make">Make</MenuItem>
            <MenuItem value="model">Model</MenuItem>
            <MenuItem value="year">Year</MenuItem>
            <MenuItem value="color">Color</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="sort-dir-label">Direction</InputLabel>
          <Select<SortDir>
            labelId="sort-dir-label"
            label="Direction"
            value={sortDir}
            onChange={(e) => {
              const next = e.target.value;
              if (isSortDir(next)) setSortDir(next);
            }}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
}
