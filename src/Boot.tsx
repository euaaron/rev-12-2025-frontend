import { Box, CircularProgress, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";

import App from "./App";
import { appTheme } from "./theme";


export function Boot() {
  const useMsw =
    typeof globalThis.__BOOT_USE_MSW__ === "boolean"
      ? globalThis.__BOOT_USE_MSW__
      : import.meta.env.DEV || import.meta.env.VITE_USE_MSW === "true";
  const [ready, setReady] = useState(() => !useMsw);

  useEffect(() => {
    if (!useMsw) return;

    let cancelled = false;

    (async () => {
      const { worker } = await import("./mocks/browser");
      await worker.start();
      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [useMsw]);

  if (ready) return <App />;

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <CircularProgress aria-label="Loading" />
      </Box>
    </ThemeProvider>
  );
}
