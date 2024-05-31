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
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Router from "next/router";
import Tooltip from "@mui/material/Tooltip";

export const DealsList = ({
  customers,
  handledeleteaction,
  errorDisplayTex,
  listProperty,
  nopropertyText,
  ...rest
}) => {
  const [listCustomer, setListCustomer] = useState(customers);
  const [isLoading, setIsLoading] = useState(true);
  const [textLoading, setTextLoading] = useState(false);
  const [isButton, setIsButton] = useState(false);
  const [textDisplay, setTextDisplay] = useState("");
  const matches = useMediaQuery("(max-width:600px)");
  const theme = useTheme();

  const handleEdit = (e, Id) => {
    Router.push(
      {
        pathname: `/deals/${Id}`,
        query: {
          name: "deals",
        },
      },
      `/deals/${Id}`
    ).catch(console.error);
  };

  const handleDelete = (e, id) => {
    handledeleteaction(id);
  };

  useEffect(() => {
    if (customers.length > 0) {
      setIsButton(false);
      setTimeout(() => {
        setIsLoading(true);

        setIsLoading(false);
      }, 2000);
      setListCustomer(customers);
    }
    if (customers.length === 0 && listProperty.length > 0) {
      setTimeout(() => {
        setTextLoading(true);
        setIsButton(false);
        setTextDisplay(errorDisplayTex);
      }, 2000);
      setListCustomer(customers);
    }

    if (customers.length === 0 && listProperty.length === 0) {
      setTimeout(() => {
        setTextLoading(true);
        setIsLoading(false);
        setIsButton(true);
        setTextDisplay(errorDisplayTex);
      }, 2000);
    }
  }, [customers, listProperty]);

  const formateData = (newValue) => {
    const date = new Date(newValue);
    const dateMDY = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return dateMDY;
  };

  return (
    <>
      <Card sx={{ overflow: matches ? "scroll" : "hidden" }}>
        <PerfectScrollbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                {/* <TableCell>Start Date</TableCell> */}
                <TableCell>Property Name</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            {listCustomer && listCustomer.length > 0 ? (
              <TableBody>
                {listCustomer.map((customer) => (
                  <TableRow hover key={customer.id}>
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        {/* <Avatar src={customer.avatarUrl} sx={{ mr: 2 }}>
                        {getInitials(customer.name)}
                      </Avatar> */}
                        <Typography color="textPrimary" variant="body1">
                          {customer.deal_name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{customer.property?.name}</TableCell>
                    <TableCell>{formateData(customer?.start_date)}</TableCell>
                    <TableCell>{formateData(customer?.end_date)}</TableCell>
                    <TableCell>
                      {" "}
                      <Button color={customer?.isActive ? "success" : "error"}>
                        {customer.isActive ? "Active" : "InActive"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton
                          aria-label="edit"
                          sx={{
                            "&:focus": {
                              transform: "scale(1.2)",
                            },
                          }}
                          onClick={(e) => handleEdit(e, customer?.id)}
                        >
                          <EditOutlinedIcon color="success" fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          aria-label="delete"
                          sx={{
                            "&:focus": {
                              transform: "scale(1.2)",
                            },
                          }}
                          onClick={(e) => handleDelete(e, customer?.id)}
                        >
                          <DeleteOutlineOutlinedIcon
                            sx={{ color: theme.palette.error.light }}
                            fontSize="small"
                          />
                        </IconButton>
                      </Tooltip>
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
                          p: 3,
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    )}
                    {textLoading && (
                      <>
                        <Typography align="center" color="textPrimary" variant="body1">
                          {textDisplay}
                        </Typography>
                      </>
                    )}
                    {isButton && textDisplay &&(
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          p: 3,
                        }}
                      >
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() => Router.push("/flashdeal/createflashdeal")}
                          sx={{
                            "&:focus": {
                              transform: "scale(0.9)",
                            },
                            display: listProperty.length > 0 ? "none" : "block",
                          }}
                          disabled={listProperty.length > 0}
                        >
                          Create Property
                        </Button>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </PerfectScrollbar>
      </Card>
    </>
  );
};

DealsList.propTypes = {
  customers: PropTypes.array.isRequired,
};
