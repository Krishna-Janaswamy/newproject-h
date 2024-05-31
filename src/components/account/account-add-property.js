import { useState, useContext, useEffect, useMemo, useCallback } from "react";
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
  Typography,
  SvgIcon,
  InputAdornment,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormLabel,
} from "@mui/material";
// import FormLabel from "@mui/material/FormLabel";
import { TimePicker } from "@mui/x-date-pickers";
import { CustomizedDialogs } from "../modalpopup/modal-pop-up";
import { initialStateAddProperty } from "../../utils/method";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";

export const AccountProfileDetails = (props) => {
  const {
    countrycontent,
    handlestatewithcountryid,
    handlecitywithstateid,
    statecontent,
    citycontent,
    latlong,
    postapppropertyhandle,
    propertypostresult,
    handlepropertyiddelete,
  } = props;
  const authContext = useContext(AuthContext);
  const [addPropertyData, setAddPropertyData] = useState({});
  const [open, setOpen] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);
  const [openState, setOpenState] = useState(false);
  const theme = useTheme();
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const [cityValue, setCityValue] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [cancleConfirmationPop, setCancleConfirmationPop] = useState(false);

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
    // state: Yup.string().required("State is required"),
    country: Yup.string().required("Country required"),
    pin_code: Yup.string()
      .matches(/^\d+$/, "Only numeric values are allowed")
      .required("Please enter a valid PIN code")
      .min(5, "Pin Code must be greater than or equal to 5")
      .max(8, "Pin Code must be less than or equal to 8"),
    // opening_time: Yup.date().required("Opening Time is required"),
    // closing_time: Yup.date()
    //   .required("End date cannot be empty")
    //   .when("opening_time", (opening_time, schema) => {
    //     if (opening_time) {
    //       const minTime = new Date(opening_time.getTime() + 10800000);
    //       return schema.min(minTime, "Property Opening hours should be minimum 3 hours");
    //     }
    //     return schema;
    //   }),
    // total_capacity: Yup.string()
    //   .matches(/^(?!0+$)[0-9]+$/, "Only numeric values are allowed")
    //   .required("Total Capacity is required")
    //   .min(0, "Total capacity cant be 0")
    //   .max(6, "Total capacity cant exceeds 999999"),
    // seating_capacity: Yup.string()
    //   .matches(/^(?!0+$)[0-9]+$/, "Only numeric values are allowed")
    //   .required("Seating capacity is required")
    //   .min(0, "Seating capacity cant be 0")
    //   .max(6, "Seating capacity cant exceeds 999999"),
    // city: Yup.string().required(stateValue ? "City is required" : "Please select the state first"),
    // lat: Yup.string("Auto filled latitue"),
    // long: Yup.string("Auto filled longitude"),
    property_code: Yup.string("Property code have been sent to your email").required(
      "Property code is required"
    ),
  });

  const formik = useFormik({
    initialValues: {
      name: propertypostresult?.name,
      description: propertypostresult?.description,
      email: propertypostresult?.email,
      state: propertypostresult?.state,
      city: propertypostresult?.city,
      country: "1",
      pin_code: propertypostresult?.pin_code,
      opening_time: propertypostresult?.opening_time,
      closing_time: propertypostresult?.closing_time,
      seating_capacity: propertypostresult?.seating_capacity,
      total_capacity: propertypostresult?.total_capacity,
      lat: latlong?.lat,
      long: latlong?.long,
      payment: [],
      manager: [],
      facilities: [],
      exterior_instagram: "",
      exterior_facebook: "",
      interior_instagram: "",
      interior_facebook: "",
      instagram: "",
      youtube: "",
      facebook: "",
      twitter: "",
      exterior_gallery: [],
      interior_gallery: [],
      menu_place: [],
      promoter: [],
      documents: propertypostresult?.documents,
      video_file: propertypostresult?.video_file,
      property_code: propertypostresult?.property_code,
    },
    enableReinitialize: true,
    handleChange: async () => {},
    validationSchema: validate,
    onSubmit: async (values) => {
      const result = { ...values };
      // if(citycontent.length) {
      //   result.city = citycontent[0].id
      // }

      setAddPropertyData(result);
      postapppropertyhandle(result);
    },
  });

  const handleStateClick = (e) => {
    e.preventDefault();
    if(e.target.value !== ''){
    handlecitywithstateid(e.target.value);
    }
  };

  const handleCancelConfirm = (e) => {
    formik.resetForm();
    handlepropertyiddelete("zero");
  };

  const bodyComp = () => {
    return (
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="subtitle1">Are you sure to cancel</Typography>
        <Typography sx={{ fontSize: 14, mt: "8px" }} gutterBottom>
          All data you have entered will be lost
        </Typography>
      </Box>
    );
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setCancleConfirmationPop(true);
  };

  // useEffect(() => {
  //   handlestatewithcountryid("1");
  // }, []);

  // useEffect(() => {
  //   if (citycontent.length === 0) {
  //     formik.setFieldValue("city", "");
  //   }
  // }, [citycontent]);

  const bodyCompPop = () => {
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
    const shouldBlockNavigation = JSON.stringify(formik.values) === JSON.stringify(initialStateAddProperty);

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
  }, [navigate, formik?.values, initialStateAddProperty]);

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
                    multiline
                    onChange={formik.handleChange}
                    required
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
                    InputProps={{
                      readOnly: true,
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
                    error={formik.touched.property_code && Boolean(formik.errors.property_code)}
                    helperText={"Property code has been sent to your e-mail"}
                    label="Property Code"
                    id="property_code"
                    name="property_code"
                    onChange={formik.handleChange}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formik.values.property_code}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel id="demo-controlled-open-select-label">Select Country*</InputLabel>
                    <Select
                      fullWidth
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      open={openSelect}
                      onClose={() => setOpenSelect(false)}
                      onOpen={() => setOpenSelect(true)}
                      value={formik.values.country ? formik.values.country : ""}
                      label="Select Country*"
                      required
                      onChange={(e) => {
                        formik.setFieldValue("country", e.target.value);
                        handlestatewithcountryid(e.target.value);
                      }}
                    >
                      {countrycontent &&
                        countrycontent.map((option, index) => (
                          <MenuItem key={`${option.value}-${index}`} value={option.id}>
                            {option.label}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
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
                    type="tel"
                    value={formik.values.pin_code}
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
                          onKeyDown={(e) => e.preventDefault()}
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
                          onKeyDown={(e) => e.preventDefault()}
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
              </Grid>
            </CardContent>
            <Divider />
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
                disabled={JSON.stringify(formik.values) === JSON.stringify(initialStateAddProperty)}
                onClick={(e) => {
                  // handleTermsOnRefresh(e);
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
          renderComponent={bodyComp}
          confirmtext={"Yes"}
          canceltext={"No"}
          handleconfirmation={() => handleCancelConfirm(propertypostresult)}
        />
      )}
        {cancleConfirmation && (
        <CustomizedDialogs
          isOpen={cancleConfirmation}
          setIsOpen={setCancleConfirmation}
          renderComponent={bodyCompPop}
          confirmtext={"No"}
          canceltext={"Yes"}
          modalTitle="Leaving Page?"
          handleconfirmation={() => handleConfirm()}
        />
      )}
    </>
  );
};
