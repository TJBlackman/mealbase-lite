import type { AppProps } from "next/app";
import { Layout } from "../components/layout";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { UserContextProvider, useUserContext } from "@src/contexts/user";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect } from "react";
import { networkRequest } from "@src/utils/network-request";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider>
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </UserContextProvider>
  );
}

export default MyApp;
