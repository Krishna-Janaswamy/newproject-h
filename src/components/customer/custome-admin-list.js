import React, { useEffect, useState, useCallback, useRef } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Button, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import { DotsThreeOutline } from "phosphor-react";
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
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { formateInitialState } from "../../utils/method";
import { CustomizedDialogs } from "../modalpopup/modal-pop-up";
import { ViewDocumentsList } from "./view-documents-list";
import { testZip } from "../../utils/zipFile";
import { MenuFloat } from "../menu-float";
import { positions } from "@mui/system";

export const CustomeAdminList = ({
  customers,
  errorDisplayTex,
  handleApproveState,
  handleRejectState,
  ...rest
}) => {
  const urlImageUpdate = process.env.NEXT_PUBLIC_API_URL;
  const [listCustomer, setListCustomer] = useState(formateInitialState(customers));
  const [isLoading, setIsLoading] = useState(true);
  const [textLoading, setTextLoading] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const matches = useMediaQuery("(max-width:600px)");
  const theme = useTheme();
  const settingsRef = useRef(null);

  const handleEdit = (index) => {
    const value = [...listCustomer];
    value[index].isSelected = !value[index]?.isSelected;
    setListCustomer(value);
  };

  const handleDownloadAll = useCallback((customer) => {
    const result =
      customer?.documents && customer?.documents.length
        ? customer?.documents.map((item) => {
            let res = [];
            item.fileUrl = `${urlImageUpdate}${item?.file}`;
            res.push(item?.fileUrl);

            return res[0];
          })
        : [];
    testZip(result);
  }, []);

  const bodyComponent = (documents) => {
    const newArray = [
      ...documents?.documents,
      ...documents?.social_data?.exterior_gallery,
      ...documents?.social_data?.interior_gallery,
      ...documents?.social_data?.menu_place,
      ...documents?.social_data?.video_file,
    ];
    return <ViewDocumentsList customers={newArray} />;
  };

  const formateData = (newValue) => {
    const date = new Date(newValue);
    const dateMDY = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return dateMDY;
  };

  const handleOpen = (index) => {
    const value = [...listCustomer];
    value[index].isEditDots = !value[index]?.isEditDots;
    setListCustomer(value);
  };

  const handleCloseModal = (index) => {
    const value = [...listCustomer];
    value[index].isEditDots = false;
    setListCustomer(value);
  };

  useEffect(() => {
    if (customers.length) {
      setIsLoading(true);
      setListCustomer(formateInitialState(customers));
      setIsLoading(false);
    }
    if (customers.length === 0) {
      setTimeout(() => {
        setTextLoading(true);
        setIsLoading(false);
      }, 2000);
      setListCustomer(formateInitialState(customers));
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
                <TableCell>Created Date</TableCell>
                <TableCell sx={{ pl: "2rem" }}>status</TableCell>
                <TableCell sx={{ pl: "2rem" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            {listCustomer && listCustomer.length ? (
              <TableBody>
                {listCustomer.map((customer, index) => (
                  <TableRow hover key={`${customer.id}-list-${index}`}>
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Typography color="textPrimary" variant="body1">
                          {customer.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{customer?.email}</TableCell>
                    <TableCell>{formateData(customer?.created_date)}</TableCell>
                    <TableCell>
                      <Button
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
                          ? "Rejected"
                          : "Pending"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {
                        <MenuFloat
                          anchorEl={settingsRef.current}
                          handleEdit={() => handleEdit(index)}
                          handleApproveState={() =>
                            handleApproveState(customer?.id, customer?.user, true)
                          }
                          handleRejectState={() =>
                            handleRejectState(customer?.id, customer?.user, false)
                          }
                          customer={customer}

                          // open={customer?.isEditDots}
                          // onClose={() => handleCloseModal(index)}
                          // heightIndex={index}
                        />
                      }
                      {customer?.isSelected && (
                        <CustomizedDialogs
                          isOpen={customer?.isSelected}
                          setIsOpen={() => handleEdit(index)}
                          renderComponent={() => bodyComponent(customer)}
                          modalTitle={"Documents"}
                          customstyle={{ width: "600px", height: "300px", overflow: "auto" }}
                          divider
                          downloadAll={"Download All"}
                          keyValue={`${customer.id}-${index}`}
                          downloadAllButtonStatus={customer?.documents?.length}
                          handleDownloadAll={() => handleDownloadAll(customer)}
                        />
                      )}
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
      </Card>
    </>
  );
};

CustomeAdminList.propTypes = {
  customers: PropTypes.array.isRequired,
};
