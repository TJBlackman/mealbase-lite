import type { AppProps } from "next/app";
import { Layout } from "../components/layout";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserContextProvider } from "@src/contexts/user";
import CssBaseline from "@mui/material/CssBaseline";
import { NotificationsContextProvider } from "@src/contexts/notifications";
import { NotificationRenderer } from "@src/components/notification-renderer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <NotificationsContextProvider>
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <NotificationRenderer />
        </NotificationsContextProvider>
      </UserContextProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
