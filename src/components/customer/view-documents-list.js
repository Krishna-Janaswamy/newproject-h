import React, { useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useTheme } from "@mui/material";
import PropTypes from "prop-types";
import { format } from "date-fns";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  CircularProgress,
  TableRow,
  Typography,
  Button,
} from "@mui/material";
import { getInitials } from "../../utils/get-initials";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import Tooltip from "@mui/material/Tooltip";
import { height, styled } from "@mui/system";
import { grey } from '@mui/material/colors';

export const ViewDocumentsList = ({
  customers,
  handledeleteaction,
  galleryType,
  errorDisplayTex,
  listProperty,
  nopropertyText,
  videoFileType,
  ...rest
}) => {
  const [listCustomer, setListCustomer] = useState(customers);
  const [isLoading, setIsLoading] = useState(true);
  const [textDisplay, setTextDisplay] = useState(false);
  const urlImageUpdate = process.env.NEXT_PUBLIC_API_URL;
  const theme = useTheme();
 

const color = grey['500'];

  const StyledTableContainer = styled(TableContainer)`
    max-height: 400px;
    overflow: auto;
  `;

  const StyledTableCell = styled(TableCell)`
    background-color: #f5f5f5;
    position: sticky;
    top: 0;
    z-index: 5;
  `;

  const handleFile = (fileFormate) => {
    const file = fileFormate;
    return file
  };

  // useEffect(() => {
  //   setIsLoading()
  // }, [])

  useEffect(() => {
    if (customers?.length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setTextDisplay('No Documents Found');
        setListCustomer(customers);
      }, 2000);
    }

    if (customers?.length !== 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setListCustomer(customers);
      }, 2000);
    }
  }, [customers]);


  const handleClick = (e, link) => {
    e.preventDefault();
    window.open(link);
  };
  return (
    <div style={{overFlow: 'auto!important'}}>
      <Table sx={{ml: -1, overflow: 'auto!important'}}>
        {listCustomer && listCustomer.length > 0 && !isLoading ? (
          <TableBody sx={{width: 800}}>
            {listCustomer.map((customer) => (
              <TableRow sx={{display: 'flex', justifyContent:"space-between"}} key={`${customer.id}-${customer.title}`}>
                <TableCell>
                  <Button
                    onClick={(e) => handleClick(e, `${urlImageUpdate}${customer?.file}`)}
                    variant="text"
                    sx={{color: 'black'}}
                  >
                     {customer.title}
                  </Button>
                </TableCell>
                <TableCell>
                  <a href={`${urlImageUpdate}${customer?.file}`} download>
                    <DownloadOutlinedIcon
                      sx={{ color: color, cursor: "pointer" }}
                      fontSize="medium"
                    />
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody sx={{width: 800}}>
            <TableRow>
              <TableCell colSpan={5}>
                {isLoading && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      pt: 6,
                      pb: 6,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
                  {textDisplay && (
                      <>
                        <Typography align="center" color="textPrimary" variant="body1">
                          {textDisplay}
                        </Typography>
                      </>
                    )}
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </div>
  );
};

ViewDocumentsList.propTypes = {
  customers: PropTypes.array.isRequired,
};

ViewDocumentsList.propTypes = {};
