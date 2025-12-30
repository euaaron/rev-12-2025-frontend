import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { CircularProgress, Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { lazy, Suspense } from "react";

import { CarsProvider } from "./contexts/CarsContext";
import { appTheme } from "./theme";

const client = new ApolloClient({
  uri: "/graphql", // MSW intercepts this
  cache: new InMemoryCache(),
});

const Cars = lazy(() => import("./pages/Cars").then((m) => ({ default: m.Cars })));

export default function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <ApolloProvider client={client}>
        <Box component="main">
          <Suspense
            fallback={
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress />
              </Box>
            }
          >
            <CarsProvider>
              <Cars />
            </CarsProvider>
          </Suspense>
        </Box>
      </ApolloProvider>
    </ThemeProvider>
  );
}
