import type { AppProps } from "next/app";
import { Layout } from "../components/layout";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserContextProvider } from "@src/contexts/user";
import CssBaseline from "@mui/material/CssBaseline";

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
