import { useEffect, useState } from "react";
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/system";

export const ImageList = ({
  customers,
  handledeleteaction,
  galleryType,
  errorDisplayTex,
  listProperty,
  nopropertyText,
  videoFileType,
  typeError,
  sizeError,
  ...rest
}) => {
  const [listCustomer, setListCustomer] = useState(customers);
  const [isLoading, setIsLoading] = useState(true);
  // const [isEmpty, setIsEmpty] = useState(false);
  const urlImageUpdate = process.env.NEXT_PUBLIC_API_URL;
  const theme = useTheme();

  const StyledTableContainer = styled(TableContainer)`
    max-height: 400px;
    overflow: scroll;
  `;

  const StyledTableCell = styled(TableCell)`
    background-color: #f5f5f5;
    position: sticky;
    top: 0;
    z-index: 5;
  `;

  const handleDelete = (e, id) => {
    e.preventDefault();
    handledeleteaction(id, galleryType);
  };

  // useEffect(() => {
  //   setIsLoading()
  // }, [])

  useEffect(() => {
    if (customers !== undefined || customers !== null) {
      if (customers?.length === 0) {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
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
    }
    if (customers === undefined || customers === null) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setListCustomer([]);
      }, 2000);
    }
  }, [customers]);

  const formateData = (newValue) => {
    const date = new Date(newValue);
    const dateMDY = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return dateMDY;
  };

  const handleClick = (e, link) => {
    e.preventDefault();
    window.open(link);
  };

  return (
    <>
      {typeError && (
        <Typography sx={{ color: theme.palette.error.light, mb: 3 }}>
         {typeError}
        </Typography>
      )}
      {sizeError && (
        <Typography sx={{  color: theme.palette.error.light, mb: 3 }}>
          {sizeError}
        </Typography>
      )}
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Created Date</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          {listCustomer && listCustomer.length > 0 && !isLoading ? (
            <TableBody>
              {listCustomer.map((customer) => (
                <>
                  <TableRow hover key={`${customer.id}-${customer.title}`}>
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        {videoFileType ? (
                          <video
                            alt={customer.title}
                            src={`${urlImageUpdate}${customer?.file}`}
                            srcSet={`${urlImageUpdate}${customer?.file}`}
                            // sx={{ width: 2, height: 2 }}
                            width="200"
                            height="150"
                            controls
                            onClick={(e) => handleClick(e, `${urlImageUpdate}${customer?.file}`)}
                          />
                        ) : (
                          <Avatar
                            alt={customer.title}
                            src={`${urlImageUpdate}${customer?.file}`}
                            srcSet={`${urlImageUpdate}${customer?.file}`}
                            sx={{ width: 64, height: 64 }}
                            variant="square"
                            onClick={(e) => handleClick(e, `${urlImageUpdate}${customer?.file}`)}
                          />
                        )}

                        {/* <Typography color="textPrimary" variant="body1">
      {customer.title}
    </Typography> */}
                      </Box>
                    </TableCell>
                    <TableCell>{formateData(customer?.created_date)}</TableCell>
                    <TableCell>
                      {customer.status ? (
                        <CheckCircleIcon
                          sx={{ color: theme.palette.success.light }}
                          fontSize="small"
                          onClick={(e) => handleDelete(e, customer?.id)}
                        />
                      ) : (
                        <IconButton
                          aria-label="icon error"
                          sx={{
                            "&:focus": {
                              transform: "scale(1.2)",
                            },
                          }}
                          onClick={(e) => handleDelete(e, customer?.id)}
                        >
                          <CancelRoundedIcon
                            sx={{ color: theme.palette.error.light }}
                            fontSize="medium"
                          />
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleDelete(e, customer?.id)}>
                        <DeleteOutlineRoundedIcon
                          sx={{ color: theme.palette.error.light, cursor: "pointer" }}
                          fontSize="medium"
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          ) : (
            <TableBody>
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
                  {!isLoading &&
                    (customers?.length === 0 || customers === undefined || customers === null) && (
                      <Typography sx={{ textAlign: "center", pt: 6, pb: 6 }}>
                        {" "}
                        Your Gallery is Empty{" "}
                      </Typography>
                    )}
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </StyledTableContainer>
    </>
  );
};

ImageList.propTypes = {
  customers: PropTypes.array.isRequired,
};

ImageList.propTypes = {};
