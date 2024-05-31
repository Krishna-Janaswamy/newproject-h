import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
} from "@mui/material";
import { Download as DownloadIcon } from "../../icons/download";
import { Search as SearchIcon } from "../../icons/search";
import { Upload as UploadIcon } from "../../icons/upload";
import { CustomizedDialogs } from "../../components/modalpopup/modal-pop-up";
import { BasicCard } from "../../components/basic-card/basic-card";
import PropTypes from "prop-types";
import Router from "next/router";
import { border, color } from "@mui/system";

const HelloWorld = () => {
  const cards = ["primary", "secondary", "third"];
  return <BasicCard cardNames={cards} />;
};

export const ProductListToolbar = (props) => {
  const { title, buttontitle, navlink, isdisable } = props;
  const [open, setOpen] = React.useState(false);
  const Color_radial1 = "0xFF732E6E";
  const Color_radial2 = "0xFF1D2773";

  return (
    <Box {...props}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h4">
          {title}
        </Typography>
        {buttontitle && (
          <Box sx={{ m: 1 }}>
            <Button
              color="primary"
              // variant="contained"

              onClick={() => Router.push(navlink)}
              sx={{
                "&:focus": {
                  outline: "1px solid black",
                  transform: "scale(0.9)",
                },
              }}
              disabled={isdisable === 1 ? true : false}
            >
              {buttontitle}
            </Button>
          </Box>
        )}
      </Box>
      {open && <CustomizedDialogs isOpen={open} setIsOpen={setOpen} renderComponent={HelloWorld} />}
    </Box>
  );
};

ProductListToolbar.defaultProps = {
  isdisable: 0,
};

ProductListToolbar.propTypes = {
  isdisable: PropTypes.number,
};
