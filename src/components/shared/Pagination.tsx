import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import {
  alpha,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export type PaginationProps = {
  loading?: boolean;
  page: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  totalCount: number;
  totalPages: number;
  pageSizeOptions?: number[];
  transparentWhenStickyBottom?: boolean;
};

export function Pagination({
  loading = false,
  page,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalCount,
  totalPages,
  pageSizeOptions = [10, 25, 50, 100, 250],
  transparentWhenStickyBottom = false,
}: PaginationProps) {
  const disableFirstPrev = loading || totalCount === 0 || page <= 1;
  const disableNextLast = loading || totalCount === 0 || page >= totalPages;

  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, Math.floor(page || 1)), safeTotalPages);

  const startItem = totalCount === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = totalCount === 0 ? 0 : Math.min(safePage * pageSize, totalCount);

  return (
    <Paper
      variant="outlined"
      sx={{
        px: 2,
        py: 1.5,
        backgroundColor: "transparent",
        border: "none",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1.5, sm: 2 }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent={{ xs: "center", sm: "center", lg: "space-between" }}
      >
        <Paper
          variant="outlined"
          sx={(theme) => ({
            display: { xs: "none", lg: "flex" },
            alignItems: "center",
            backgroundColor: transparentWhenStickyBottom
              ? "transparent"
              : alpha(theme.palette.background.paper, 0.62),
            borderColor: transparentWhenStickyBottom ? "transparent" : theme.palette.divider,
            backdropFilter: transparentWhenStickyBottom ? "blur(0px)" : "blur(18px)",
            WebkitBackdropFilter: transparentWhenStickyBottom ? "blur(0px)" : "blur(18px)",
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(0.5, 2),
          })}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Items per page</Typography>
            <FormControl
              size="small"
              sx={{
                width: 72,
                "& .MuiInputBase-root": {
                  height: 40,
                },
              }}
            >
              <Select
                value={pageSize}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  if (!Number.isFinite(next) || next <= 0) return;
                  onPageSizeChange(next);
                  onPageChange(1);
                }}
                SelectDisplayProps={{ "aria-label": "Items per page" }}
              >
                {pageSizeOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="body2" color="text.secondary">
              {startItem}–{endItem} of {totalCount} items
            </Typography>
          </Stack>
        </Paper>

        <Paper
          variant="outlined"
          sx={(theme) => ({
            width: { xs: "100%", lg: "auto" },
            backgroundColor: transparentWhenStickyBottom
              ? "transparent"
              : alpha(theme.palette.background.paper, 0.62),
            borderColor: transparentWhenStickyBottom ? "transparent" : theme.palette.divider,
            backdropFilter: transparentWhenStickyBottom ? "blur(0px)" : "blur(18px)",
            WebkitBackdropFilter: transparentWhenStickyBottom ? "blur(0px)" : "blur(18px)",
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(0.5, 1),
          })}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent={{ xs: "center", lg: "flex-end" }}
          >
            <IconButton
              aria-label="First page"
              onClick={() => onPageChange(1)}
              disabled={disableFirstPrev}
              size="small"
            >
              <FirstPageIcon fontSize="small" />
            </IconButton>

            <IconButton
              aria-label="Previous page"
              onClick={() => onPageChange(Math.max(1, safePage - 1))}
              disabled={disableFirstPrev}
              size="small"
              sx={{ display: { xs: "inline-flex", sm: "none" } }}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>

            <Button
              variant="text"
              size="small"
              startIcon={<KeyboardArrowLeftIcon />}
              onClick={() => onPageChange(Math.max(1, safePage - 1))}
              disabled={disableFirstPrev}
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              Previous
            </Button>

            <TextField
              size="small"
              value={String(safePage)}
              onChange={(e) => {
                const next = Number(e.target.value);
                if (!Number.isFinite(next)) return;
                onPageChange(Math.min(Math.max(1, Math.floor(next)), safeTotalPages));
              }}
              slotProps={{
                htmlInput: {
                  inputMode: "numeric",
                  pattern: "\\d*",
                  min: 1,
                  max: safeTotalPages,
                  "aria-label": "Page",
                  style: { textAlign: "center"},
                },
              }}
              sx={{
                width: 72,
                "& .MuiInputBase-root": {
                  height: 40,
                },
              }}
            />

            <Typography variant="body2" color="text.secondary">
              of &nbsp; {safeTotalPages}
            </Typography>

            <IconButton
              aria-label="Next page"
              onClick={() => onPageChange(Math.min(safeTotalPages, safePage + 1))}
              disabled={disableNextLast}
              size="small"
              sx={{ display: { xs: "inline-flex", sm: "none" } }}
            >
              <KeyboardArrowRightIcon />
            </IconButton>

            <Button
              variant="text"
              size="small"
              endIcon={<KeyboardArrowRightIcon />}
              onClick={() => onPageChange(Math.min(safeTotalPages, safePage + 1))}
              disabled={disableNextLast}
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              Next
            </Button>

            <IconButton
              aria-label="Last page"
              onClick={() => onPageChange(safeTotalPages)}
              disabled={disableNextLast}
              size="small"
            >
              <LastPageIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Paper>
      </Stack>
    </Paper>
  );
}
