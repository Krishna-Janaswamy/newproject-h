import { useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useTheme } from "@mui/material";
import PropTypes from "prop-types";
import { format } from "date-fns";
import IconButton from "@mui/material/IconButton";
import ShowEnquiry from "../modalpopup/modal-enquiry";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import BackspaceIcon from "@mui/icons-material/Backspace";
import Router from "next/router";

export const EnquiryList = ({
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
  const theme = useTheme();

  const getDetails = (id) => {
    let customerListResult = listCustomer.filter((list) => {
      if (list.id === id) {
        return list;
      }
    });
    return customerListResult[0];
  };

  // const handleDelete = (e, id) => {
  //   handledeleteaction(id);
  // };

  useEffect(() => {
    if (customers.length > 0) {
      setIsButton(false);
      setTimeout(() => {
        setIsLoading(true);

        setIsLoading(false);
      }, 2000);
      setListCustomer(customers);
    }
    if (customers.length === 0 && listProperty?.length > 0) {
      setTimeout(() => {
        setTextLoading(true);
        setIsButton(false);
        setTextDisplay(errorDisplayTex);
      }, 2000);
      setListCustomer(customers);
    }

    if (customers.length === 0 && (listProperty?.length === 0 || listProperty === undefined)) {
      setTimeout(() => {
        setTextLoading(true);
        setIsLoading(false);
        setIsButton(true);
        setTextDisplay(nopropertyText);
      }, 2000);
    }
  }, [customers, listProperty]);

  const formatDate = (newValue) => {
    const date = new Date(newValue);

    // const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Get the day, month, and year
    // const day = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Format the date string
    const formattedDate = ` ${dayOfMonth}-${month}-${year}`;

    return formattedDate;
  };
  
  const lastNameCheck = (lastName) => {
    if(!lastName){
      return ""
    } else {
      return lastName
    }
  }

  const toIndianCurrency = (budget) => {
    if(budget){
      const formattedPrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(budget);
      return formattedPrice;
    } else {
      return "-"
    }
  };

  return (
    <>
      <Card {...rest}>
        <PerfectScrollbar>
          {/* <Box sx={{ }}> */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                {/* <TableCell>Start Date</TableCell> */}
                <TableCell>Property Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>No of Guest</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Quotation</TableCell>
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
                          {customer.user.first_name + " " + lastNameCheck(customer.user.last_name)}
                        </Typography>
                      </Box>
                    </TableCell>
                    {/* <TableCell>{customer.start_date}</TableCell> */}
                    <TableCell>{customer.enquiry_status[0].user_property?.name}</TableCell>
                    <TableCell>{formatDate(customer?.date)}</TableCell>
                    <TableCell>{customer?.no_of_guest}</TableCell>
                    <TableCell>
                      {customer.enquiry_status[0].club_owner_status == "Initial" ? "Pending" : "Approved"}
                    </TableCell>
                    <TableCell>
                      {toIndianCurrency(customer.enquiry_status[0].club_owner_quotation)}
                    </TableCell>
                    {/* <TableCell>{customer.phone}</TableCell> */}
                    {/* <TableCell>{format(customer.createdAt, "dd/MM/yyyy")}</TableCell> */}
                    <TableCell>
                      <ShowEnquiry customerDetails={getDetails(customer.id)} />
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
                    {isButton && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          p: 3,
                        }}
                      ></Box>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
          {/* </Box> */}
        </PerfectScrollbar>
      </Card>
    </>
  );
};

EnquiryList.propTypes = {
  customers: PropTypes.array.isRequired,
};
