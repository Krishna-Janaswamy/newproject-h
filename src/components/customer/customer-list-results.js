import { useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useTheme } from "@mui/material";
import PropTypes from "prop-types";
import { format } from "date-fns";
import IconButton from "@mui/material/IconButton";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  CircularProgress,
  TableRow,
  Typography,
  Button,
} from "@mui/material";
import { getInitials } from "../../utils/get-initials";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import Router from "next/router";
import Tooltip from "@mui/material/Tooltip";
import DescriptionIcon from "@mui/icons-material/Description";
import { CustomizedDialogs } from "../modalpopup/modal-pop-up";
import { formateInitialState } from "../../utils/method";

export const CustomerListResults = ({
  customers,
  handledeleteaction,
  errorDisplayTex,
  ...rest
}) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [listCustomer, setListCustomer] = useState(formateInitialState(customers));
  const [isLoading, setIsLoading] = useState(true);
  const [textLoading, setTextLoading] = useState(false);
  const matches = useMediaQuery("(max-width:600px)");
  const theme = useTheme();

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleEdit = (e, Id) => {
    Router.push(
      {
        pathname: `/property/${Id}`,
        query: {
          name: "",
        },
      },
      `/property/${Id}`
    ).catch(console.error);
  };

  const handleRemarks = (index, customer) => {
    const value = [...listCustomer];
    value[index].isSelected = !value[index]?.isSelected;
    setListCustomer(value);
  };

  const bodyComp = (data) => {
    return (
      <Box sx={{ textAlign: "left", ml: '10px' }}>
        <Typography variant="subtitle1">{data?.property_verified_remark}</Typography>
      </Box>
    );
  };

  const handleDelete = (e, id) => {
    handledeleteaction(id);
  };

  useEffect(() => {
    if (customers.length) {
      setIsLoading(true);
      setListCustomer(customers);
      setIsLoading(false);
    }
    if (customers.length === 0) {
      setTimeout(() => {
        setTextLoading(true);
        setIsLoading(false);
      }, 2000);
      setListCustomer(customers);
    }
  }, [customers]);

  return (
    <>
      <Card sx={{ overflow: matches ? "scroll" : "hidden" }}>
        <PerfectScrollbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell sx={{ pl: "2rem" }}>status</TableCell>
                <TableCell sx={{}}>Remarks</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            {listCustomer && listCustomer.length ? (
              <TableBody>
                {listCustomer.map((customer, index) => (
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
                          {customer.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        color={
                          customer?.document_verified
                            ? "success"
                            : customer?.documents_verified_by?.email
                            ? "error"
                            : "primary"
                        }
                      >
                        {customer?.document_verified
                          ? "Approved"
                          : customer?.documents_verified_by?.email
                          ? "Not Approved"
                          : "Pending"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Remarks">
                        <IconButton
                          aria-label="remark"
                          sx={{
                            "&:focus": {
                              transform: "scale(1.2)",
                            },
                          }}
                          disabled={!customer?.property_verified_remark}
                          onClick={() => handleRemarks(index, customer)}
                        >
                          <DescriptionIcon
                            color={customer?.property_verified_remark ? "primary" : "disabled"}
                            fontSize="small"
                          />
                        </IconButton>
                      </Tooltip>
                      {customer?.isSelected && (
                        <CustomizedDialogs
                          isOpen={customer?.isSelected}
                          setIsOpen={() => handleRemarks(index)}
                          renderComponent={() => bodyComp(customer)}
                          modalTitle={"Remarks"}
                          customstyle={{ width: "600px", height: "150px", overflow: "auto" }}
                          // divider
                          // downloadAll={"Download All"}
                          // keyValue={`${customer.id}-${index}`}
                          // downloadAllButtonStatus={customer?.documents?.length}
                          // handleDownloadAll={() => handleDownloadAll(customer)}
                        />
                      )}
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
                          disabled
                          onClick={(e) => handleEdit(e, customer?.id)}
                        >
                          <EditOutlinedIcon color="disabled" fontSize="small" />
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
                          disabled
                          onClick={(e) => handleDelete(e, customer?.id)}
                        >
                          <DeleteOutlineOutlinedIcon
                            sx={{ color: 'disabled' }}
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
                      <Typography align="center" color="textPrimary" variant="body1">
                        {errorDisplayTex}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </PerfectScrollbar>
        {/* <TablePagination
        component="div"
        count={customers.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      /> */}
      </Card>
    </>
  );
};

CustomerListResults.propTypes = {
  customers: PropTypes.array.isRequired,
};
