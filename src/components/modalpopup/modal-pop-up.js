import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Divider } from "@mui/material";
// import {Divider} from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 3 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            padding: 2,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export const CustomizedDialogs = (props) => {
  const {
    modalTitle,
    renderComponent,
    isOpen,
    setIsOpen,
    confirmtext,
    canceltext,
    handleconfirmation,
    footerComponent,
    customstyle,
    stylesUpdate,
    divider,
    downloadAll,
    handleDownloadAll,
    downloadAllButtonStatus,
    keyValue,
  } = props;
  const [open, setOpen] = React.useState(isOpen);

  const handleClose = () => {
    // handleClosePopUpCallBack(isExteriorFlag);
    setOpen(!open);
    setIsOpen(false);
  };

  const handleCkick = () => {
    handleconfirmation();

    setOpen(!open);
    setIsOpen(false);
  };

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open dialog
      </Button> */}
      {open && (
        <BootstrapDialog
          onClose={() => setIsOpen(false)}
          aria-labelledby="customized-dialog-title"
          open={open}
          maxWidth="100%"
          hideBackdrop
          key={keyValue}
        >
          {modalTitle && (
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
              {modalTitle}
            </BootstrapDialogTitle>
          )}
          {(divider && <Divider />)}
          {renderComponent && (
            <DialogContent
              sx={{
                width: customstyle?.width,
                p: 0,
                m: 0,
                height: customstyle?.height,
                overflow: customstyle?.overflow ? "auto" : "hidden",
                ...stylesUpdate
              }}
            >
              {renderComponent()}
            </DialogContent>
          )}
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 0,
            }}
          >
            {canceltext && <Button onClick={handleClose}>{canceltext}</Button>}
            {downloadAll && <Button sx={{ml: 1}} disabled={!downloadAllButtonStatus} onClick={handleDownloadAll}>{downloadAll}</Button>}
            {confirmtext && (
              <Button autoFocus onClick={() => handleCkick()}>
                {confirmtext}
              </Button>
            )}
            {footerComponent && <DialogContent>{footerComponent()}</DialogContent>}
          </DialogActions>
        </BootstrapDialog>
      )}
    </div>
  );
};
