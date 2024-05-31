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
  Typography,
  IconButton,
  SvgIcon,
  InputAdornment,
  FormLabel,
} from "@mui/material";
import { CheckBoxCustom } from "../check-box-custom/check-box-custom";
import { Search as SearchIcon } from "../../icons/search";
import {
  formatIncomingPayments,
  formatIncomingFacilities,
  filterIdToPost,
} from "../../utils/method";
import { CustomizedDialogs } from "../modalpopup/modal-pop-up";
import { patchUserRole } from "../../service/account.service";

export const FacilitiesUpdateProperty = (props) => {
  const {
    facilitycontent,
    paymentscontent,
    updatedpropertydata,
    imageupdatedata,
    managerResult,
    searchManagerHandle,
    propertyPostImages,
    handlepropertyiddelete,
    InitialRender,
    onSubmitCallBackFacilities,
    updatedPaymentsData,
    updatedFacilitiesData,
    managerUpdateData,
    documentsupdate,
    backToStepThree,
    otherDocuments,
  } = props;
  const [imageUp, setImageUp] = useState([]);
  const [cardsUp, setCardsUp] = useState([]);
  const [paymentsUp, setPaymentsUp] = useState([]);
  const [cardError, setCardError] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [updatedChecks, setUpdatedChecks] = useState([]);
  const [updatedFacilities, setUpdatedFacilities] = useState([]);
  const [cancleConfirmationPop, setCancleConfirmationPop] = useState(false);
  const [searchManager, setSearchManager] = useState([]);
  const [managerError, setManagerError] = useState(false);
  const [exteriorTouch, setExteriorTouch] = useState(false);
  const [paymentsTouch, setPaymentsTouch] = useState(false)
  const authContext = useContext(AuthContext);
  const theme = useTheme();

  const [cancleConfirmation, setCancleConfirmation] = useState(false);
  const [navigate, setNavigate] = useState(false);
  const [urlPath, setUrlPath] = useState(null);

  const router = useRouter();

  const validate = Yup.object({
    manager: Yup.number(),
    cards: Yup.array().required("Please select your facilities"),
    payments: Yup.array().required("Please select your facilities"),
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
      fee: updatedpropertydata?.fee,
      lat: updatedpropertydata?.lat,
      long: updatedpropertydata?.long,
      user: authContext?.profile?.id,
      payment: [],
      manager: [],
      facilities: [],
      exterior_instagram: imageupdatedata?.exterior_instagram,
      exterior_facebook: imageupdatedata?.exterior_facebook,
      interior_instagram: imageupdatedata?.interior_facebook,
      interior_facebook: imageupdatedata?.interior_facebook,
      instagram: imageupdatedata?.instagram,
      youtube: imageupdatedata?.youtube,
      facebook: imageupdatedata?.facebook,
      twitter: imageupdatedata?.twitter,
      exterior_gallery: filterIdToPost(imageupdatedata?.exterior_gallery),
      interior_gallery: filterIdToPost(imageupdatedata?.interior_gallery),
      menu_place: filterIdToPost(imageupdatedata?.menu_place),
      video_file: filterIdToPost(imageupdatedata?.video_file),
      promoter: filterIdToPost(imageupdatedata?.promoter),
      documents: filterIdToPost(otherDocuments?.documents),
    },
    enableReinitialize: true,
    handleChange: async () => {},
    // validationSchema: validate,
    onSubmit: async (values) => {
      const result = { ...values };
      result.facilities = filterIdToPost(cardsUp);
      // result.manager = filterIdToPost(searchManager);
      result.payment = filterIdToPost(paymentsUp);
      if (cardsUp.length === 0) {
        setCardError(true);
      } else {
        setCardError(false);
      }

      if (paymentsUp.length === 0) {
        setPaymentError(true);
      } else {
        setPaymentError(false);
      }

      // if (result?.manager.length !== 0) {
      //   const role = {
      //     role: [1, 3],
      //   };
      //   const data = await patchUserRole(searchManager[0]?.id, role);
      // }

      if (cardsUp.length !== 0 && paymentsUp.length !== 0) {
        setCardError(false);
        setPaymentError(false);
        onSubmitCallBackFacilities(result);
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

  useEffect(() => {
    if (searchManager.length > 1) {
      setManagerError(true);
    } else {
      setManagerError(false);
    }
  }, [searchManager]);

  const handleManager = (e, data) => {
    e.preventDefault();
    if (data.length === 10) {
      searchManagerHandle(data);
    }
  };

  const handleCancel = (e) => {
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

  useEffect(() => {
    setUpdatedFacilities(formatIncomingFacilities(facilitycontent, updatedFacilitiesData));
  }, [updatedFacilitiesData]);
  useEffect(() => {
    setUpdatedChecks(formatIncomingPayments(paymentscontent, updatedPaymentsData));
  }, [updatedPaymentsData]);

  useEffect(() => {
    InitialRender(managerUpdateData);
  }, []);

  useEffect(() => {
    if (updatedFacilitiesData.length !== cardsUp.length) {
      setExteriorTouch(true);
    } else {
      setExteriorTouch(false);
    }
  }, [updatedFacilitiesData, cardsUp]);
  useEffect(() => {
    if (updatedPaymentsData.length !== paymentsUp.length) {
      setPaymentsTouch(true);
    } else {
      setPaymentsTouch(false);
    }
  }, [updatedPaymentsData, paymentsUp]);

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
              checkBoxesContent={updatedChecks}
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
              checkBoxesContent={updatedFacilities}
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
                helperText="Enter Mobile Number to Select Manager"
                name="manager"
                id="manager"
                sx={{ ml: 2 }}
                onChange={formik.handleChange}
                onKeyDown={(keyEvent) => {
                  if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
                    keyEvent.preventDefault();
                  }
                }}
                placeholder="Select for Manager"
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
              {managerError && (
                <Typography
                  sx={{ color: theme.palette.error.light, pt: 1 }}
                  gutterBottom
                  variant="body1"
                >
                  Please select only one change request for Manager
                </Typography>
              )}
            </Grid> */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "left",
                  p: 3,
                  width: 250,
                }}
              >
                <Button
                  onClick={(e) => handleCancel(e)}
                  disabled={!exteriorTouch && !paymentsTouch}
                  sx={{
                    "&:focus": {
                      outline: "1px black solid",
                      transform: "scale(0.9)",
                    },
                  }}
                >
                  Cancel
                </Button>
              </Box>
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
                      outline: "1px black solid",
                      transform: "scale(0.9)",
                    },
                  }}
                >
                  Back
                </Button>
                <Button
                  // type="submit"
                  onClick={formik.handleSubmit}
                  sx={{
                    "&:focus": {
                      outline: "1px black solid",
                      transform: "scale(0.9)",
                    },
                  }}
                >
                  Update
                </Button>
              </Box>
            </Box>
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
          handleconfirmation={() => handlepropertyiddelete("three")}
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

export default React.memo(FacilitiesUpdateProperty);
