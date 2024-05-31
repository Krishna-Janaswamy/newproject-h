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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
  Checkbox,
  FormLabel,
} from "@mui/material";
import { CheckBoxCustom } from "../check-box-custom/check-box-custom";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import { CustomizedDialogs } from "../modalpopup/modal-pop-up";
import { MultiImages } from "../imageupload/multiple-image-upload";
import { ImageList } from "../customer/images-list";
import {
  filterIdToPost,
  formatIncomingPayments,
  formatIncomingFacilities,
  formateUpdatedImagesGet,
} from "../../utils/method";

export const UpdateFlashDeal = (props) => {
  const {
    profiledata,
    onSubmitCallBack,
    propertlistdata,
    imagesUploadedData,
    postfilerepohandle,
    musicTypelistdata,
    entryTypeCon,
    drinkListData,
    videoFile,
    handleSave,
    postImages,
    termsContent,
    updatePartyDetail,
    updatedEntryType,
    updatedMusicType,
    updatedDrinksType,
    handleCancel,
    deleteImagecallBack,
    isCANCEL,
    brandTypesContent,
    imageProp,
    videoProp,
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

  const [errorVideo, setErrorVideo] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const [formTouch, setFormTouch] = useState(false);
  const [imageTouch, setImageTouch] = useState(false);
  const [videoTouch, setVideoTouch] = useState(false);
  const [musicTouch, setMusicTouch] = useState(false);
  const [drinkTouch, setDrinkTouch] = useState(false);
  const [entryTouch, setEntryTouch] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(true);

  const [cancleConfirmation, setCancleConfirmation] = useState(false);
  const [navigate, setNavigate] = useState(false);
  const [urlPath, setUrlPath] = useState(null);

  const router = useRouter();

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

  const authContext = useContext(AuthContext);
  const theme = useTheme();

  const initPartyPropData = {
    deal_name: updatePartyDetail?.deal_name,
    property: updatePartyDetail?.property,
    brand_type: updatePartyDetail?.brand_type,
    start_date: updatePartyDetail?.start_date,
    end_date: updatePartyDetail?.end_date,
    entry_price: updatePartyDetail?.entry_price !== null ? updatePartyDetail.entry_price : "",
    cover_charge: updatePartyDetail?.cover_charge !== null ? updatePartyDetail?.cover_charge : "",
    discount: updatePartyDetail?.discount,
  };

  const initPartImages = {
    image: formateUpdatedImagesGet(imageProp?.image),
    flash_deal_video_file: formateUpdatedImagesGet(imageProp?.flash_deal_video_file),
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
    setCheckedCover(!event.target.checked);
  };

  const handleChangeCover = (event) => {
    setCheckedCover(event.target.checked);
    setChecked(!event.target.checked);
  };

  const validate = Yup.object({
    deal_name: Yup.string().required("Party name is mandatory"),
    start_date: Yup.date().required("Start time cannot be empty"),
    end_date: Yup.date()
      .required("End date cannot be empty")
      .when("start_date", (start_date, schema) => {
        if (start_date) {
          const twoAfter = new Date(start_date.getTime() + 172800000);
          return schema.min(dayAfter, "End date should be ahead of Start date").max(twoAfter, "End date can't be greater than two days");
        }
        return schema;
      }),
    brand_type: Yup.string().required("Brand is mandatory"),
    entry_price: checked
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
      deal_name: updatePartyDetail?.deal_name,
      property: updatePartyDetail?.property,
      brand_type: updatePartyDetail?.brand_type,
      start_date: updatePartyDetail?.start_date,
      end_date: updatePartyDetail?.end_date,
      entry_price: updatePartyDetail?.entry_price ? updatePartyDetail?.entry_price : "",
      cover_charge: updatePartyDetail?.cover_charge ? updatePartyDetail?.cover_charge : "",
      discount: updatePartyDetail?.discount,
    },
    enableReinitialize: true,
    validationSchema: validate,
    onSubmit: async (values) => {
      const resValues = { ...values };
      resValues.entry_price = checked ? resValues?.entry_price : null;
      resValues.cover_charge = checkCover ? resValues?.cover_charge : null;
      resValues.terms_conditions = termsCheck;
      resValues.music_type = filterIdToPost(updateMusicCheck);
      resValues.entry_type = filterIdToPost(updateEntryCheck);
      resValues.drink_type = filterIdToPost(updateDrinksCheck);
      resValues.image = filterIdToPost(imagesUploadedData);
      resValues.flash_deal_video_file = filterIdToPost(videoFile);
      resValues.brand_type = [resValues?.brand_type];

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
        resValues?.flash_deal_video_file !== 0
      ) {
        setFormTouch(false);
        setVideoTouch(false);
        setImageTouch(false);
        setEntryTouch(false);
        setDrinkTouch(false);
        setMusicTouch(false);
        setMusicValidError(false);
        setEntryValidError(false);
        setDrinksValidError(false);
        setErrorVideo(false);
        setIsSubmitted(false);
        onSubmitCallBack(resValues);
      }
    },
  });

  const formateData = (newValue) => {
    const date = new Date(newValue);
    return date.toISOString();
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

  const getUpdatedImages = (data, Gallerytype) => {
    if (Gallerytype === "exterior" && data.length !== 0) {
      setImageError(false);
    }
    if (Gallerytype === "videoupload" && data.length !== 0) {
      setErrorVideo(false);
    }
    postfilerepohandle(data, Gallerytype);
  };

  const handleCancelModal = (modalType) => {
    if (modalType === "exterior") {
      setModalExteriorOpen(false);
    }
    if (modalType === "videoupload") {
      setVideoOpen(false);
    }
  };
  const handleCancelTerms = () => {
    setTermsError(false);
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

  const handleExteriorGalleryClick = (exterior) => {
    setModalExteriorOpen(true);
    // handleOnClickSection(exterior);
  };

  const handleVideoClick = (videoupload) => {
    setVideoOpen(true);
    // handleOnClickSection(videoupload);
  };

  useEffect(() => {
    setUpdatedMusicChecks(formatIncomingPayments(musicTypelistdata, updatedMusicType));
  }, [updatedMusicType]);

  useEffect(() => {
    setUpdatedEntryChecks(formatIncomingPayments(entryTypeCon, updatedEntryType));
  }, [updatedEntryType]);

  useEffect(() => {
    setUpdatedDrinksChecks(formatIncomingPayments(drinkListData, updatedDrinksType));
  }, [updatedDrinksType]);

  useEffect(() => {
    if (updatedMusicType.length !== updateMusicCheck.length) {
      setMusicTouch(true);
    } else {
      setMusicTouch(false);
    }
  }, [updatedMusicType, updateMusicCheck]);

  useEffect(() => {
    if (updatedDrinksType.length !== updateDrinksCheck.length) {
      setDrinkTouch(true);
    } else {
      setDrinkTouch(false);
    }
  }, [updatedDrinksType, updateDrinksCheck]);

  useEffect(() => {
    if (updatedEntryType.length !== updateEntryCheck.length) {
      setEntryTouch(true);
    } else {
      setEntryTouch(false);
    }
  }, [updatedEntryType, updateEntryCheck]);

  useEffect(() => {
    if (updatePartyDetail?.entry_price) {
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

    if (JSON.stringify(videoFile) !== JSON.stringify(initPartImages?.flash_deal_video_file)) {
      setVideoTouch(true);
    } else {
      setVideoTouch(false);
    }
  }, [imagesUploadedData, videoFile, initPartImages]);

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
                      error={formik.touched.deal_name && Boolean(formik.errors.deal_name)}
                      helperText={formik.touched.deal_name && formik.errors.deal_name}
                      label="Flash Deal Name"
                      id="deal_name"
                      name="deal_name"
                      onChange={formik.handleChange}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={formik.values.deal_name}
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
                          <option key={option.name} value={option.id}>
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
                          const date = new Date(value);
                          formik.setFieldValue("start_date", date.toISOString());
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
                          const date = new Date(value);
                          formik.setFieldValue("end_date", date.toISOString());
                        }}
                        disablePast
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
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onBlur={formik.handleBlur}
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
                      error={formik.touched.entry_price && Boolean(formik.errors.entry_price)}
                      helperText={formik.touched.entry_price && formik.errors.entry_price}
                      label="Entry Charges"
                      id="entry_price"
                      name="entry_price"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      // onFocus={!checked}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={!checked}
                      InputProps={{
                        readOnly: !checked,
                      }}
                      value={formik.values.entry_price}
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
                      required
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
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      error={formik.touched.brand_type && Boolean(formik.errors.brand_type)}
                      helperText={formik.touched.brand_type && formik.errors.brand_type}
                      label="Select Bar Type"
                      id="brand_type"
                      name="brand_type"
                      required
                      inputRef={inputRef}
                      value={formik.values.brand_type}
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
                      {brandTypesContent && brandTypesContent.length >= 0 && (
                        <option key={`default-value`} value="">
                          {"Select"}
                        </option>
                      )}
                      {brandTypesContent &&
                        brandTypesContent.map((option) => (
                          <option key={option.name} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={6}>
                    <FormLabel component="legend" sx={{ m: 3 }}>
                      Flash Deal Gallery*
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
                    {imagesUploadedData && imagesUploadedData.length > 0 && (
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
                        // isExteriorFlag={"exterior"}
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
                        Please select Flash Deal images
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
                        // isExteriorFlag={"videoupload"}
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
                        Please select Flash Deal videos
                      </Typography>
                    )}
                  </Grid>

                  <Grid item md={10} xs={12}>
                    <CheckBoxCustom
                      titleClass={{ ml: 4, mt: 2 }}
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
                          Please select Your Terms & Conditions
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
                    handleCancelTerms();
                    formik.resetForm();
                    handleCancel(e);
                  }}
                  disabled={
                    !formTouch &&
                    !imageTouch &&
                    !videoTouch &&
                    !entryTouch &&
                    !drinkTouch &&
                    !musicTouch
                  }
                  sx={{
                    "&:focus": {
                      transform: "scale(0.9)",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  sx={{
                    "&:focus": {
                      transform: "scale(0.9)",
                    },
                  }}
                  disabled={
                    !formTouch &&
                    !imageTouch &&
                    !videoTouch &&
                    !entryTouch &&
                    !drinkTouch &&
                    !musicTouch
                  }
                  type="submit"
                >
                  Update Flash Deal
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
          confirmtext={"No"}
          canceltext={"Yes"}
          modalTitle="Leaving Page?"
          handleconfirmation={() => handleConfirm()}
        />
      )}
    </>
  );
};
