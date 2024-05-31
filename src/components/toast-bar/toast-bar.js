import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Slide from '@mui/material/Slide';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const ToastBar = ({ isOpen, setIsOpen, displayMessage, type, transition }) => {
  const [open, setOpen] = React.useState(isOpen);
 

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      setIsOpen(false);
      return;
    }

    setOpen(false);
    setIsOpen(false);
  };

  

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        // anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={transition}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
          {displayMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};
