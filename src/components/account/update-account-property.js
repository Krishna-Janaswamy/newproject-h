import React, { useState, useContext, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../../contexts/auth-context";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  useTheme,
  FormLabel,
  Typography,
  IconButton,
  SvgIcon,
  InputAdornment,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { CustomizedDialogs } from "../modalpopup/modal-pop-up";

export const AccountUpdatedDetails = (props) => {
  const {
    countrycontent,
    handlestatewithcountryid,
    handlecitywithstateid,
    statecontent,
    citycontent,
    updatedpropertydata,
    propertyId,
    postupdatehandle,
    handleCancelAccount,
    handlepropertyiddelete,
    initAccountProp,
  } = props;
  const authContext = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [cancleConfirmationPop, setCancleConfirmationPop] = useState(false);
  const [stateValue, setStateValue] = useState("");
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const theme = useTheme();

  const [cancleConfirmation, setCancleConfirmation] = useState(false);
  const [navigate, setNavigate] = useState(false);
  const [urlPath, setUrlPath] = useState(null);

  const router = useRouter();

  const validate = Yup.object({
    name: Yup.string()
      // .matches(/^[^-\s][a-zA-Z_\s-]+$/, "Only numeric values are allowed")
      .required("Name is required")
      .min(3, "Name Number")
      .max(150, "Enter valid Name"),
    description: Yup.string()
      // .matches(/^[^-\s][a-zA-Z_\s-]+$/, "Only numeric values are allowed")
      .required("About property is required")
      .min(10, "Minimum 10 About Property is Required")
      .max(1000, "You have exceeded maximun characters"),
    email: Yup.string().matches(emailRegex, "Invalid email address").required("Email is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country required"),
    pin_code: Yup.string()
      .matches(/^\d+$/, "Only numeric values are allowed")
      .required("Please enter a valid PIN code")
      .min(5, "Pin Code must be greater than or equal to 5")
      .max(8, "Pin Code must be less than or equal to 8"),
    opening_time: Yup.date().required("Opening Time is required"),
    closing_time: Yup.date()
      .required("End date cannot be empty")
      .when("opening_time", (opening_time, schema) => {
        if (opening_time) {
          const minTime = new Date(opening_time.getTime() + 10800000);
          return schema.min(minTime, "Property Opening hours should be minimum 3 hours");
        }
        return schema;
      }),
    total_capacity: Yup.string()
      .matches(/^(?!0+$)[0-9]+$/, "Only numeric values are allowed")
      .required("Total Capacity is required")
      .min(0, "Total capacity cant be 0")
      .max(6, "Total capacity cant exceeds 999999"),
    seating_capacity: Yup.string()
      .matches(/^(?!0+$)[0-9]+$/, "Only numeric values are allowed")
      .required("Seating capacity is required")
      .min(0, "Seating capacity cant be 0")
      .max(6, "Seating capacity cant exceeds 999999"),
    city: Yup.string().required(stateValue ? "City is required" : "Please select the state first"),
    lat: Yup.string("Auto filled latitue"),
    long: Yup.string("Auto filled longitude"),
  });

  const formik = useFormik({
    initialValues: {
      name: updatedpropertydata?.name,
      description: updatedpropertydata?.description,
      email: updatedpropertydata?.email,
      state: updatedpropertydata?.state?.id,
      city: updatedpropertydata?.city?.id,
      country: updatedpropertydata?.country?.id,
      pin_code: updatedpropertydata?.pin_code,
      opening_time: updatedpropertydata?.opening_time,
      closing_time: updatedpropertydata?.closing_time,
      seating_capacity: updatedpropertydata?.seating_capacity,
      total_capacity: updatedpropertydata?.total_capacity,
      lat: updatedpropertydata?.lat,
      long: updatedpropertydata?.long,
    },
    enableReinitialize: true,
    handleChange: async () => {},
    validationSchema: validate,
    onSubmit: async (values) => {
      postupdatehandle(values);
    },
  });

  const handleCancel = (e, propId) => {
    e.preventDefault();
    setCancleConfirmationPop(true);
  };

  const handleCancelConfirm = () => {
    handlepropertyiddelete("zero");
    formik.resetForm();
    handleCancelAccount();
  };

  const bodyCompConfirm = () => {
    return (
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="subtitle1">Are you sure to cancel</Typography>
        <Typography sx={{ fontSize: 14, mt: "8px" }} gutterBottom>
          All data you have entered will be lost
        </Typography>
      </Box>
    );
  };

  const handleCountryClick = (e) => {
    handlestatewithcountryid(e.target.value);
  };

  const handleStateClick = (e) => {
    if (e.target.value !== "") {
      handlecitywithstateid(e.target.value);
    }
  };

  useEffect(() => {
    if (citycontent.length === 0) {
      formik.setFieldValue("city", "");
    }
  }, [citycontent]);
  const bodyComp = () => {
    return (
      <Box sx={{ textAlign: "center" }}>
        {/* <Typography variant="subtitle1">Are you sure to cancel</Typography> */}
        <Typography sx={{ fontSize: 14, mt: "8px" }} gutterBottom>
          Do you want to stay on the current page?
        </Typography>
      </Box>
    );
  };

  useEffect(() => {
    const shouldBlockNavigation = JSON.stringify(formik.values) === JSON.stringify(initAccountProp);

    const nativeBrowserHandler = (event) => {
      if (!shouldBlockNavigation) {
        event.preventDefault();
        event.returnValue = "Are you sure you want to leave?";
      }
    };

    const nextNavigationHandler = (url) => {
      setUrlPath(url);
      if (!shouldBlockNavigation) {
        if (!cancleConfirmation && !navigate) {
          setCancleConfirmation(true);
          router.events.emit("routeChangeError");
          // eslint-disable-next-line no-throw-literal
          throw "Abort route change by user's confirmation.";
        }
      }
    };

    window.addEventListener("beforeunload", nativeBrowserHandler);
    router.events.on("beforeHistoryChange", nextNavigationHandler);

    // On component unmount, remove the event listener
    return () => {
      window.removeEventListener("beforeunload", nativeBrowserHandler);
      router.events.off("beforeHistoryChange", nextNavigationHandler);
    };
  }, [navigate, formik?.values, initAccountProp]);

  const handleConfirm = () => {
    setNavigate(true);
    void router.push(urlPath);
  };

  return (
    <>
      <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
        <Box sx={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }} mt={3}>
          <Card sx={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
            <FormLabel component="legend" sx={{ m: 4 }}>
              Note: We are currently operating in Delhi NCR, Will be coming across states soon.
            </FormLabel>
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    label="Property Name"
                    id="name"
                    name="name"
                    onChange={formik.handleChange}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formik.values.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                    label="About Property"
                    id="description"
                    name="description"
                    onChange={formik.handleChange}
                    required
                    multiline
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formik.values.description}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    label="Email Address"
                    name="email"
                    id="email"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.email}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.country && Boolean(formik.errors.country)}
                    helperText={formik.touched.country && formik.errors.country}
                    label="Select Country"
                    id="country"
                    name="country"
                    onChange={formik.handleChange}
                    required
                    select
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onBlur={formik.handleBlur}
                    SelectProps={{ native: true }}
                    value={formik.values.country}
                    onClick={(e) => {
                      handleCountryClick(e, formik.values.country);
                    }}
                    hiddenLabel
                    variant="outlined"
                  >
                    {countrycontent &&
                      countrycontent.map((option) => (
                        <option key={option.value} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                  </TextField>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={"Please select your country first"}
                    label="Select State"
                    name="state"
                    id="state"
                    onChange={(e) => {
                      formik.setFieldValue("state", e.target.value);
                      setStateValue(e.target.value);
                    }}
                    required
                    select
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onClick={(e) => {
                      handleStateClick(e, formik.values.state);
                    }}
                    onBlur={formik.handleBlur}
                    SelectProps={{ native: true }}
                    value={formik.values.state}
                    variant="outlined"
                  >
                    {statecontent.length >= 0 && (
                      <option key={`default-value`} value="">
                        {"Select"}
                      </option>
                    )}
                    {statecontent &&
                      statecontent.map((option) => (
                        <option key={option.name} value={option.id}>
                          {option?.name}
                        </option>
                      ))}
                  </TextField>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}
                    label="Select city"
                    name="city"
                    id="city"
                    required
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    select
                    InputLabelProps={{
                      shrink: true,
                    }}
                    // onClick={(e) => {
                    //   handleStateClick(e, formik.values.state);
                    // }}
                    SelectProps={{ native: true }}
                    value={formik.values.city}
                    variant="outlined"
                  >
                    {citycontent.length >= 0 && (
                      <option key={`default-value`} value="">
                        {"Select"}
                      </option>
                    )}
                    {citycontent &&
                      citycontent.map((option) => (
                        <option key={option.name} value={option.id}>
                          {option?.name}
                        </option>
                      ))}
                  </TextField>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.pin_code && Boolean(formik.errors.pin_code)}
                    helperText={formik.touched.pin_code && formik.errors.pin_code}
                    label="Pin Code"
                    name="pin_code"
                    id="pin_code"
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="tel"
                    value={formik.values.pin_code}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.total_capacity && Boolean(formik.errors.total_capacity)}
                    helperText={formik.touched.total_capacity && formik.errors.total_capacity}
                    label="Total Capacity"
                    name="total_capacity"
                    id="total_capacity"
                    required
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="tel"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formik.values.total_capacity}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={
                      formik.touched.seating_capacity && Boolean(formik.errors.seating_capacity)
                    }
                    helperText={formik.touched.seating_capacity && formik.errors.seating_capacity}
                    label="Seating Capacity"
                    name="seating_capacity"
                    id="seating_capacity"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="tel"
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formik.values.seating_capacity}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TimePicker
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    label="Opening Time"
                    value={formik.values.opening_time}
                    onChange={(value) => {
                      formik.setFieldValue("opening_time", value);
                    }}
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          fullWidth
                          error={formik.touched.opening_time && Boolean(formik.errors.opening_time)}
                          helperText={formik.touched.opening_time && formik.errors.opening_time}
                          label="Opening Time"
                          name="opening_time"
                          id="opening_time"
                          onChange={formik.handleChange}
                          required
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onClick={(e) => setOpen(true)}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TimePicker
                    open={openTime}
                    onOpen={() => setOpenTime(true)}
                    onClose={() => setOpenTime(false)}
                    label="Closing Time"
                    value={formik.values.closing_time}
                    onChange={(value) => {
                      formik.setFieldValue("closing_time", value);
                    }}
                    minTime={formik.values.opening_time + 86400000}
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          fullWidth
                          error={formik.touched.closing_time && Boolean(formik.errors.closing_time)}
                          helperText={formik.touched.closing_time && formik.errors.closing_time}
                          label="Closing Time"
                          name="closing_time"
                          id="closing_time"
                          onChange={formik.handleChange}
                          required
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onClick={(e) => setOpenTime(true)}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.lat && Boolean(formik.errors.lat)}
                    helperText={formik.touched.lat && formik.errors.lat}
                    label="Auto filled Latitude"
                    name="lat"
                    id="lat"
                    onChange={formik.handleChange}
                    // required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type="tel"
                    value={formik.values.lat}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.long && Boolean(formik.errors.long)}
                    helperText={formik.touched.long && formik.errors.long}
                    label="Auto filled Longitude"
                    name="long"
                    id="long"
                    onChange={formik.handleChange}
                    // required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type="tel"
                    value={formik.values.long}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 2,
              }}
            >
              <Button
                type="reset"
                sx={{
                  "&:focus": {
                    transform: "scale(0.9)",
                  },
                }}
                disabled={JSON.stringify(initAccountProp) === JSON.stringify(formik.values)}
                onClick={(e) => {
                  // handleTermsOnRefresh(e);
                  // formik.resetForm();
                  // handleCancelAccount();
                  handleCancel(e);
                  // handlerefresh(e);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                sx={{
                  "&:focus": {
                    outline: "1px black solid",
                    transform: "scale(0.9)",
                  },
                }}
              >
                Next
              </Button>
            </Box>
          </Card>
        </Box>
      </form>
      {cancleConfirmationPop && (
        <CustomizedDialogs
          isOpen={cancleConfirmationPop}
          setIsOpen={setCancleConfirmationPop}
          renderComponent={bodyCompConfirm}
          confirmtext={"Yes"}
          canceltext={"No"}
          handleconfirmation={() => handleCancelConfirm()}
        />
      )}
       {cancleConfirmation && (
        <CustomizedDialogs
          isOpen={cancleConfirmation}
          setIsOpen={setCancleConfirmation}
          renderComponent={bodyComp}
          confirmtext={"No"}
          canceltext={"Yes"}
          modalTitle="Leaving Page?"
          handleconfirmation={() => handleConfirm()}
        />
      )}
    </>
  );
};

export default React.memo(AccountUpdatedDetails);
