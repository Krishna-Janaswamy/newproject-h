import { useContext } from "react";
import Router from "next/router";
import PropTypes from "prop-types";
import { Box, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import { AuthContext } from "../contexts/auth-context";
import { removeAuth, getAuth, removeUserMobile, removeProfileAuth, removeRole } from "../service/identity.service";

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const authContext = useContext(AuthContext);

  const handleSignOut = async () => {
    onClose?.();
    const authSkipped = getAuth();
    if (authSkipped) {
      // Cleanup the skip auth state
      authContext.signOut();
      removeAuth();
      removeUserMobile();
      removeProfileAuth();
      removeRole();
      sessionStorage.removeItem("accessToken");

      // Redirect to sign-in page
      Router.push("/sign-in").catch(console.error);
      return;
    }

    try {
      // This can be call inside AuthProvider component, but we do it here for simplicity

      // Update Auth Context state
      authContext.signOut();
      removeAuth();
      removeUserMobile();
      removeProfileAuth();
      removeRole();
      sessionStorage.removeItem("accessToken");

      // Redirect to sign-in page
      Router.push("/sign-in").catch(console.error);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfile = () => {
    Router.push("/profile").catch(console.error);
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: { width: "300px" },
      }}
      {...other}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Typography variant="overline">Account</Typography>
        <Typography color="text.secondary" variant="body2">
          {authContext?.profile?.first_name}
        </Typography>
      </Box>
      <MenuList
        disablePadding
        sx={{
          "& > *": {
            "&:first-of-type": {
              borderTopColor: "divider",
              borderTopStyle: "solid",
              borderTopWidth: "1px",
            },
            padding: "12px 16px",
          },
        }}
      >
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
