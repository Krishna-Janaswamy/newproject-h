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
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/system";

export const FileList = ({
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
  const urlImageUpdate = process.env.NEXT_PUBLIC_API_URL;
  const theme = useTheme();

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

  const handleDelete = (e, id) => {
    e.preventDefault();
    handledeleteaction(id, galleryType);
  };

  // useEffect(() => {
  //   setIsLoading()
  // }, [])

  useEffect(() => {
    if (customers?.length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        // setIsEmpty(true);
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
  }, [customers]);


  const handleClick = (e, link) => {
    e.preventDefault();
    window.open(link);
  };
  return (
    <>
      <Table sx={{ml: -1}}>
        {listCustomer && listCustomer.length > 0 && !isLoading ? (
          <TableBody>
            {listCustomer.map((customer) => (
              <TableRow key={`${customer.id}-${customer.title}`}>
                <TableCell>
                  <Button
                    onClick={(e) => handleClick(e, `${urlImageUpdate}${customer?.file}`)}
                    variant="text"
                  >
                     {customer.title}
                  </Button>
                </TableCell>
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
                    <CloseOutlinedIcon
                      sx={{ color: theme.palette.error.light, cursor: "pointer" }}
                      fontSize="medium"
                    />
                  </IconButton>
                </TableCell>
              </TableRow>
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
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </>
  );
};

FileList.propTypes = {
  customers: PropTypes.array.isRequired,
};

FileList.propTypes = {};
