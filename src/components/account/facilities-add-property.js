import { useState, useContext, useEffect, useMemo } from "react";
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
  FormLabel,
} from "@mui/material";
// import { Search as SearchIcon } from "../../icons/search";
import { CheckBoxCustom } from "../check-box-custom/check-box-custom";
import { CustomizedDialogs } from "../modalpopup/modal-pop-up";
import { filterIdToPost } from "../../utils/method";

export const FacilitiesAddProperty = (props) => {
  const {
    facilitycontent,
    paymentscontent,
    searchManagerHandle,
    managerResult,
    propertypostresult,
    handlepropertyiddelete,
    onSubmitCallBackFacilities,
    propertyPostImages,
    backToStepThree,
  } = props;
  const [imageUp, setImageUp] = useState([]);
  const [cardsUp, setCardsUp] = useState([]);
  const [paymentsUp, setPaymentsUp] = useState([]);
  const [cardError, setCardError] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchManager, setSearchManager] = useState([]);
  const authContext = useContext(AuthContext);
  const [cancleConfirmationPop, setCancleConfirmationPop] = useState(false);
  const [exteriorTouch, setExteriorTouch] = useState(false);
  const [paymentsTouch, setPaymentsTouch] = useState(false)
  const theme = useTheme();

  const [cancleConfirmation, setCancleConfirmation] = useState(false);
  const [navigate, setNavigate] = useState(false);
  const [urlPath, setUrlPath] = useState(null);

  const router = useRouter();

  const validate = Yup.object({});

  const formik = useFormik({
    initialValues: {
      name: propertyPostImages?.name,
      description: propertyPostImages?.description,
      email: propertyPostImages?.email,
      state: propertyPostImages?.state,
      city: propertyPostImages?.city,
      country: propertyPostImages?.country,
      pin_code: propertyPostImages?.pin_code,
      opening_time: propertyPostImages?.opening_time,
      closing_time: propertyPostImages?.closing_time,
      seating_capacity: propertyPostImages?.seating_capacity,
      total_capacity: propertyPostImages?.total_capacity,
      fee: propertyPostImages?.fee,
      lat: propertyPostImages?.lat,
      long: propertyPostImages?.long,
      user: authContext?.profile?.id,
      payment: [],
      manager: [],
      facilities: [],
      exterior_instagram: propertyPostImages?.exterior_instagram,
      exterior_facebook: propertyPostImages?.exterior_facebook,
      interior_instagram: propertyPostImages?.interior_facebook,
      interior_facebook: propertyPostImages?.interior_facebook,
      instagram: propertyPostImages?.instagram,
      youtube: propertyPostImages?.youtube,
      facebook: propertyPostImages?.facebook,
      twitter: propertyPostImages?.twitter,
      exterior_gallery: filterIdToPost(propertyPostImages?.exterior_gallery),
      interior_gallery: filterIdToPost(propertyPostImages?.interior_gallery),
      menu_place: filterIdToPost(propertyPostImages?.menu_place),
      promoter: propertyPostImages?.promoter,
      video_file: filterIdToPost(propertyPostImages?.video_file),
      property_code: propertyPostImages?.property_code,
      documents: filterIdToPost(propertyPostImages?.documents),
    },
    // enableReinitialize: true,
    handleChange: async () => {},
    validationSchema: validate,
    onSubmit: async (values) => {
      const result = { ...values };
      result.facilities = filterIdToPost(cardsUp);
      result.manager = filterIdToPost(searchManager);
      result.payment = filterIdToPost(paymentsUp);
      if (result.facilities.length === 0) {
        setCardError(true);
      } else {
        setCardError(false);
      }

      if (result.payment.length === 0) {
        setPaymentError(true);
      } else {
        setPaymentError(false);
      }

      if (result.facilities.length !== 0 && result.payment.length !== 0) {
        setCardError(false);
        setPaymentError(false);
        setPaymentsTouch(false);
        setExteriorTouch(false);
        onSubmitCallBackFacilities(result, propertypostresult?.id);
      }
    },
  });

  const getUpdatedPayments = (data) => {
    const isSelectedValues = data.filter((item) => item?.isSelected);
    if (isSelectedValues.length === 0) {
      setPaymentsUp(isSelectedValues);
    }

    if (isSelectedValues.length !== 0) {
      setPaymentsUp(isSelectedValues);
      setPaymentError(false);
    }
  };

  const getUpdatedFacilities = (data) => {
    const isSelectedValues = data.filter((item) => item?.isSelected);

    if (isSelectedValues.length === 0) {
      setCardsUp(isSelectedValues);
    }

    if (isSelectedValues.length !== 0) {
      setCardsUp(isSelectedValues);
      setCardError(false);
    }
  };

  const getUpdatedManager = (data) => {
    const updatedManager = data.filter((item) => item?.isSelected);

    setSearchManager(updatedManager);
  };

  const handleManager = (e, data) => {
    e.preventDefault();
    if (data.length === 10) {
      searchManagerHandle(data);
    }
  };

  const handleCancel = (e, propId) => {
    e.preventDefault();
    setCancleConfirmationPop(true);
  };
  const bodyCompPop = () => {
    return (
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="subtitle1">Are you sure to cancel</Typography>
        <Typography sx={{ fontSize: 14, mt: "8px" }} gutterBottom>
          All data you have entered will be lost
        </Typography>
      </Box>
    );
  };

  const handleCancelConfirm = () => {
    handlepropertyiddelete('three')
  }

  useEffect(() => {
    if (formik.values.facilities.length !== cardsUp.length) {
      setExteriorTouch(true);
    } else {
      setExteriorTouch(false);
    }
  }, [cardsUp]);
  useEffect(() => {
    if (formik.values.payment.length !== paymentsUp.length) {
      setPaymentsTouch(true);
    } else {
      setPaymentsTouch(false);
    }
  }, [paymentsUp]);

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
    const shouldBlockNavigation = !exteriorTouch && !paymentsTouch;

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
  }, [navigate, exteriorTouch, paymentsTouch]);

  const handleConfirm = () => {
    setNavigate(true);
    void router.push(urlPath);
  };


  return (
    <>
      <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
        <Box sx={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }} mt={3}>
          <Card sx={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
            <CheckBoxCustom
              titleClass={{ m: 4 }}
              checkBoxTitle={"Payment Methods*"}
              checkBoxesContent={paymentscontent}
              handleName={getUpdatedPayments}
            />
            {paymentError && (
              <Typography
                sx={{ color: theme.palette.error.light, ml: 3 }}
                gutterBottom
                variant="body1"
              >
                Please select payment methods
              </Typography>
            )}
            <Divider />
            <CheckBoxCustom
              titleClass={{ m: 4 }}
              ischeckAll
              checkBoxesContent={facilitycontent}
              checkBoxTitle={"Available Facilities*"}
              handleName={getUpdatedFacilities}
            />
            {cardError && (
              <Typography
                sx={{ color: theme.palette.error.light, ml: 3 }}
                gutterBottom
                variant="body1"
              >
                Please select available facilities
              </Typography>
            )}
            {/* <Divider />
            <Grid item md={6} xs={6} ml={2}>
              <FormLabel component="legend" sx={{ m: 3 }}>
                Select for Manager
              </FormLabel>
              <TextField
                error={formik.touched.manager && Boolean(formik.errors.manager)}
                helperText="Enter Mobile Number to Update Manager"
                name="manager"
                id="manager"
                sx={{ ml: 2 }}
                onChange={formik.handleChange}
                onKeyDown={(keyEvent) => {
                  if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
                    keyEvent.preventDefault();
                  }
                }}
                placeholder="Search for Manager"
                variant="outlined"
              />
              <Button
                onClick={(e) => {
                  handleManager(e, formik.values.manager);
                }}
                sx={{ p: 2, ml: 2 }}
                variant="contained"
                disabled={formik.values.manager.length <= 9 || formik.values.manager.length >= 11}
              >
                Search
              </Button>
              <CheckBoxCustom
                titleClass={{ m: 4 }}
                checkBoxesContent={managerResult}
                // checkBoxTitle={"Select Manager"}
                handleName={getUpdatedManager}
              />
            </Grid> */}
            <Grid
              container
              spacing={3}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 1,
              }}
            >
              <Grid item>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    p: 3,
                  }}
                >
                  <Button
                    onClick={(e) => handleCancel(e, propertypostresult?.id)}
                    disabled={!exteriorTouch && !paymentsTouch}
                    sx={{
                      
                      "&:focus": {
                        transform: "scale(0.9)",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    display: "flex",
                    columnGap: 2,
                    p: 3,
                  }}
                >
                  <Button
                    onClick={(e) => backToStepThree(e)}
                    sx={{
                      "&:focus": {
                        transform: "scale(0.9)",
                      },
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={formik.handleSubmit}
                    sx={{
                      "&:focus": {
                        transform: "scale(0.9)",
                      },
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Box>
      </form>
      {cancleConfirmationPop && (
        <CustomizedDialogs
          isOpen={cancleConfirmationPop}
          setIsOpen={setCancleConfirmationPop}
          renderComponent={bodyCompPop}
          confirmtext={"Yes"}
          canceltext={"No"}
          handleconfirmation={() => handleCancelConfirm(propertypostresult?.id)}
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
