import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { amber, blue, green } from "@mui/material/colors";
import { styled } from "@mui/material/styles";

import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import Typography from "@mui/material/Typography";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";

import { hideMessage } from "../context/features/message/messageSlice";

const StyledSnackbar = styled(Snackbar)(({ theme, variant }) => ({
  "& .Notification-content": {
    ...(variant === "success" && {
      backgroundColor: green[600],
      color: "#FFFFFF",
    }),

    ...(variant === "error" && {
      backgroundColor: theme.palette.error.dark,
      color: theme.palette.getContrastText(theme.palette.error.dark),
    }),

    ...(variant === "info" && {
      backgroundColor: blue[600],
      color: "#FFFFFF",
    }),

    ...(variant === "warning" && {
      backgroundColor: amber[600],
      color: "#FFFFFF",
    }),
  },
}));

const variantIcon = {
  success: <CheckCircleIcon sx={{ marginBottom: "16px" }} />,
  warning: <WarningIcon sx={{ marginBottom: "16px" }} />,
  error: <ErrorIcon sx={{ marginBottom: "16px" }} />,
  info: <InfoIcon sx={{ marginBottom: "16px" }} />,
};

function Notification() {
  const dispatch = useDispatch();

  const state = useSelector((state) => state.message.state);
  const options = useSelector((state) => state.message.options);

  return (
    <StyledSnackbar
      {...options}
      open={state}
      onClose={() => dispatch(hideMessage())}
      ContentProps={{
        variant: "body2",
        headlineMapping: {
          body1: "div",
          body2: "div",
        },
      }}
    >
      <SnackbarContent
        className="Notification-content"
        message={
          <div className="flex items-center">
            {variantIcon[options.variant] && (
              <Icon sx={{ color: "inherit" }}>
                {variantIcon[options.variant]}
              </Icon>
            )}
            <Typography sx={{ marginLeft: "1rem", marginRight: "1rem" }}>
              {options.message}
            </Typography>
          </div>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            sx={{ color: "inherit" }}
            onClick={() => dispatch(hideMessage())}
            size="large"
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </StyledSnackbar>
  );
}

export default memo(Notification);