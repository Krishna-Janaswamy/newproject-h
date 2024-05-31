import { useState, useContext, useEffect, useMemo } from "react";
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
  Container,
  Paper,
} from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Counter } from "../../components/counter/counter";

export const TemplateEmailVerify = (props) => {
  const {
    handleemailotp,
    otpEmail,
    handleemailverification,
    otpverification,
    errorstatus,
    errormessage,
    handleemailchange,
  } = props;
  const theme = useTheme();
  const [emailOtp, setEmailOtp] = useState("");
  const [otpEmptyError, setOtpEmptyError] = useState(false);
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const [emailValue, setEmailValue] = useState("");
  const [counter, setCounter] = useState(30);
  const [isResendValue, setIsResendValue] = useState(false);
  const [counterEnable, setCounterEnable] = useState(false);
  const [resendEnable, setResendEnable] = useState(false);

  const validate = Yup.object({
    email: Yup.string().matches(emailRegex, "Invalid email address").required("Email is required"),
    // user_otp: emailValue.length && Yup.string().required("please enter otp"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      user_otp: "",
    },
    enableReinitialize: true,
    handleChange: async () => {},
    validationSchema: validate,
    onSubmit: async (values) => {
      const data = {
        email: values.email,
      };
      handleemailverification(data);
      setIsResendValue(true);
    },
  });

  const handleVerifyEmail = (e, emailValue, value) => {
    setEmailOtp("");
    e.preventDefault();
    const data = {
      email: emailValue,
    };

    if (emailValue.length) {
      handleemailverification(data);
    }
    if (value === "resend") {
      setCounterEnable(true);
      setResendEnable(true);
    }
  };

  const handleCountTime = () => {
    setResendEnable(false);
    setCounterEnable(false);
  };

  const handleVerifyEmailOtp = (e, emailValue) => {
    e.preventDefault();
    const verifiedData = {
      email: emailValue,
      user_otp: emailOtp,
    };

    if (emailOtp.length) {
      setOtpEmptyError(false);
      handleemailotp(verifiedData);
    } else {
      setOtpEmptyError(true);
    }
  };

  const handleChangeMail = (e, value) => {
    e.preventDefault();
    handleemailchange(value);
  };

  const handleChangeOtp = (otpValue) => {
    if (otpValue === "") {
      setOtpEmptyError(true);
    }
    setOtpEmptyError(false);
    setEmailOtp(otpValue);
  };

  return (
    <Container maxWidth="auto">
      <Paper elevation={1}>
        <form autoComplete="off" noValidate onSubmit={(e) => formik.handleSubmit(e)}>
          <Box sx={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
            <Grid container p={10} sx={{ justifyContent: "center" }}>
              <Grid item>
                {!otpEmail && (
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
                    onChange={(e) => {
                      e.preventDefault();
                      setEmailValue(e.target.value);
                      formik.setFieldValue("email", e.target.value);
                    }}
                    required
                    value={formik.values.email}
                    variant="outlined"
                  />
                )}
                {otpEmail && (
                  <Typography variant="subtitle2">
                    OTP has been sent to the {formik.values.email}
                  </Typography>
                )}
                <Box sx={{ width: "250px" }} mt={2}>
                  {otpEmail && (
                    <MuiOtpInput
                      id="user_otp"
                      name="user_otp"
                      value={emailOtp}
                      length={4}
                      autoFocus
                      error={formik.touched.user_otp && Boolean(formik.errors.user_otp)}
                      helperText={formik.touched.user_otp && formik.errors.user_otp}
                      onChange={handleChangeOtp}
                    />
                  )}
                  <Grid container justifyContent="space-between" alignItems={"space-between"}>
                    <Grid item>
                      {otpEmail && (
                        <Button onClick={(e) => handleChangeMail(e, false)}>Change Email</Button>
                      )}
                    </Grid>
                    <Grid item>
                      {otpEmail && (
                        <Button
                          disabled={resendEnable}
                          // sx={{ mt: 2, ml: 2 }}
                          // type="submit"
                          onClick={(e) => handleVerifyEmail(e, formik.values.email, "resend")}
                        >
                          Resend OTP
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                  {errorstatus && (
                    <Typography
                      sx={{ color: theme.palette.error.light }}
                      gutterBottom
                      variant="body2"
                    >
                      {errormessage}
                    </Typography>
                  )}
                  {otpEmptyError && (
                    <Typography
                      sx={{ color: theme.palette.error.light }}
                      gutterBottom
                      variant="body2"
                    >
                      Please enter the OTP
                    </Typography>
                  )}
                  {/* {isResendValue && (
                    <Typography
                      sx={{ color: theme.palette.error.light }}
                      gutterBottom
                      variant="body2"
                    >
                      Please try after {counter} seconds
                    </Typography>
                  )} */}
                </Box>
                {otpEmail && counterEnable && <Counter handleTime={handleCountTime} />}
                {!otpEmail && (
                  <Button
                    disabled={!(formik.isValid && formik.dirty)}
                    // sx={{ mt: 2, ml: 2 }}
                    type="submit"
                    fullWidth
                  >
                    Verify Email
                  </Button>
                )}
                <Grid container direction="row" justifyContent="center" alignItems="center">
                  <Grid item>
                    {otpEmail && (
                      <Button
                        disabled={!emailOtp}
                        // sx={{ mt: 2, ml: 2 }}
                        fullWidth
                        //   type="submit"
                        onClick={(e) => handleVerifyEmailOtp(e, formik.values.email)}
                      >
                        Verify Email
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};
