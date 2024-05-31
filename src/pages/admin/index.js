import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Box, Button, Container, Grid, Pagination, Typography } from "@mui/material";
import { products } from "../../__mocks__/products";
import { ProductListToolbar } from "../../components/product/product-list-toolbar";
import { ProductCard } from "../../components/product/product-card";
import { DashboardLayout } from "../../components/dashboard-layout";
import { CustomerListResults } from "../../components/customer/customer-list-results";
import { customers } from "../../__mocks__/customers";
import { CustomizedDialogs } from "../../components/modalpopup/modal-pop-up";
import {
  deletePropertyId,
  getAddProperty,
  postPropertyVerify,
} from "../../service/property.services";
import { ToastBar } from "../../components/toast-bar/toast-bar";
import { CustomeAdminList } from "../../components/customer/custome-admin-list";
import { FilterComponent } from "../../components/filter-component/filter-component";
import { patchUserRole } from "../../service/account.service";
import { testZip } from "../../utils/zipFile";
import { RemarkForm } from "../../components/account/remark-form";
import { width } from "@mui/system";

const Page = () => {
  const [listProperty, setListProperty] = useState([]);
  const [open, setOpen] = useState(false);
  const [isRemark, setIsRemark] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("");
  const [errorDisplayText, setErrorDisplayText] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [fullProperty, setFullProperty] = useState([]);
  const [uniqueEmail, setUniqueEmail] = useState([]);
  const [lastFilterPropertyStatus, setLastFilterPropertyStatus] = useState("all");
  const [lastFilterByStatus, setLastFilterByStatus] = useState("all");
  const [remark, setRemark] = useState("");
  const [remarkData, setRemarkData] = useState({});

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
    const data = await getAddProperty();
    setFullProperty(data?.results);
    setListProperty(data?.results);
    let value = [];
    data?.results &&
      data?.results.map((content) => {
        value.push(content?.email);
      });
    const updatedValue = [...new Set(value)];

    setUniqueEmail(updatedValue);
  };

  const bindPrpertyApproveStatus = async () => {
    const data = await getAddProperty();
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

  // const handleRemarkForm = () => {
  //   setIsRemark(true);
  // }

  const bodyRemark = () => {
    return <RemarkForm postRemark={handlePostRemark} handleCancel={handleCancelRemark} />;
  };

  const handleCancelRemark = () => {
    setIsRemark(false);
    setRemark('');
  }

  const handleApproveState = async (id, userId, status) => {
    const ApproveData = {
      property_id: id,
      property_status: status,
      property_verified_remark: "",
    };
    handlePostVerifyCall(ApproveData, status);
  };

  const handleRejectState = async (id, userId, status) => {
    const Data = {
      property_id: id,
      property_status: status,
      property_verified_remark: "",
    };
    setIsRemark(true);
    setRemarkData(Data);
  };

  const handlePostRemark = (data) => {
   const value = {...remarkData};
   value.property_verified_remark = data.remark;
   handlePostVerifyCall(value);
   setIsRemark(false);
  };

  const handlePostVerifyCall = async (data) => {
    const result = await postPropertyVerify(data);
    if (result?.status === true) {
      setOpenToast(true);
      setMessageType("success");
      setMessageText(result?.message);
    }
    bindPrpertyApproveStatus();
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
    bindAddProperty();
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
        setErrorDisplayText(`Data doesn't exist`);
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
        setErrorDisplayText(`Data doesn't exist`);
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
        setErrorDisplayText(`Data doesn't exist`);
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
        setErrorDisplayText(`Data doesn't exist`);
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
        setErrorDisplayText(`Data doesn't exist`);
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
        setErrorDisplayText(`Data doesn't exist`);
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
        setErrorDisplayText(`Data doesn't exist`);
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
        setErrorDisplayText(`Data doesn't exist`);
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
        setErrorDisplayText(`Data doesn't exist`);
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
        <title>Super Admin | ProjectK</title>
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
            title="Super Admin"
            // buttontitle="Create Property"
            navlink="/admin/createpropertyadmin"
          />
          <Box sx={{ mt: 3 }}>
            <FilterComponent
              propertylist={uniqueEmail}
              filterByPropertyName={filterByPropertyName}
              filterByStatus={filterByStatus}
              filterWithEmail
              optionLabels={optionLabels}
            />
            <CustomeAdminList
              customers={listProperty}
              errorDisplayTex={errorDisplayText}
              // handledeleteaction={handleDeleteAction}
              handleApproveState={handleApproveState}
              handleRejectState={handleRejectState}
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
      {isRemark && (
        <CustomizedDialogs
          isOpen={isRemark}
          setIsOpen={setIsRemark}
          renderComponent={bodyRemark}
          customstyle={{
            width: "500px",
            height: "280px",
            overflow: true,
          }}
          modalTitle={"Remarks"}
          // handleconfirmation={handleRemarkForm}
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
