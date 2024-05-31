import { useState, useContext, useEffect, useMemo, useRef } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { useFormik, FormikProvider, Field } from "formik";
import moment from 'moment';
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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
} from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";

export const PersonalInfoDetails = (props) => {
  const { profiledata, postprofiledata, gendercontent, handleEmailVerification, inputOpen } = props;
  const [updatedDate, setUpdatedDate] = useState("");
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const hovRef = useRef(null);

  const authContext = useContext(AuthContext);
  const theme = useTheme();

  const validate = Yup.object({
    first_name: Yup.string()
    .matches(/^[A-Za-z]+[A-Za-z ]*$/, "Please enter valid first name")
    .required("First Name is required")
    .min(3, "First Name Number")
    .max(150, "Enter valid First Name"),
    last_name: Yup.string()
    .matches(/^[A-Za-z]+[A-Za-z ]*$/, "Please enter valid last name")
    .required("First Name is required")
    .min(3, "First Name Number")
    .max(150, "Enter valid First Name"),
    // email: Yup.string().email("Must be a valid email").required("Email is required"),
    mobile: Yup.string("Enter your Phone Number").min(8, "Enter Valid Phone Number").max(10),
    dob: Yup.string("Enter valid dob").required("Please enter valied dob"),
    gender: Yup.string('').required(),
  });

  const formik = useFormik({
    initialValues: {
      first_name: profiledata?.first_name ?? (undefined || null || ""),
      last_name: profiledata?.last_name ?? (undefined || null || ""),
      // email: profiledata?.email ?? (undefined || null || ""),
      mobile: profiledata?.mobile ?? (undefined || null || ""),
      dob: profiledata?.profile_detail?.dob ?? (undefined || null || ""),
      gender: profiledata?.profile_detail?.gender?.id ?? (undefined || null || ""),
    },
    enableReinitialize: true,
    validationSchema: validate,
    onChange: async (values) => {},
    onSubmit: async (values) => {
      const resValues = { ...values };
      resValues.dob = formateData(resValues?.dob);
      postprofiledata(resValues);
    },
  });

  const formateData = (newValue) => {
    const date = new Date(newValue);
    const dateMDY = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return dateMDY;
  };

  const handleChange = (newValue) => {
    setOtp(newValue);
    setVerifyFields({
      mobile: formik.values.mobile,
      session_id: otpField.session_id,
      otp: newValue,
    });
  };
  const handleVerifyEmail = (e, email) => {
    e.preventDefault();
    const data = JSON.stringify({
      email: email,
    });
    handleEmailVerification(data);
  };
  const handleDob = () =>{

  }

  useEffect(() => {
    setUpdatedDate(profiledata?.profile_detail?.dob);
  }, [profiledata]);
  return (
    <FormikProvider value={formik}>
      <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
        <Box sx={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
          <Card sx={{ background: "" }}>
            <CardHeader subheader="" title="My Profile" sx={{ textAlign: "center" }} />
            <Divider />
            <CardContent>
              <Grid container spacing={6} p={1}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                    helperText={formik.touched.first_name && formik.errors.first_name}
                    label="First Name"
                    id="first_name"
                    name="first_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formik.values.first_name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                    helperText={formik.touched.last_name && formik.errors.last_name}
                    label="Last Name"
                    id="last_name"
                    name="last_name"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    value={formik.values.last_name}
                    variant="outlined"
                  />
                </Grid>
                {/* <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={"Enter Valid Email"}
                    label="Email"
                    name="email"
                    id="email"
                    onChange={formik.handleChange}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formik.values.email}
                    variant="outlined"
                  />
                  {formik.values.email && (
                    <Button
                      disabled={!formik.values.email}
                      onClick={(e) => handleVerifyEmail(e, formik.values.email)}
                    >
                      Verify Email
                    </Button>
                  )}
                  {inputOpen && (
                    <MuiOtpInput
                      id="opt"
                      name="otp"
                      value={otp}
                      length={4}
                      autoFocus
                      onChange={handleChange}
                    />
                  )}
                </Grid> */}
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                    helperText={"Read Only"}
                    label="Phone Number"
                    name="mobile"
                    id="mobile"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="tel"
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                    value={formik.values.mobile}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      open={open}
                      onOpen={() => setOpen(true)}
                      onClose={() => setOpen(false)}
                      label="Date Of Birth"
                      openTo="day"
                      views={["year", "day"]}
                      inputFormat="DD / MM / YYYY"
                      value={dayjs(formik.values.dob)}
                      onChange={(value) => {
                        formik.setFieldValue("dob", value);
                      }}
                      onBlur={formik.handleBlur}
                      maxDate={moment().subtract(18, "years")}
                      disableFuture={true}
                      renderInput={(params) => {
                        return (
                          <TextField
                            {...params}
                            fullWidth
                            id="dob"
                            name="dob"
                            error={formik.touched.dob && Boolean(formik.errors.dob)}
                            helperText={"Enter Valid DoB"}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            required
                            // onChange={() => handleDob()}
                            onKeyDown={(e) => e.preventDefault()}
                            onClick={(e) => setOpen(true)}
                            // InputProps={{
                            //   readOnly: true
                            // }}

                            // {...params}
                          />
                        );
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                {/* <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Gender"
                    id="gender"
                    name="gender"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    select
                    // inputRef={inputRef}
                    SelectProps={{ native: true }}
                    value={formik.values.gender}
                    hiddenLabel
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                  >
                    {gendercontent &&
                      gendercontent.map((option) => (
                        <option key={option?.name} value={option?.id}>
                          {option.name}
                        </option>
                      ))}
                  </TextField>
                </Grid> */}
              </Grid>
            </CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 2,
              }}
            >
              <Button
                color="primary"
                sx={{
                  "&:focus": {
                    transform: "scale(0.9)",
                  },
                }}
                // disabled={!(formik.isValid && formik.dirty)}
                variant="contained"
                type="submit"
              >
                Update Details
              </Button>
            </Box>
          </Card>
        </Box>
      </form>
    </FormikProvider>
  );
};
