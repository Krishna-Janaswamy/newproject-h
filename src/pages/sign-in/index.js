import { useState, useContext, useRef } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  useTheme,
  Grid,
} from "@mui/material";
import { auth } from "../../lib/auth";
import { AuthContext } from "../../contexts/auth-context";
import { MuiOtpInput } from "mui-one-time-password-input";
import Router from "next/router";
import { setAuth, setUserMobile } from "../../service/identity.service";
import { getProfileData } from "../../service/account.service";
import { Counter } from "../../components/counter/counter";

const Page = () => {
  const [otpField, setOptField] = useState(false);
  const [verifFields, setVerifyFields] = useState({});
  const authContext = useContext(AuthContext);
  const [otp, setOtp] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);
  const [resendOn, setResendOn] = useState(false);
  const [counterEnable, setCounterEnable] = useState(false);
  const [resendEnable, setResendEnable] = useState(false);
  const [emailValues, setEmailValues] = useState({});
  const theme = useTheme();
  const inputRef = useRef(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

  const bindProfileData = async () => {
    fetch('/api/profile')
    .then((response) => response.json())
    .then((data) =>  {
    authContext.updateProfile(data?.results);
    })
  };

  const handleChange = (newValue) => {
    setOtp(newValue);
    setVerifyFields({
      mobile: formik.values.mobile,
      session_id: otpField.session_id,
      otp: newValue,
    });
  };

  const sendOtp = async (value) => {
    setOtp("");
    const postData = {
      mobile: emailValues,
    };
    // const response = await fetch(`${baseUrl}/api/account/send_otp/`, {
    //   method: "POST",
    //   body: JSON.stringify(postData),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // const data = await response.json();
    setOptField({status: true, message: 'Verified'});
    setResendOn(true);
    if (value === "resend") {
      setCounterEnable(true);
      setResendEnable(true);
    }
    authContext.updateMobile('9493165539');
  };

  const validate = yup.object({
    mobile: yup
      .string()
      .matches(/^\d+$/, "Only numeric values are allowed")
      .required("Phone Number is required")
      .min(10, "Enter Phone Number")
      .max(10, "Enter valid Number"),
  });
  const formik = useFormik({
    initialValues: {
      mobile: "",
    },
    validationSchema: validate,
    onSubmit: async (values) => {
      if (!otp) {
        sendOtp();
      }

      if (otp) {
        const verifyOtp = async () => {
          const response = await fetch(`${baseUrl}/api/account/verify/`, {
            method: "POST",
            body: JSON.stringify({
              mobile: formik.values.mobile,
              session_id: otpField.session_id,
              otp: otp,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          // const data = await response.json();
          const data = {
            status: true
          } 
          if (data.status) {
            setErrorStatus(false);
            // setAuth(data?.results?.token);
            setAuth(token)
            setUserMobile(formik.values.mobile);
            // sessionStorage.setItem("accessToken", JSON.stringify(data?.results?.token));
            sessionStorage.setItem("accessToken", JSON.stringify(token));
            bindProfileData();
            // window.accessToken = JSON.stringify(data?.results?.token);
            window.accessToken = JSON.stringify(token);
            Router.push("/sign-in/confirm").catch(console.error);
            // Router.push("/").catch(console.error);
          } else {
            setErrorStatus(true);
            setResendOn(true);
          }
        };
        verifyOtp();
      }
    },
  });

  const handleCountTime = () => {
    setResendEnable(false);
    setCounterEnable(false);
  };

  const handleChangeNumber = () => {
    setOptField(false);
    setErrorStatus(false);
    setOtp("")
    // inputRef.current.focus();
  };

  return (
    <>
      <Head>
        <title>SignIn | ProjectK</title>
      </Head>

      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
          maxWidth: "auto",
          background: "#809ac4",
        }}
      >
        <Container maxWidth="sm">
          <Paper elevation={1}>
            <form
              onSubmit={formik.handleSubmit}
              sx={{ background: "#a5b0c2", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
            >
              <Grid p={4}>
                <Grid item>
                  <Box sx={{ my: 3 }}>
                    <Typography color="textPrimary" variant="h4" textAlign="center">
                      Sign Up
                    </Typography>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="body2"
                      textAlign="center"
                    >
                      Sign Up with mobile OTP
                    </Typography>
                  </Box>
                  {!otpField.status && (
                    <TextField
                      error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                      helperText={formik.touched.mobile && formik.errors.mobile}
                      fullWidth
                      id="mobile"
                      name="mobile"
                      label="Enter Phone Number"
                      margin="normal"
                      type="tel"
                      autoFocus
                      onChange={(e) => {
                        setEmailValues(e.target.value);
                        formik.setFieldValue("mobile", e.target.value);
                      }}
                      value={formik.values.mobile}
                      variant="outlined"
                    />
                  )}
                  {!otpField.status && (
                    <Typography
                      sx={{ color: theme.palette.error.light }}
                      gutterBottom
                      variant="body2"
                    >
                      {otpField?.message}
                    </Typography>
                  )}
                  {otpField.status && (
                    <Typography variant="subtitle2" sx={{ m: 2 }}>
                      OTP has been sent to the {formik.values.mobile}
                    </Typography>
                  )}
                  {otpField.status && (
                    <MuiOtpInput
                      id="opt"
                      name="otp"
                      value={otp}
                      length={6}
                      autoFocus
                      onChange={handleChange}
                    />
                  )}
                  <Grid container justifyContent="space-between" alignItems={"space-between"}>
                    <Grid item>
                      {otpField.status && (
                        <Button onClick={(e) => handleChangeNumber(e, false)}>Change Mobile</Button>
                      )}
                      </Grid>
                      <Grid item>
                      {otpField.status && resendOn && (
                        <Button
                          color="primary"
                          size="large"
                          // type="submit"
                          onClick={() => sendOtp("resend")}
                          disabled={resendEnable}
                          variant="text"
                        >
                          Resend OTP
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                  {errorStatus && (
                    <Typography
                      sx={{ color: theme.palette.error.light }}
                      gutterBottom
                      variant="body2"
                    >
                      Entered OTP might be wrong please try again
                    </Typography>
                  )}
                  {!otpField.status && (
                    <Box sx={{ py: 2 }}>
                      <Button
                        color="primary"
                        fullWidth
                        size="large"
                        type="submit"
                        disabled={!formik.values.mobile}
                        variant="contained"
                      >
                        Sign Up
                      </Button>
                    </Box>
                  )}
                   {otpField.status && counterEnable && <Counter handleTime={handleCountTime} />}
                  {otpField.status && (
                    <Box sx={{ py: 2 }}>
                      <Button
                        color="primary"
                        fullWidth
                        size="large"
                        type="submit"
                        disabled={!otp}
                        variant="contained"
                      >
                        Sign Up
                      </Button>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Page;
