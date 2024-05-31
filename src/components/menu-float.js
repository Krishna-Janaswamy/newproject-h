import * as React from "react";
import Button from "@mui/material/Button";
import { Box, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import { DotsThreeOutline } from "phosphor-react";

export const MenuFloat = (props) => {
  const { handleEdit, handleApproveState, handleRejectState, customer } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    handleClose();
    handleEdit();
  };

  const handleReject = () => {
    handleRejectState();
    handleClose();
  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Button aria-describedby={id} onClick={handleClick}>
        <DotsThreeOutline size={14} color="#5E718D" weight="bold" />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <MenuList>
          <MenuItem onClick={handleView}>View Documents</MenuItem>
          <MenuItem
            onClick={handleApproveState}
            disabled={
              customer?.document_verified
                ? true
                : customer?.documents_verified_by?.email
                ? false
                : false
            }
          >
            Approve
          </MenuItem>
          <MenuItem
            onClick={handleReject}
            // disabled={
            //   customer?.document_verified
            //     ? true
            //     : customer?.documents_verified_by?.email
            //     ? true
            //     : false
            // }
          >
            Reject
          </MenuItem>
        </MenuList>
      </Popover>
    </div>
  );
};
