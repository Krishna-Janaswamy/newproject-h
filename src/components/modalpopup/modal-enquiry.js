import * as React from "react";
import { useState, useEffect } from "react";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import Router from "next/router";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import MuiGrid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { CustomizedDialogs } from "../../components/modalpopup/modal-pop-up";
import { enquiryData, getEnquiry } from "../../service/property.services";
import { ToastBar } from "../../components/toast-bar/toast-bar";
import { TextField } from "@mui/material";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  height: "100%",
  bgcolor: "background.paper",
  border: "1.5px solid #000",
  borderRadius: "7.5px",
  boxShadow: 24,
  p: 2,
};

const Grid = styled(MuiGrid)(({ theme }) => ({
  width: "100%",
  display: "flex",
  margin: "5px 0px 0px 5px",
  justifyContent: "center",
  ...theme.typography.body2,
  '& [role="separator"]': {
    margin: theme.spacing(0, 2),
  },
}));



export default function ShowEnquiry(props) {
  const [open, setOpen] = React.useState(false);
  const [modalCheck, setModalCheck] = useState(false);
  const handleOpen = () => {
    if (props.customerDetails.enquiry_status[0].club_owner_status == "Approved") {
      setModalCheck(true);
    }
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [openToast, setOpenToast] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [typeText, setTypeText] = useState("");
  const [enquiryUpdated, setEnquiryUpdated] = useState("");
  const [transition, setTransition] = useState(undefined);

  const validate = Yup.object({
    club_owner_quotation: Yup.string().required("Quotation is mandatory"),
    token_amount: Yup.string().required("Token amount code is mandatory"),
  });

  const formik = useFormik({
    initialValues: {
      club_owner_quotation: "",
      token_amount: "",
      club_owner_remark: "",
      club_owner_status: "Approved",
    },
    enableReinitialize: true,
    validationSchema: validate,
    onChange: async (values) => {},
    onSubmit: async (values) => {
      const resValues = { ...values };
      // resValues.club_owner_quotation = resValues?.club_owner_quotation;
      // resValues.token_amount = resValues?.token_amount;

      if (resValues?.club_owner_quotation == !null && resValues?.token_amount == !null) {
        const result = { ...resValues };
        onSubmitCallBack(result);
      }
    },
  });

  const bindEnquiry = async () => {
    const data = await getEnquiry();
    setEnquiryUpdated(data?.results);
  };

  const formatDate = (newValue) => {
  const date = new Date(newValue);

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
  const day = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Format the date string
  const formattedDate = `${day}, ${dayOfMonth}-${month}-${year}`;

  return formattedDate;
};

const toIndianCurrency = (budget) => {
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(budget);
  return formattedPrice;
};

const bodyComp = () => {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="subtitle1">Are you sure to Delete</Typography>
      <Typography sx={{ fontSize: 14, mt: "8px" }} gutterBottom>
        Are you sure you want reject it!!
      </Typography>
    </Box>
  );
};

const handleconfirmation = async () => {
  const data = await deleteEnquiryId(selectedId);
  if (data?.status === true) {
    setOpenToast(true);
    setMessageType("success");
    setMessageText(data?.Message);
  } else {
    setOpenToast(true);
    setMessageType("error");
    setMessageText("Oops!!! Something went wrong, please check again");
  }
};

  const getTransition = (Transition) => {
    setTransition(() => Transition);
  };

  const TransitionDown = (props) => {
    return <Slide {...props} direction="down" />;
  };

  const postEnquiryData = async (patchData) => {
    patchData.user_property = props.customerDetails.enquiry_status[0].user_property.id;
    patchData.user_enquiry = props.customerDetails.id;
    const data = await enquiryData(patchData);
    if (data?.status) {
      setOpenToast(true);
      setMessageText("Query send Successfully!!!");
      setTypeText("success");
      getTransition(TransitionDown);
      Router.push("/enquiry").catch(console.error);
      
    } else {
      setOpenToast(true);
      setMessageText("Ooops please try again!!!");
      setTypeText("error");
      getTransition(TransitionDown);
      Router.push("/enquiry").catch(console.error);
    }
    
  };

  const onSubmitCallBack = (postData) => {
    postEnquiryData(postData);
    bindEnquiry()
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleOpen}>Show</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {modalCheck == true ? (
          <Box sx={style}>
            <Button onClick={handleClose} sx={{ position: "absolute", top: "1px", right: "8px" }}>
              <CloseIcon />
            </Button>
            <Typography variant="h6">Enquiry Details</Typography>
            <Divider />

            <Divider orientation="vertical" flexItem></Divider>

            {props.customerDetails.enquiry_status[0].user_property.name ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Property Name</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>
                    {props.customerDetails.enquiry_status[0].user_property.name}
                  </Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.user.first_name + " " + props.customerDetails.user.last_name ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Name</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>
                    {props.customerDetails.user.first_name +
                      " " +
                      props.customerDetails.user.last_name}
                  </Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.user.mobile ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Mobile</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>{props.customerDetails.user.mobile}</Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.occasion.name ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Occasion</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>{props.customerDetails.occasion.name}</Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.status ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Status</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>{props.customerDetails.status ? "Active" : "InActive"}</Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.date ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Date</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>{formatDate(props.customerDetails.date)}</Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.budget ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Budget</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>{toIndianCurrency(props.customerDetails.budget)}</Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.no_of_guest ? (
              <Grid container>
                <Grid item xs>
                  <Typography>No of Guest</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>{props.customerDetails.no_of_guest}</Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.table_book ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Table Book</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>{props.customerDetails.table_book ? "Yes" : "No"}</Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.drink_preference ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Drink Preference</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>{props.customerDetails.drink_preference}</Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.meal_preference ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Meal Preference</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>{props.customerDetails.meal_preference}</Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.music_preference ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Music Preference</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>{props.customerDetails.music_preference}</Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.enquiry_status[0].club_owner_quotation ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Quotation</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>
                    {toIndianCurrency(props.customerDetails.enquiry_status[0].club_owner_quotation)}
                  </Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.enquiry_status[0].token_amount ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Token Amount</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>
                    {toIndianCurrency(props.customerDetails.enquiry_status[0].token_amount)}
                  </Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.enquiry_status[0].club_owner_remark ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Remark</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>
                    {props.customerDetails.enquiry_status[0].club_owner_remark}
                  </Typography>
                </Grid>
              </Grid>
            ) : null}

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 2,
              }}
            >
              <Button
                onClick={(e) => {
                  {
                    open && (
                      <CustomizedDialogs
                        isOpen={open}
                        setIsOpen={setOpen}
                        renderComponent={bodyComp}
                        confirmtext={"Yes"}
                        canceltext={"No"}
                        handleconfirmation={handleconfirmation}
                      />
                    );
                  }
                }}
                sx={{
                  "&:focus": {
                    transform: "scale(0.9)",
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={style}>
            <Button onClick={handleClose} sx={{ position: "absolute", top: "1px", right: "8px" }}>
              <CloseIcon />
            </Button>
            <Typography variant="h6">Enquiry Details</Typography>
            <Divider />

            <Divider orientation="vertical" flexItem></Divider>

            {props.customerDetails.enquiry_status[0].user_property.name ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Property Name</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>
                    {props.customerDetails.enquiry_status[0].user_property.name}
                  </Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.user.first_name + " " + props.customerDetails.user.last_name ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Name</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>
                    {props.customerDetails.user.first_name +
                      " " +
                      props.customerDetails.user.last_name}
                  </Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.user.mobile ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Mobile</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>{props.customerDetails.user.mobile}</Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.occasion.name ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Occasion</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>{props.customerDetails.occasion.name}</Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.status ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Status</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>{props.customerDetails.status ? "Active" : "InActive"}</Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.date ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Date</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>{formatDate(props.customerDetails.date)}</Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.budget ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Budget</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>{toIndianCurrency(props.customerDetails.budget)}</Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.no_of_guest ? (
              <Grid container>
                <Grid item xs>
                  <Typography>No of Guest</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>{props.customerDetails.no_of_guest}</Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.table_book ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Table Book</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>{props.customerDetails.table_book ? "Yes" : "No"}</Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.drink_preference ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Drink Preference</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>{props.customerDetails.drink_preference}</Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.meal_preference ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Meal Preference</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>{props.customerDetails.meal_preference}</Typography>
                </Grid>
              </Grid>
            ) : null}

            {props.customerDetails.music_preference ? (
              <Grid container>
                <Grid item xs>
                  <Typography>Music Preference</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid item xs>
                  <Typography>{props.customerDetails.music_preference}</Typography>
                </Grid>
              </Grid>
            ) : null}

            <FormikProvider value={formik}>
              <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
                <Grid sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  <TextField
                    fullWidth
                    error={
                      formik.touched.club_owner_quotation &&
                      Boolean(formik.errors.club_owner_quotation)
                    }
                    helperText={
                      formik.touched.club_owner_quotation && formik.errors.club_owner_quotation
                    }
                    label="Quotation"
                    id="club_owner_quotation"
                    name="club_owner_quotation"
                    onChange={formik.handleChange}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formik.values.club_owner_quotation}
                    // variant="outlined"
                    // fullWidth
                    // id="club_owner_quotation"
                    size="small"
                    // label="Quotation amount"
                  />
                  <TextField
                    fullWidth
                    error={formik.touched.token_amount && Boolean(formik.errors.token_amount)}
                    helperText={formik.touched.token_amount && formik.errors.token_amount}
                    label="Token amount"
                    id="token_amount"
                    name="token_amount"
                    onChange={formik.handleChange}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formik.values.token_amount}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    error={
                      formik.touched.club_owner_remark && Boolean(formik.errors.club_owner_remark)
                    }
                    helperText={formik.touched.club_owner_remark && formik.errors.club_owner_remark}
                    label="Remark"
                    id="club_owner_remark"
                    name="club_owner_remark"
                    onChange={formik.handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formik.values.club_owner_remark}
                    size="small"
                  />
                </Grid>
              </form>
            </FormikProvider>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 2,
              }}
            >
              <Button
                onClick={(e) => {
                  {
                    open && (
                      <CustomizedDialogs
                        isOpen={open}
                        setIsOpen={setOpen}
                        renderComponent={bodyComp}
                        confirmtext={"Yes"}
                        canceltext={"No"}
                        handleconfirmation={handleconfirmation}
                      />
                    );
                  }
                }}
                sx={{
                  "&:focus": {
                    transform: "scale(0.9)",
                  },
                }}
              >
                Reject
              </Button>
              <Button
                onClick={() => onSubmitCallBack(formik.values)}
                sx={{
                  "&:focus": {
                    transform: "scale(0.9)",
                  },
                }}
              >
                Send Quotation
              </Button>
            </Box>
          </Box>
        )}
      </Modal>
      {openToast && (
        <ToastBar
          isOpen={openToast}
          setIsOpen={setOpenToast}
          type={typeText}
          displayMessage={messageText}
          transition={transition}
        />
      )}
    </div>
  );
}
