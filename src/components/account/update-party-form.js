import { useState, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../../contexts/auth-context";
import { useFormik, FormikProvider } from "formik";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { ImageUploadButton } from "../imageupload/images-upload";
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
import { CheckBoxCustom } from "../check-box-custom/check-box-custom";
import Checkbox from "@mui/material/Checkbox";
import {
  filterIdToPost,
  formatIncomingPayments,
  formatIncomingFacilities,
  formateUpdatedImagesGet,
} from "../../utils/method";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import { CustomizedDialogs } from "../modalpopup/modal-pop-up";
import { MultiImages } from "../imageupload/multiple-image-upload";
import { ImageList } from "../customer/images-list";
import FormLabel from "@mui/material/FormLabel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export const UpdateParty = (props) => {
  const {
    profiledata,
    onSubmitCallBack,
    propertlistdata,
    imagesUploadedData,
    postfilerepohandle,
    handleClosePopUpCallBack,
    videoFile,
    handleSave,
    postimages,
    termsContent,
    musicTypelistdata,
    entryTypeCon,
    drinkListData,
    updatePartyDetail,
    updatedEntryType,
    updatedMusicType,
    updatedDrinksType,
    handlecancel,
    isCANCEL,
    deleteImagecallBack,
    initPartyProp,
  } = props;
  const [open, setOpen] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [termsCheck, setTermsChecks] = useState(termsContent);
  const [termsError, setTermsError] = useState(false);
  const inputRef = useRef(null);
  const [checked, setChecked] = useState(false);
  const [checkCover, setCheckedCover] = useState(false);
  const [modalExteriorOpen, setModalExteriorOpen] = useState(false);

  const [updateMusicCheck, setUpdateMusicCheck] = useState([]);
  const [musicError, setMusicValidError] = useState(false);
  const [updateEntryCheck, setUpdateEntryCheck] = useState([]);
  const [entryError, setEntryValidError] = useState(false);
  const [updateDrinksCheck, setUpdateDrinksCheck] = useState([]);
  const [drinksError, setDrinksValidError] = useState(false);

  const [updatedMusicChecks, setUpdatedMusicChecks] = useState([]);
  const [updatedEntryChecks, setUpdatedEntryChecks] = useState([]);
  const [updatedDrinksChecks, setUpdatedDrinksChecks] = useState([]);

  const [formTouch, setFormTouch] = useState(false);
  const [imageTouch, setImageTouch] = useState(false);
  const [videoTouch, setVideoTouch] = useState(false);
  const [musicTouch, setMusicTouch] = useState(false);
  const [drinkTouch, setDrinkTouch] = useState(false);
  const [entryTouch, setEntryTouch] = useState(false);

  const [cancleConfirmation, setCancleConfirmation] = useState(false);
  const [navigate, setNavigate] = useState(false);
  const [urlPath, setUrlPath] = useState(null);

  const [isSubmitted, setIsSubmitted] = useState(true);

  const router = useRouter();

  const initPartyPropData = {
    party_name: initPartyProp?.party_name,
    start_date: initPartyProp?.start_date,
    end_date: initPartyProp?.end_date,
    cover_charge: initPartyProp?.cover_charge ? initPartyProp?.cover_charge : "",
    entry_charge: initPartyProp?.entry_charge ? initPartyProp?.entry_charge : "",
    property: initPartyProp?.property?.id,
    // entry_type: initPartyProp?.entry_type,
    // music_type: initPartyProp?.music_type,
    // drink_type: initPartyProp?.drink_type,
    discount: initPartyProp?.discount,
  };

  const initPartImages = {
    image: formateUpdatedImagesGet(initPartyProp?.image),
    party_video_file: formateUpdatedImagesGet(initPartyProp?.party_video_file),

  }
  const [errorVideo, setErrorVideo] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const [sizeError, setSizeError] = useState({
    exteriorGallery: "",
    interiorGallery: "",
    menuPlaces: "",
    videoGallery: "",
  });
  const [typeError, setTypeError] = useState({
    exteriorGallery: "",
    interiorGallery: "",
    menuPlaces: "",
    videoGallery: "",
  });

  const handleChange = (event) => {
    setChecked(event.target.checked);
    setCheckedCover(!event.target.checked);
  };

  const handleChangeCover = (event) => {
    setCheckedCover(event.target.checked);
    setChecked(!event.target.checked);
  };

  const authContext = useContext(AuthContext);
  const theme = useTheme();

  const validate = Yup.object({
    party_name: Yup.string().required("Party name is mandatory"),
    start_date: Yup.date().required("Start date cannot be empty"),
    end_date: Yup.date()
      .required("End date cannot be empty")
      .when("start_date", (start_date, schema) => {
        if (start_date) {
          const dayAfter = new Date(start_date.getTime() + 59999);
          const twoAfter = new Date(start_date.getTime() + 172800000);
          return schema.min(dayAfter, "End date should be ahead of Start date").max(twoAfter, "End date can't be greater than two days");
        }
        return schema;
      }),
    entry_charge: checked
      ? Yup.string()
          .matches(/^\d+$/, "Only numeric values are allowed")
          .required("Either Entry charge or Cover charge is mandatory")
          .min(1, "Charges must be greater than or equal to 1")
          .max(8, "Charges must be less than or equal to 99999999")
      : null,
    cover_charge: checkCover
      ? Yup.string()
          .matches(/^\d+$/, "Only numeric values are allowed")
          .required("Either Entry charge or Cover charge is mandatory")
          .min(1, "Charges must be greater than or equal to 1")
          .max(8, "Charges must be less than or equal to 99999999")
      : null,
    property: Yup.string().required("Property is mandatory"),
    discount: Yup.string()
      .matches(/^\d+$/, "Only numeric values are allowed")
      .required("Discount is mandatory")
      .min(1, "Discount must be greater than or equal to 1")
      .max(3, "Discount must be less than or equal to 999"),
  });

  const formik = useFormik({
    initialValues: {
      party_name: updatePartyDetail?.party_name,
      start_date: updatePartyDetail?.start_date,
      end_date: updatePartyDetail?.end_date,
      cover_charge: updatePartyDetail?.cover_charge ? updatePartyDetail?.cover_charge : "",
      entry_charge: updatePartyDetail?.entry_charge ? updatePartyDetail?.entry_charge : "",
      property: updatePartyDetail?.property?.id,
      // entry_type: [],
      // music_type: [],
      // drink_type: [],
      discount: updatePartyDetail?.discount,
    },
    enableReinitialize: true,
    validationSchema: validate,
    onSubmit: async (values) => {
      const resValues = { ...values };
      resValues.start_date = formateData(resValues?.start_date);
      resValues.end_date = formateData(resValues?.end_date);
      resValues.entry_charge = checked ? resValues?.entry_charge : "";
      resValues.cover_charge = checkCover ? resValues?.cover_charge : "";
      resValues.image = filterIdToPost(imagesUploadedData);
      resValues.music_type = filterIdToPost(updateMusicCheck);
      resValues.entry_type = filterIdToPost(updateEntryCheck);
      resValues.drink_type = filterIdToPost(updateDrinksCheck);
      resValues.party_video_file = filterIdToPost(videoFile);
      resValues.terms_conditions = termsCheck;

      if (
        resValues.music_type.length === 0 &&
        resValues.entry_type.length === 0 &&
        resValues.drink_type.length === 0
      ) {
        setMusicValidError(true);
        setEntryValidError(true);
        setDrinksValidError(true);
      } else {
        setMusicValidError(false);
        setEntryValidError(false);
        setDrinksValidError(false);
      }

      if (resValues.image.length !== 0) {
        setImageError(false);
      } else {
        setImageError(true);
      }

      if (resValues.image.length !== 0) {
        setImageError(false);
      } else {
        setImageError(true);
      }

      if (resValues.party_video_file.length !== 0) {
        setErrorVideo(false);
      } else {
        setErrorVideo(true);
      }

      if (resValues.terms_conditions.length >= 1) {
        setTermsError(false);
      } else {
        setTermsError(true);
      }
      if (
        resValues?.image.length !== 0 &&
        resValues?.terms_conditions.length >= 1 &&
        resValues?.music_type.length !== 0 &&
        resValues?.entry_type.length !== 0 &&
        resValues?.drink_type.length !== 0 &&
        resValues?.party_video_file.length !== 0
      ) {
        setMusicValidError(false);
        setEntryValidError(false);
        setDrinksValidError(false);
        setErrorVideo(false);
        setFormTouch(false);
        setImageTouch(false);
        setVideoTouch(false);
        setDrinkTouch(false);
        setEntryTouch(false);
        setIsSubmitted(false);
        onSubmitCallBack(resValues);
      }
    },
  });

  const formateData = (newValue) => {
    const date = new Date(newValue);

    // const dateMDY = `${date.getFullYear()}-${
    //   date.getMonth() + 1
    // }-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}|Z`;
    return date.toISOString();
  };

  const getUpdatedImages = (data, Gallerytype) => {
    if (Gallerytype === "exterior" && data.length !== 0) {
      setImageError(false);
    }
    if (Gallerytype === "videoupload" && data.length !== 0) {
      setErrorVideo(false);
    }
    postfilerepohandle(data, Gallerytype);
  };

  const handleSizeError = (errorValue, galleryType) => {
    if (galleryType === "exterior") {
      const values = { ...sizeError };
      values.exteriorGallery = errorValue;
      setSizeError(values);
    }
    if (galleryType === "videoupload") {
      const values = { ...sizeError };
      values.videoGallery = errorValue;
      setSizeError(values);
    }
  };
  const handleTypeError = (errorValue, galleryType) => {
    if (galleryType === "exterior") {
      const values = { ...sizeError };
      values.exteriorGallery = errorValue;
      setTypeError(values);
    }
    if (galleryType === "videoupload") {
      const values = { ...sizeError };
      values.videoGallery = errorValue;
      setTypeError(values);
    }
  };

  const getUpdatedTerms = (data) => {
    const isSelectedValues = data.filter((item) => item?.isSelected);
    if (isSelectedValues.length === 0) {
      setTermsChecks(filterIdToPost(isSelectedValues));
    }

    if (isSelectedValues.length !== 0) {
      setTermsChecks(filterIdToPost(isSelectedValues));
      setTermsError(false);
    }
  };

  const getUpdatedMusic = (data) => {
    const isSelectedValues = data.filter((item) => item?.isSelected);
    if (isSelectedValues.length === 0) {
      setUpdateMusicCheck(isSelectedValues);
    }

    if (isSelectedValues.length !== 0) {
      setUpdateMusicCheck(isSelectedValues);
      setMusicValidError(false);
    }
  };

  const getUpdatedEntryType = (data) => {
    const isSelectedValues = data.filter((item) => item?.isSelected);
    if (isSelectedValues.length === 0) {
      setUpdateEntryCheck(isSelectedValues);
    }

    if (isSelectedValues.length !== 0) {
      setUpdateEntryCheck(isSelectedValues);
      setEntryValidError(false);
    }
  };

  const getUpdatedDrinks = (data) => {
    const isSelectedValues = data.filter((item) => item?.isSelected);
    if (isSelectedValues.length === 0) {
      setUpdateDrinksCheck(isSelectedValues);
    }

    if (isSelectedValues.length !== 0) {
      setUpdateDrinksCheck(isSelectedValues);
      setDrinksValidError(false);
    }
  };

  const handleTermsCancel = () => {
    setTermsError(false);
  };

  const handleCancelModal = (modalType) => {
    if (modalType === "exterior") {
      setModalExteriorOpen(false);
    }
    if (modalType === "videoupload") {
      setVideoOpen(false);
    }
  };

  const uploadButton = (galleryType) => {
    return (
      <>
        <ImageList
          customers={imagesUploadedData}
          galleryType={galleryType}
          handledeleteaction={deleteImagecallBack}
          sizeError={sizeError.exteriorGallery}
          typeError={typeError.exteriorGallery}
        />
      </>
    );
  };

  const uploadVideo = (galleryType) => {
    return (
      <>
        <ImageList
          customers={videoFile}
          galleryType={galleryType}
          handledeleteaction={deleteImagecallBack}
          videoFileType
          sizeError={sizeError.videoGallery}
          typeError={typeError.videoGallery}
          isVideo
        />
      </>
    );
  };

  const footerComponentUpload = (valueType, typeOfInput) => {
    const isVideoFile = valueType === "videoupload" ? true : false;
    return (
      <Box sx={{ display: "flex", justifyContent: "space-around" }}>
        <Button
          component="label"
          sx={{ margin: 2, backgroundColor: "#f5f5f5", border: "1.5px solid grey" }}
          onClick={() => handleCancelModal(valueType)}
        >
          Close
        </Button>
        <MultiImages
          handleImages={getUpdatedImages}
          galleryType={valueType}
          typeOfInput={typeOfInput}
          handleSizeError={handleSizeError}
          handleTypeError={handleTypeError}
          isVideo={isVideoFile}
        />
      </Box>
    );
  };

  const handleVideoClick = (videoupload) => {
    setVideoOpen(true);
    // handleOnClickSection(videoupload);
  };

  const handleExteriorGalleryClick = (exterior) => {
    setModalExteriorOpen(true);
    // handleOnClickSection(exterior);
  };

  useEffect(() => {
    setUpdatedMusicChecks(formatIncomingPayments(musicTypelistdata, updatedMusicType));
  }, [updatedMusicType]);

  useEffect(() => {
    if(updatedMusicType.length !== updateMusicCheck.length) {
      setMusicTouch(true)
     } else {
       setMusicTouch(false)
     }
  }, [updatedMusicType, updateMusicCheck])

  useEffect(() => {
    if(updatedDrinksType.length !== updateDrinksCheck.length) {
      setDrinkTouch(true)
     } else {
       setDrinkTouch(false)
     }
  }, [updatedDrinksType, updateDrinksCheck])

  useEffect(() => {
    if(updatedEntryType.length !== updateEntryCheck.length) {
      setEntryTouch(true)
     } else {
      setEntryTouch(false)
     }
  }, [updatedEntryType, updateEntryCheck])

  useEffect(() => {
    setUpdatedEntryChecks(formatIncomingPayments(entryTypeCon, updatedEntryType));
  }, [updatedEntryType]);

  useEffect(() => {
    setUpdatedDrinksChecks(formatIncomingPayments(drinkListData, updatedDrinksType));
  }, [updatedDrinksType]);

  useEffect(() => {
    if (updatePartyDetail?.entry_charge) {
      setChecked(true);
      setCheckedCover(false);
    }
    if (updatePartyDetail?.cover_charge) {
      setCheckedCover(true);
      setChecked(false);
    }
  }, [updatePartyDetail]);

  useEffect(() => {
    if (imagesUploadedData && imagesUploadedData.length !== 0) {
      setImageError(false);
    }
    if (JSON.stringify(imagesUploadedData) !== JSON.stringify(initPartImages?.image)) {
      setImageTouch(true);
    } else {
      setImageTouch(false);
    }

    if (videoFile && videoFile.length !== 0) {
      setErrorVideo(false);
    }

    if (JSON.stringify(videoFile) !== JSON.stringify(initPartImages?.party_video_file)) {
      setVideoTouch(true);
    } else {
      setVideoTouch(false);
    }
  }, [imagesUploadedData, videoFile, initPartyProp]);

  useEffect(() => {
    if (JSON.stringify(formik.values) !== JSON.stringify(initPartyPropData)) {
      setFormTouch(true);
    } else {
      setFormTouch(false);
    }
  }, [initPartyPropData, formik.values]);

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
    const shouldBlockNavigation =
      !formTouch && !imageTouch && !videoTouch && !musicTouch && !entryTouch && !drinkTouch;

    const nativeBrowserHandler = (event) => {
      if (!shouldBlockNavigation) {
        event.preventDefault();
        event.returnValue = "Are you sure you want to leave?";
      }
    };

    const nextNavigationHandler = (url) => {
      setUrlPath(url);
      if (!shouldBlockNavigation && isSubmitted) {
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
  }, [navigate, formTouch, imageTouch, videoTouch, musicTouch, entryTouch, drinkTouch]);

  const handleConfirm = () => {
    setNavigate(true);
    void router.push(urlPath);
  };

  return (
    <>
    <FormikProvider value={formik}>
      <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
        <Box sx={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
          <Card sx={{ background: "" }}>
            <CardContent>
              <Grid container spacing={6} p={1}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.party_name && Boolean(formik.errors.party_name)}
                    helperText={formik.touched.party_name && formik.errors.party_name}
                    label="Party Name"
                    id="party_name"
                    name="party_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formik.values.party_name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.property && Boolean(formik.errors.property)}
                    helperText={formik.touched.property && formik.errors.property}
                    label="Select Property"
                    id="property"
                    name="property"
                    inputRef={inputRef}
                    value={formik.values.property}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    select
                    SelectProps={{ native: true }}
                    hiddenLabel
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                  >
                    {propertlistdata.length >= 0 && (
                      <option key={`default-value`} value="">
                        {"Select"}
                      </option>
                    )}
                    {propertlistdata &&
                      propertlistdata.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                  </TextField>
                </Grid>
                <Grid item md={6} xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      open={open}
                      onOpen={() => setOpen(true)}
                      onClose={() => setOpen(false)}
                      label="Start Date"
                      value={formik.values.start_date}
                      onChange={(value) => {
                        formik.setFieldValue("start_date", value);
                      }}
                      disablePast
                      renderInput={(params) => {
                        return (
                          <TextField
                            {...params}
                            fullWidth
                            id="start_date"
                            name="start_date"
                            required
                            error={formik.touched.start_date && Boolean(formik.errors.start_date)}
                            helperText={formik.touched.start_date && formik.errors.start_date}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onBlur={formik.handleBlur}
                            onClick={(e) => setOpen(true)}
                            onKeyDown={(e) => e.preventDefault()}
                          />
                        );
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item md={6} xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      open={openEndDate}
                      onOpen={() => setOpenEndDate(true)}
                      onClose={() => setOpenEndDate(false)}
                      label="End Date"
                      value={formik.values.end_date}
                      onChange={(value) => {
                        formik.setFieldValue("end_date", value);
                      }}
                      minDate={formik.values.start_date}
                      renderInput={(params) => {
                        return (
                          <TextField
                            {...params}
                            fullWidth
                            id="end_date"
                            name="end_date"
                            required
                            error={formik.touched.end_date && Boolean(formik.errors.end_date)}
                            helperText={formik.touched.end_date && formik.errors.end_date}
                            onBlur={formik.handleBlur}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onClick={(e) => setOpenEndDate(true)}
                            onKeyDown={(e) => e.preventDefault()}
                            // {...params}
                          />
                        );
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item md={6} xs={12} sx={{ display: "flex", alignItems: "baseline" }}>
                  <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                  <TextField
                    fullWidth
                    error={formik.touched.entry_charge && Boolean(formik.errors.entry_charge)}
                    helperText={formik.touched.entry_charge && formik.errors.entry_charge}
                    label="Entry Charges"
                    id="entry_charge"
                    name="entry_charge"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    // onFocus={!checked}
                    required={checked}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={!checked}
                    InputProps={{
                      readOnly: !checked,
                    }}
                    value={formik.values.entry_charge}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12} sx={{ display: "flex", alignItems: "baseline" }}>
                  <Checkbox
                    label="Cover charge"
                    checked={checkCover}
                    onChange={handleChangeCover}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                  <TextField
                    fullWidth
                    error={formik.touched.cover_charge && Boolean(formik.errors.cover_charge)}
                    helperText={formik.touched.cover_charge && formik.errors.cover_charge}
                    label="Cover Charges"
                    id="cover_charge"
                    name="cover_charge"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    // onFocus={!checkCover}
                    required={checkCover}
                    disabled={!checkCover}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: !checkCover,
                    }}
                    value={formik.values.cover_charge}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.discount && Boolean(formik.errors.discount)}
                    helperText={formik.touched.discount && formik.errors.discount}
                    label="Discount in %"
                    id="discount"
                    name="discount"
                    onChange={formik.handleChange}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formik.values.discount}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                  <FormLabel component="legend" sx={{ m: 3 }}>
                    Party Gallery*
                  </FormLabel>
                  <Button
                    variant="contained"
                    component="label"
                    // color={selectedIcon ? "success" : "primary"}
                    onClick={() => handleExteriorGalleryClick("exterior")}
                    sx={{
                      "&:focus": {
                        transform: "scale(0.9)",
                      },
                      ml: 3,
                    }}
                    startIcon={<FolderCopyIcon />}
                  >
                    Choose files
                  </Button>
                  {imagesUploadedData.length > 0 && (
                    <CheckCircleIcon
                      sx={{ color: theme.palette.success.light, ml: 1 }}
                      fontSize="small"
                    />
                  )}
                  {modalExteriorOpen && (
                    <CustomizedDialogs
                      isOpen={modalExteriorOpen}
                      // handleClosePopUpCallBack={handleClosePopUpCallBack}
                      setIsOpen={setModalExteriorOpen}
                      isExteriorFlag={"exterior"}
                      modalTitle={"Images Gallery"}
                      customstyle={{
                        width: "750px",
                        height: "350px",
                      }}
                      // handleconfirmation={handleconfirmation}
                      renderComponent={() => uploadButton("exterior")}
                      footerComponent={() => footerComponentUpload("exterior", "image/*")}
                    />
                  )}

                  {imageError && (
                    <Typography
                      sx={{ color: theme.palette.error.light, pt: 2, pl: 3 }}
                      gutterBottom
                      variant="body1"
                    >
                      Please select Party images
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={6}>
                  <FormLabel component="legend" sx={{ m: 3 }}>
                    Video Upload*
                  </FormLabel>
                  <Button
                    variant="contained"
                    component="label"
                    onClick={() => handleVideoClick("videoupload")}
                    sx={{
                      "&:focus": {
                        transform: "scale(0.9)",
                      },
                      ml: 3,
                    }}
                    startIcon={<FolderCopyIcon />}
                  >
                    Choose Video
                  </Button>
                  {videoFile.length > 0 && (
                    <CheckCircleIcon
                      sx={{ color: theme.palette.success.light, ml: 1 }}
                      fontSize="small"
                    />
                  )}
                  {videoOpen && (
                    <CustomizedDialogs
                      isOpen={videoOpen}
                      setIsOpen={setVideoOpen}
                      // handleClosePopUpCallBack={handleClosePopUpCallBack}
                      isExteriorFlag={"videoupload"}
                      modalTitle={"Videos Gallery"}
                      customstyle={{
                        width: "750px",
                        height: "350px",
                      }}
                      // handleconfirmation={handleconfirmation}
                      renderComponent={() => uploadVideo("videoupload")}
                      footerComponent={() => footerComponentUpload("videoupload", "video/*")}
                    />
                  )}

                  {errorVideo && (
                    <Typography
                      sx={{ color: theme.palette.error.light, pt: 2, pl: 3 }}
                      gutterBottom
                      variant="body1"
                    >
                      Please select property videos
                    </Typography>
                  )}
                </Grid>

                <Grid item md={10} xs={12}>
                  <CheckBoxCustom
                    titleClass={{ ml: 4 }}
                    checkBoxTitle={"Music Genre*"}
                    checkBoxesContent={updatedMusicChecks}
                    handleName={getUpdatedMusic}
                  />
                  {musicError && (
                    <label>
                      <Typography
                        sx={{ color: theme.palette.error.light, ml: 3 }}
                        gutterBottom
                        variant="body1"
                      >
                        Please select Music Genre
                      </Typography>
                    </label>
                  )}
                </Grid>

                <Grid item md={10} xs={12}>
                  <CheckBoxCustom
                    titleClass={{ ml: 4 }}
                    checkBoxTitle={"Entry Tpye*"}
                    checkBoxesContent={updatedEntryChecks}
                    handleName={getUpdatedEntryType}
                  />
                  {entryError && (
                    <label>
                      <Typography
                        sx={{ color: theme.palette.error.light, ml: 3 }}
                        gutterBottom
                        variant="body1"
                      >
                        Please select Entry type
                      </Typography>
                    </label>
                  )}
                </Grid>

                <Grid item md={10} xs={12}>
                  <CheckBoxCustom
                    titleClass={{ ml: 4 }}
                    checkBoxTitle={"Drinks*"}
                    checkBoxesContent={updatedDrinksChecks}
                    handleName={getUpdatedDrinks}
                  />
                  {drinksError && (
                    <label>
                      <Typography
                        sx={{ color: theme.palette.error.light, ml: 3 }}
                        gutterBottom
                        variant="body1"
                      >
                        Please select Drinks
                      </Typography>
                    </label>
                  )}
                </Grid>

                <Grid item md={12} xs={6}>
                  <CheckBoxCustom
                    titleClass={{ m: 4 }}
                    checkBoxTitle={"Terms & Conditions*"}
                    checkBoxesContent={termsContent}
                    handleName={getUpdatedTerms}
                  />
                  {termsError && (
                    <label>
                      <Typography
                        sx={{ color: theme.palette.error.light, ml: 3 }}
                        gutterBottom
                        variant="body1"
                      >
                        Please select Terms & Conditions
                      </Typography>
                    </label>
                  )}
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
                onClick={(e) => {
                  handleTermsCancel();
                  formik.resetForm();
                  handlecancel(e);
                }}
                disabled={!formTouch && !imageTouch && !videoTouch && !entryTouch && !drinkTouch && !musicTouch}
                sx={{
                  "&:focus": {
                    transform: "scale(0.9)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                disabled={!formTouch && !imageTouch && !videoTouch && !entryTouch && !drinkTouch && !musicTouch}
                sx={{
                  "&:focus": {
                    transform: "scale(0.9)",
                  },
                }}
                type="submit"
              >
                Update Party
              </Button>
            </Box>
          </Card>
        </Box>
      </form>
    </FormikProvider>
    {cancleConfirmation && (
        <CustomizedDialogs
          isOpen={cancleConfirmation}
          setIsOpen={setCancleConfirmation}
          renderComponent={bodyComp}
          confirmtext={"Yes"}
          canceltext={"No"}
          modalTitle="Leave Page?"
          handleconfirmation={() => handleConfirm()}
        />
      )}
    </>
  );
};
