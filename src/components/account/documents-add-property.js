import { useState, useContext, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../../contexts/auth-context";
import FormLabel from "@mui/material/FormLabel";
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
} from "@mui/material";
// import TaskAltIcon from "@mui/icons-material/TaskAlt";
// import { BasicUploadButton } from "../imageupload/basic-image-upload";
import { filterIdToPost } from "../../utils/method";
// import { ImagesCheckBoxes } from "../imageupload/images-checkbox";
import { CustomizedDialogs } from "../modalpopup/modal-pop-up";
// import { ImageList } from "../customer/images-list";
import { MultiImages } from "../imageupload/multiple-image-upload";
// import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import { FileList } from "../customer/file-list";

export const DocumentsAddProperty = (props) => {
  const {
    filerepocontent,
    postfilerepohandle,
    propertyPostImages,
    propertypostresult,
    handlepropertyiddelete,
    onSubmitCallBackImages,
    deleteImagecallBack,
    backToStepTwo,
  } = props;
  const [shopError, setShopError] = useState(false);
  const [fassaiError, setFassaiError] = useState(false);
  const [gstError, setGstError] = useState(false);
  const [panCardError, setPanCardError] = useState(false);
  const [otherError, setOtherError] = useState(false);
  const [sizeError, setSizeErrorValue] = useState({
    otherDoc: "",
  });
  const [typeError, setTypeErrorValue] = useState({
    otherDoc: "",
  });

  const authContext = useContext(AuthContext);
  const [cancleConfirmationPop, setCancleConfirmationPop] = useState(false);
  const [exteriorTouch, setExteriorTouch] = useState(false);

  const [cancleConfirmation, setCancleConfirmation] = useState(false);
  const [navigate, setNavigate] = useState(false);
  const [urlPath, setUrlPath] = useState(null);

  const router = useRouter();

  const theme = useTheme();

  const validate = Yup.object({
    exterior_gallery: Yup.array().required("Please select property images"),
    exterior_facebook: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: propertypostresult?.name,
      description: propertypostresult?.description,
      email: propertypostresult?.email,
      state: propertypostresult?.state,
      city: propertypostresult?.city,
      country: propertypostresult?.country,
      pin_code: propertypostresult?.pin_code,
      opening_time: propertypostresult?.opening_time,
      closing_time: propertypostresult?.closing_time,
      seating_capacity: propertypostresult?.seating_capacity,
      total_capacity: propertypostresult?.total_capacity,
      fee: propertypostresult?.fee,
      lat: propertypostresult?.lat,
      long: propertypostresult?.long,
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
      exterior_gallery: propertyPostImages?.exterior_gallery,
      interior_gallery: propertyPostImages?.interior_gallery,
      menu_place: propertyPostImages?.menu_place,
      promoter: propertyPostImages?.promoter,
      video_file: propertyPostImages?.video_file,
      property_code: propertyPostImages?.property_code,
      documents: propertypostresult?.documents,
    },
    enableReinitialize: true,
    handleChange: async () => {},
    validationSchema: validate,
    onSubmit: async (values) => {
      const result = { ...values };
      result.documents = filerepocontent;

      if (result.documents.length === 0) {
        setOtherError(true);
      }

      if (result.documents.length !== 0) {
        onSubmitCallBackImages(result);
      }
    },
  });

  const handleSizeError = (errorValue, galleryType) => {
    if (galleryType === "other") {
      const values = { ...sizeError };
      values.otherDoc = errorValue;
      setSizeErrorValue(values);
    }
  };
  const handleTypeError = (errorValue, galleryType) => {
    if (galleryType === "other") {
      const values = { ...sizeError };
      values.otherDoc = errorValue;
      setTypeErrorValue(values);
    }
  };

  const getUpdatedImages = (data, Gallerytype) => {
    if (Gallerytype === "shop-license" && data.length !== 0) {
      setShopError(false);
    }
    if (Gallerytype === "fassi-license" && data.length !== 0) {
      setFassaiError(false);
    }
    if (Gallerytype === "gst-number" && data.length !== 0) {
      setGstError(false);
    }
    if (Gallerytype === "pan-card" && data.length !== 0) {
      setPanCardError(false);
    }
    if (Gallerytype === "other" && data.length !== 0) {
      setOtherError(false);
    }
    postfilerepohandle(data, Gallerytype);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setCancleConfirmationPop(true);
  };

  const handleCancelConfirm = () => {
    handlepropertyiddelete("two");
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
    if (filerepocontent.length !== 0) {
      setOtherError(false);
    }
    if (JSON.stringify(filerepocontent) !== JSON.stringify(formik.values.documents)) {
      setExteriorTouch(true);
    } else {
      setExteriorTouch(false);
    }
  }, [filerepocontent]);

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
    const shouldBlockNavigation = !exteriorTouch;

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
  }, [navigate, exteriorTouch]);

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
              {`Note: Don't put any false or dummy information on ProjectK, as the data is checked before
              its goes online.`}
            </FormLabel>
            <Grid container direction="row" rowSpacing={12} columnSpacing={12}>
              {/* <Grid item md={4} xs={12} ml={4}>
                <FormLabel component="legend" sx={{ ml: 2 }}>
                  Shop License*
                </FormLabel>
                <MultiImages
                  handleImages={getUpdatedImages}
                  galleryType={"shop-license"}
                  typeOfInput="application/pdf"
                  multiple
                  isDisabled
                />
                <FormLabel component="legend" sx={{ ml: 2 }}>
                  FSSAI License*
                </FormLabel>
                <MultiImages
                  handleImages={getUpdatedImages}
                  galleryType={"fssai-license"}
                  typeOfInput="application/pdf"
                  isDisabled
                />
              </Grid>
              <Grid item md={4} xs={12} ml={4}>
                <FormLabel component="legend" sx={{ ml: 2 }}>
                  PAN*
                </FormLabel>
                <MultiImages
                  handleImages={getUpdatedImages}
                  galleryType={"pan-card"}
                  typeOfInput="application/pdf"
                  isDisabled
                />
                <FormLabel component="legend" sx={{ ml: 2 }}>
                  GST Number*
                </FormLabel>
                <MultiImages
                  handleImages={getUpdatedImages}
                  galleryType={"gst-number"}
                  typeOfInput="application/pdf"
                  isDisabled
                />
              </Grid> */}
              <Grid item md={4} xs={12} ml={4}>
                <FormLabel component="legend" sx={{ ml: 2 }}>
                  Other documents
                </FormLabel>
                <MultiImages
                  handleImages={getUpdatedImages}
                  galleryType={"other"}
                  typeOfInput="application/pdf"
                  handleSizeError={handleSizeError}
                  handleTypeError={handleTypeError}
                  isDoc
                />
                {filerepocontent.length > 0 && (
                  <FileList
                    customers={filerepocontent}
                    galleryType="other"
                    handledeleteaction={deleteImagecallBack}
                  />
                )}
                {otherError && (
                  <Typography
                    sx={{ color: theme.palette.error.light, ml: 2, mb: 2 }}
                    gutterBottom
                    variant="body1"
                  >
                    Please submit the property Documents
                  </Typography>
                )}
                {typeError?.otherDoc && (
                  <Typography sx={{ color: theme.palette.error.light, mb: 2, ml: 3 }}>
                    {typeError?.otherDoc}
                  </Typography>
                )}
                {sizeError?.otherDoc && (
                  <Typography sx={{ color: theme.palette.error.light, mb: 2, ml: 3 }}>
                    {sizeError?.otherDoc}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Divider />
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
                  onClick={(e) => handleCancel(e, propertypostresult)}
                  disabled={!exteriorTouch}
                  sx={{
                    "&:focus": {
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
                  onClick={(e) => backToStepTwo(e, propertypostresult)}
                  sx={{
                    "&:focus": {
                      transform: "scale(0.9)",
                    },
                  }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  sx={{
                    "&:focus": {
                      transform: "scale(0.9)",
                    },
                  }}
                >
                  Next
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
          handleconfirmation={() => handleCancelConfirm(propertypostresult)}
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
