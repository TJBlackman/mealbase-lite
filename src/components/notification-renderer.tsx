import {
  Alert,
  Grid,
  AlertTitle,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { useNotificationsContext } from "@src/contexts/notifications";
import CloseIcon from "@mui/icons-material/Close";
import { Notification } from "@src/contexts/notifications";
import { useEffect } from "react";

export function NotificationRenderer() {
  const notificationsContext = useNotificationsContext();

  return (
    <Grid
      container
      spacing={1}
      direction="column"
      justifyContent="flex-end"
      sx={{
        height: "100vh",
        width: "100vw",
        overflow: "visible",
        position: "fixed",
        top: "0px",
        left: "0px",
        zIndex: 999,
        pointerEvents: "none",
        padding: [0, 1, 2],
      }}
    >
      {notificationsContext.notifications.map((item) => (
        <Grid item key={item.id}>
          <Toast notification={item} dismiss={notificationsContext.dismiss} />
        </Grid>
      ))}
    </Grid>
  );
}

function Toast(props: {
  notification: Notification;
  dismiss: (id: Notification["id"]) => void;
}) {
  // on mount, set timeout to auto-dismiss notification
  useEffect(() => {
    let timeout = setTimeout(() => {
      props.dismiss(props.notification.id);
    }, 4000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Alert
      severity={props.notification.severity}
      key={props.notification.id}
      elevation={5}
      sx={{ width: ["100%", "400px", "500px"], pointerEvents: "all" }}
      action={
        <IconButton onClick={() => props.dismiss(props.notification.id)}>
          <CloseIcon />
        </IconButton>
      }
    >
      {/* <AlertTitle>{props.notification.title}</AlertTitle> */}
      <Box>
        <Typography>{props.notification.message}</Typography>
        <Typography variant="body2">
          {props.notification.date.toLocaleTimeString()}
        </Typography>
      </Box>
    </Alert>
  );
}
