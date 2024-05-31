import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Box, Container, Grid, Pagination, Typography } from "@mui/material";
import { products } from "../../__mocks__/products";
import { ProductListToolbar } from "../../components/product/product-list-toolbar";
import { ProductCard } from "../../components/product/product-card";
import { DashboardLayout } from "../../components/dashboard-layout";
import { CustomerListResults } from "../../components/customer/customer-list-results";
import { customers } from "../../__mocks__/customers";
import { CustomizedDialogs } from "../../components/modalpopup/modal-pop-up";
import { deletePropertyId } from "../../service/property.services";
import {getAddProperty} from '../../service/account.service';
import { ToastBar } from "../../components/toast-bar/toast-bar";
import { FilterComponent } from "../../components/filter-component/filter-component";
import propertyData from '../../data/property.json';

const Page = () => {
  const [listProperty, setListProperty] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("");

  const [errorDisplayText, setErrorDisplayText] = useState("Welcome, Create your first property here");
  const [selectedProperty, setSelectedProperty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [fullProperty, setFullProperty] = useState([]);
  const [uniqueEmail, setUniqueEmail] = useState([]);

  const [lastFilterPropertyStatus, setLastFilterPropertyStatus] = useState("all");
  const [lastFilterByStatus, setLastFilterByStatus] = useState("all");

  const optionLabels = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "approved",
      label: "Approved",
    },
    {
      value: "pending",
      label: "Pending",
    },
    {
      value: "rejected",
      label: "Rejected",
    },
  ];

  const bindAddProperty = async () => {
    // const data = await getAddProperty();
   const data = await propertyData;
    setListProperty(data?.results);
    setFullProperty(data?.results);
    let value = [];
    data.results &&
      data?.results.map((content) => {
        value.push(content?.email);
      });
    const updatedValue = [...new Set(value)];

    setUniqueEmail(updatedValue);
  };

  const bindPrpertyApproveStatus = async () => {
    // const data = await getAddProperty();
    const data = await propertyData;
  
    setFullProperty(data?.results);
    filterBoth(lastFilterPropertyStatus, lastFilterByStatus, data?.results);
  };

  const handleDeleteAction = async (id) => {
    setOpen(true);
    setSelectedId(id);
  };
  const bodyComp = () => {
    return (
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="subtitle1">Are you sure to Delete</Typography>
        <Typography sx={{ fontSize: 14, mt: "8px" }} gutterBottom>
          Your property data will be lost
        </Typography>
      </Box>
    );
  };

  const handleconfirmation = async () => {
    const data = await deletePropertyId(selectedId);
    if (data?.status === true) {
      setOpenToast(true);
      setMessageType("success");
      setMessageText(data?.Message);
    } else {
      setOpenToast(true);
      setMessageType("error");
      setMessageText("Oops!!! Something went wrong, please check again");
    }
    bindPrpertyApproveStatus();
  };

  const filterByPropertyName = (filterValue) => {
    setLastFilterPropertyStatus(filterValue);
    const values = [...fullProperty];

    // when filter value and selected status are all
    if (filterValue == "all" && selectedStatus === "all") {
      setListProperty([...values]);
      setSelectedProperty(filterValue);
    } else if (filterValue == "" && selectedStatus === "all") {
      setListProperty([...values]);
    }
    // when filter value  property changes and selected status is all
    else if (filterValue != "all" && selectedStatus === "all") {
      const data = values.filter((item) => {
        return item?.email == filterValue;
      });
      if (data.length === 0) {
        setErrorDisplayText("No Party exists for this Property");
      } else {
        setErrorDisplayText("");
      }
      setSelectedProperty(filterValue);
      setListProperty([...data]);
    }
    // when filter value  property changes and selected status is not all
    else if (filterValue != "all" && selectedStatus !== "all") {
      const data = values.filter((customer) => {
        let status = "";
        status = customer?.document_verified
          ? "approved"
          : customer?.documents_verified_by?.email
          ? "rejected"
          : "pending";

        return customer?.email == filterValue && status === selectedStatus;
      });
      if (data.length === 0) {
        setErrorDisplayText("No Party exists for this Property");
      } else {
        setErrorDisplayText("");
      }
      setSelectedProperty(filterValue);
      setListProperty([...data]);
    }
    // when filter value property changed to all and when selected status is not all
    else if (filterValue == "all" && selectedStatus !== "all") {
      const data = values.filter((customer) => {
        let status = "";
        status = customer?.document_verified
          ? "approved"
          : customer?.documents_verified_by?.email
          ? "rejected"
          : "pending";

        return status === selectedStatus;
      });
      if (data.length === 0) {
        setErrorDisplayText("No Party exists for this Property");
      } else {
        setErrorDisplayText("");
      }
      setSelectedProperty(filterValue);
      setListProperty([...data]);
    }
  };

  // filter By status filter
  const filterByStatus = (filterStatus) => {
    setLastFilterByStatus(filterStatus);
    const values = [...fullProperty];

    // when filter status is all and selected property is all
    if (filterStatus === "all" && selectedProperty == "all") {
      setListProperty([...fullProperty]);
      setSelectedStatus(filterStatus);
    }
    // when filter status is not all and selected property is all
    else if (filterStatus !== "all" && selectedProperty == "all") {
      const data = values.filter((customer) => {
        const status = customer?.document_verified
          ? "approved"
          : customer?.documents_verified_by?.email
          ? "rejected"
          : "pending";
        return status === filterStatus;
      });
      if (data.length === 0) {
        setErrorDisplayText("No Party exists for this Property");
      } else {
        setErrorDisplayText("");
      }
      setSelectedStatus(filterStatus);
      setListProperty([...data]);
    }
    // when filter status is not all and selected property is not all
    else if (filterStatus !== "all" && selectedProperty != "all") {
      const data = values.filter((customer) => {
        const status = customer?.document_verified
          ? "approved"
          : customer?.documents_verified_by?.email
          ? "rejected"
          : "pending";
        return customer?.email == selectedProperty && filterStatus === status;
      });
      if (data.length === 0) {
        setErrorDisplayText("No Party exists for this Property");
      } else {
        setErrorDisplayText("");
      }
      setSelectedStatus(filterStatus);
      setListProperty([...data]);
    }
    // when filter status is all and selected property is not all
    else if (filterStatus === "all" && selectedProperty != "all") {
      const data = values.filter((item) => {
        return item?.email == selectedProperty;
      });
      if (data.length === 0) {
        setErrorDisplayText("No Party exists for this Property");
      } else {
        setErrorDisplayText("");
      }
      setSelectedStatus(filterStatus);
      setListProperty([...data]);
    }
  };

  const filterBoth = (propertyValue, statusValue, fullPropertyObj) => {
    const values = [...fullPropertyObj];

    // when filter status is all and selected property is all
    if (statusValue === "all" && propertyValue == "all") {
      setListProperty([...fullPropertyObj]);
      // setSelectedStatus(statusValue);
    }
    // when filter status is not all and selected property is all
    else if (statusValue !== "all" && propertyValue == "all") {
      const data = values.filter((customer) => {
        const status = customer?.document_verified
          ? "approved"
          : customer?.documents_verified_by?.email
          ? "rejected"
          : "pending";
        return status === statusValue;
      });
      if (data.length === 0) {
        setErrorDisplayText("No Party exists for this Property");
      } else {
        setErrorDisplayText("");
      }
      // setSelectedStatus(statusValue);
      setListProperty([...data]);
    }
    // when filter status is not all and selected property is not all
    else if (statusValue !== "all" && propertyValue != "all") {
      const data = values.filter((customer) => {
        const status = customer?.document_verified
          ? "approved"
          : customer?.documents_verified_by?.email
          ? "rejected"
          : "pending";
        return customer?.email == propertyValue && statusValue === status;
      });
      if (data.length === 0) {
        setErrorDisplayText("No Party exists for this Property");
      } else {
        setErrorDisplayText("");
      }
      // setSelectedStatus(statusValue);
      setListProperty([...data]);
    }
    // when filter status is all and selected property is not all
    else if (statusValue === "all" && propertyValue != "all") {
      const data = values.filter((item) => {
        return item?.email == propertyValue;
      });
      if (data.length === 0) {
        setErrorDisplayText("No Party exists for this Property");
      } else {
        setErrorDisplayText("");
      }
      // setSelectedStatus(statusValue);
      setListProperty([...data]);
    }
  };

  useEffect(() => {
    bindAddProperty();
    filterByPropertyName(selectedProperty);
    filterByStatus(selectedStatus);
  }, []);

  return (
    <>
      <Head>
        <title>Property | ProjectK</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 2,
        }}
      >
        <Container maxWidth={false}>
          <ProductListToolbar
            title="Property"
            buttontitle="Create Property"
            navlink="/property/createproperty"
          />
          <Box sx={{ mt: 3 }}>
            <FilterComponent
              propertylist={uniqueEmail}
              filterByPropertyName={filterByPropertyName}
              filterByStatus={filterByStatus}
              filterWithEmail
              optionLabels={optionLabels}
            />
            <CustomerListResults
              customers={listProperty}
              errorDisplayTex={errorDisplayText}
              handledeleteaction={handleDeleteAction}
            />
          </Box>
        </Container>
      </Box>
      {open && (
        <CustomizedDialogs
          isOpen={open}
          setIsOpen={setOpen}
          renderComponent={bodyComp}
          confirmtext={"Yes"}
          canceltext={"No"}
          handleconfirmation={handleconfirmation}
        />
      )}
      {openToast && (
        <ToastBar
          isOpen={openToast}
          setIsOpen={setOpenToast}
          type={messageType}
          displayMessage={messageText}
        />
      )}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
