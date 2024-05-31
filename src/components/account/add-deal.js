import { useState, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { FormGroup, Checkbox, FormControlLabel, FormLabel } from "@mui/material";
import { AuthContext } from "../../contexts/auth-context";
import { useFormik, FormikProvider } from "formik";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import * as Yup from "yup";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  useTheme,
  Typography,
} from "@mui/material";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import { CustomizedDialogs } from "../modalpopup/modal-pop-up";
import { CheckBoxCustom } from "../check-box-custom/check-box-custom";
import { filterIdToPost } from "../../utils/method";
import { MultiImages } from "../imageupload/multiple-image-upload";
import { ImageList } from "../customer/images-list";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export const AddDeal = (props) => {
  const {
    onSubmitCallBack,
    propertlistdata,
    postfilerepohandle,
    imageupload,
    videoFile,
    postImages,
    dealsContent,
    entryTypeCon,
    musicTypelistdata,
    drinkListData,
    termsContent,
    handlecancel,
    deleteImagecallBack,
  } = props;
  const [open, setOpen] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [termsCheck, setTermsChecks] = useState([]);
  const [termsError, setTermsError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isCheckedEntryPrice, setCheckedEntryPrice] = useState(true);
  const [isCheckedCoverPrice, setCheckedCoverPrice] = useState(false);
  const [modalExteriorOpen, setModalExteriorOpen] = useState(false);

  const [isRecurring, setRecurring] = useState(false);

  const [entryValidCheck, setEntryValidChecks] = useState([]);
  const [entryError, setEntryValidError] = useState(false);

  const [musicValidCheck, setMusicValidChecks] = useState([]);
  const [musicError, setMusicValidError] = useState(false);

  const [drinksValidCheck, setDrinksValidChecks] = useState([]);
  const [drinksError, setDrinksValidError] = useState(false);

  const [errorVideo, setErrorVideo] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const [formTouch, setFormTouch] = useState(false);
  const [imageTouch, setImageTouch] = useState(false);
  const [videoTouch, setVideoTouch] = useState(false);
  const [musicTouch, setMusicTouch] = useState(false);
  const [drinkTouch, setDrinkTouch] = useState(false);
  const [entryTouch, setEntryTouch] = useState(false);
  const [recurringTouch, setRecurringTouch] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(true);

  const [cancleConfirmation, setCancleConfirmation] = useState(false);
  const [navigate, setNavigate] = useState(false);
  const [urlPath, setUrlPath] = useState(null);

  const router = useRouter();

  const inputRef = useRef(null);

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

  const handleCheckedEntryPriceChange = (event) => {
    setCheckedEntryPrice(true);
    setCheckedCoverPrice(false);
  };

  const handleCheckedCoverPriceChange = (event) => {
    setCheckedEntryPrice(false);
    setCheckedCoverPrice(true);
  };

  const handleRecurringChange = (event) => {
    setRecurring(event.target.checked);
  };

  const validate = Yup.object({
    deal_name: Yup.string().required("Deal name is mandatory"),
    deal_code: Yup.string().required("Deal code is mandatory"),
    deal_type: Yup.string().required("Deal type is mandatory"),
    // deal_for: Yup.string().required("Deal for is mandatory"),
    start_date: Yup.date().required("Start time cannot be empty"),
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
    no_of_people: Yup.number()
      .typeError("Please enter number value only")
      .nullable()
      .notRequired()
      .min(0, "Minimum charge is reqired")
      .max(999999999999, "Maximum charge has crossed")
      .moreThan(-1, "Negative values not accepted")
      .required("No of people you want to sell is mandatory"),
    entry_price: isCheckedEntryPrice
      ? Yup.string()
          .matches(/^\d+$/, "Only numeric values are allowed")
          .required("Either Entry charge or Cover charge is mandatory")
          .min(1, "Charges must be greater than or equal to 1")
          .max(8, "Charges must be less than or equal to 99999999")
      : null,
    cover_charge: isCheckedCoverPrice
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
      deal_code: postImages?.deal_code,
      deal_type: postImages?.deal_type,
      deal_name: postImages?.deal_name,
      deal_for: postImages?.deal_for,
      start_date: null ?? "",
      end_date: null ?? "",
      entry_price: postImages?.entry_price,
      cover_charge: postImages?.cover_charge,
      no_of_people: postImages?.no_of_people,
      recurring: postImages?.recurring,
      property: postImages?.property,
      discount: "",
    },
    enableReinitialize: true,
    validationSchema: validate,
    onChange: async (values) => {},
    onSubmit: async (values) => {
      const resValues = { ...values };
      resValues.start_date = formateDate(resValues?.start_date);
      resValues.end_date = formateDate(resValues?.end_date);
      resValues.entry_type = entryValidCheck;
      resValues.music_type = musicValidCheck;
      resValues.drink_type = drinksValidCheck;
      resValues.entry_price = isCheckedEntryPrice ? resValues?.entry_price : null;
      resValues.cover_charge = isCheckedCoverPrice ? resValues?.cover_charge : null;
      resValues.image = filterIdToPost(imageupload);
      resValues.deal_video_file = filterIdToPost(videoFile);
      resValues.terms_conditions = termsCheck;
      resValues.recurring = isRecurring;
      if (resValues?.image && resValues?.image.length !== 0 && resValues?.image !== null) {
        setImageError(false);
      } else {
        setImageError(true);
      }

      if (resValues.deal_video_file.length !== 0) {
        setErrorVideo(false);
      } else {
        setErrorVideo(true);
      }

      if (resValues.terms_conditions.length >= 1) {
        setTermsError(false);
      } else {
        setTermsError(true);
      }

      if (resValues.entry_type.length === 0) {
        setEntryValidError(true);
      } else {
        setEntryValidError(false);
      }

      if (resValues.music_type.length === 0) {
        setMusicValidError(true);
      } else {
        setMusicValidError(false);
      }

      if (resValues.drink_type.length === 0) {
        setDrinksValidError(true);
      } else {
        setDrinksValidError(false);
      }

      if (
        resValues?.image &&
        resValues?.image !== null &&
        resValues?.image.length !== 0 &&
        resValues?.terms_conditions.length >= 1 &&
        resValues?.entry_type.length !== 0 &&
        resValues?.music_type.length !== 0 &&
        resValues?.drink_type.length !== 0 &&
        resValues?.deal_video_file.length !== 0
      ) {
        setMusicValidError(false);
        setEntryValidError(false);
        setDrinksValidError(false);
        setErrorVideo(false);
        setFormTouch(false);
        setImageTouch(false);
        setVideoTouch(false);
        setMusicTouch(false);
        setEntryTouch(false);
        setRecurringTouch(false);
        setIsSubmitted(false);
        const result = { ...resValues };
        onSubmitCallBack(result);
      }
    },
  });

  const formateDate = (newValue) => {
    const date = new Date(newValue);
    return date.toISOString();
  };

  const getUpdatedTerms = (data) => {
    const isSelectedValues = data.filter((item) => item?.isSelected);
    if (isSelectedValues.length === 0) {
      setTermsChecks(isSelectedValues);
    }

    if (isSelectedValues.length !== 0) {
      setTermsChecks(filterIdToPost(isSelectedValues));
      setTermsError(false);
    }
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

  const getUpdatedEntryType = (data) => {
    const isSelectedValues = data.filter((item) => item?.isSelected);
    if (isSelectedValues.length === 0) {
      setEntryValidChecks(isSelectedValues);
    }

    if (isSelectedValues.length !== 0) {
      setEntryValidChecks(filterIdToPost(isSelectedValues));
      setEntryValidError(false);
    }
  };

  const getUpdatedMusicType = (data) => {
    const isSelectedValues = data.filter((item) => item?.isSelected);
    if (isSelectedValues.length === 0) {
      setMusicValidChecks(isSelectedValues);
    }

    if (isSelectedValues.length !== 0) {
      setMusicValidChecks(filterIdToPost(isSelectedValues));
      setMusicValidError(false);
    }
  };

  const getUpdatedDrinksType = (data) => {
    const isSelectedValues = data.filter((item) => item?.isSelected);
    if (isSelectedValues.length === 0) {
      setDrinksValidChecks(isSelectedValues);
    }

    if (isSelectedValues.length !== 0) {
      setDrinksValidChecks(filterIdToPost(isSelectedValues));
      setDrinksValidError(false);
    }
  };

  const handleCancelTerms = () => {
    // setDefaultSelect(null ?? "");
    setTermsError(false);
  };

  const handleSelectedRadio = (data) => {
    setEntryValidChecks(data);
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
  };

  const handleVideoClick = (videoupload) => {
    setVideoOpen(true);
  };

  const uploadButton = (galleryType) => {
    return (
      <>
        <ImageList
          customers={imageupload}
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

  useEffect(() => {
    if (imageupload && imageupload.length !== 0) {
      setImageError(false);
    }
    if (videoFile && videoFile.length !== 0) {
      setErrorVideo(false);
    }
  }, [imageupload, videoFile]);

  useEffect(() => {
    if (JSON.stringify(formik.initialValues) !== JSON.stringify(formik.values)) {
      setFormTouch(true);
    } else {
      setFormTouch(false);
    }
  }, [formik.initialValues, formik.values]);

  useEffect(() => {
    if (JSON.stringify(postImages?.image) !== JSON.stringify(imageupload)) {
      setImageTouch(true);
    } else {
      setImageTouch(false);
    }
  }, [postImages.image, imageupload]);

  useEffect(() => {
    if (JSON.stringify(postImages?.deal_video_file) !== JSON.stringify(videoFile)) {
      setVideoTouch(true);
    } else {
      setVideoTouch(false);
    }
  }, [postImages.deal_video_file, videoFile]);

  useEffect(() => {
    if (postImages.music_type.length !== musicValidCheck.length) {
      setMusicTouch(true);
    } else {
      setMusicTouch(false);
    }
  }, [postImages?.music_type, musicValidCheck]);

  useEffect(() => {
    if (postImages?.entry_type.length !== entryValidCheck.length) {
      setEntryTouch(true);
    } else {
      setEntryTouch(false);
    }
  }, [postImages?.entry_type, entryValidCheck]);

  useEffect(() => {
    if (postImages?.drink_type.length !== drinksValidCheck.length) {
      setDrinkTouch(true);
    } else {
      setDrinkTouch(false);
    }
  }, [postImages?.drink_type, drinksValidCheck]);

  useEffect(() => {
    if (postImages?.recurring !== isRecurring) {
      setRecurringTouch(true);
    } else {
      setRecurringTouch(false);
    }
  }, [postImages?.recurring, isRecurring]);
  
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
      !formTouch &&
      !imageTouch &&
      !videoTouch &&
      !musicTouch &&
      !entryTouch &&
      !drinkTouch &&
      !recurringTouch;

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
  }, [navigate, formTouch, imageTouch, videoTouch, musicTouch, entryTouch, drinkTouch, recurringTouch]);

  const handleConfirm = () => {
    setNavigate(true);
    void router.push(urlPath);
  };

  return (
    <>
      <FormikProvider value={formik}>
        <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
          <Box sx={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", mb: 4 }}>
            <Card sx={{ background: "" }}>
              <CardContent>
                <Grid container spacing={6} p={4}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      error={formik.touched.deal_name && Boolean(formik.errors.deal_name)}
                      helperText={formik.touched.deal_name && formik.errors.deal_name}
                      label="Deal Name"
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
                      required
                      inputRef={inputRef}
                      value={formik.values.property}
                      onChange={formik.handleChange}
                      // onClick={(e) => formik.setFieldValue('property', e.target.value)}
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
                          <option key={option?.id} value={option?.id}>
                            {option?.name}
                          </option>
                        ))}
                    </TextField>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      error={formik.touched.deal_code && Boolean(formik.errors.deal_code)}
                      helperText={formik.touched.deal_code && formik.errors.deal_code}
                      label="Deal Code"
                      id="deal_code"
                      name="deal_code"
                      onChange={formik.handleChange}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={formik.values.deal_code}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      error={formik.touched.deal_type && Boolean(formik.errors.deal_type)}
                      helperText={formik.touched.deal_type && formik.errors.deal_type}
                      label="Deal type"
                      id="deal_type"
                      name="deal_type"
                      inputRef={inputRef}
                      value={formik.values.deal_type}
                      onChange={formik.handleChange}
                      select
                      required
                      SelectProps={{ native: dealsContent.length === 1 ? false : true }}
                      hiddenLabel
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                    >
                      {dealsContent.length >= 0 && (
                        <option key={`default-value`} value="">
                          {"Select"}
                        </option>
                      )}
                      {dealsContent &&
                        dealsContent.map((option, index) => (
                          <option key={`${option?.name}-${index}`} value={option?.id}>
                            {option?.name}
                          </option>
                        ))}
                    </TextField>
                  </Grid>

                  <Grid item md={8} xs={12}>
                    <FormLabel component="legend">Deal valid on</FormLabel>
                    <FormGroup row={true}>
                      <FormControlLabel control={<Checkbox />} label="Cocktails" />
                      <FormControlLabel control={<Checkbox />} label="Mocktails" />
                      <FormControlLabel control={<Checkbox />} label="Food only" />
                      <FormControlLabel control={<Checkbox />} label="Food & Liquor" />
                    </FormGroup>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        open={open}
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
                        label="Recurring Date & Time"
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
                        label="End Date & Time"
                        value={formik.values.end_date}
                        onChange={(value) => {
                          formik.setFieldValue("end_date", value);
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
                  <Grid style={{ display: "flex", textAlign: "center" }} item md={6} xs={12}>
                    <Checkbox
                      style={{ verticalAlign: "middle" }}
                      checked={isCheckedEntryPrice}
                      onChange={handleCheckedEntryPriceChange}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                    <TextField
                      fullWidth
                      error={formik.touched.entry_price && Boolean(formik.errors.entry_price)}
                      helperText={formik.touched.entry_price && formik.errors.entry_price}
                      label="Entry Charge"
                      id="entry_price"
                      name="entry_price"
                      onChange={formik.handleChange}
                      disabled={!isCheckedEntryPrice}
                      required={isCheckedEntryPrice}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={formik.values.entry_price}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid style={{ display: "flex", textAlign: "center" }} item md={6} xs={12}>
                    <Checkbox
                      style={{ verticalAlign: "middle" }}
                      checked={isCheckedCoverPrice}
                      onChange={handleCheckedCoverPriceChange}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                    <TextField
                      fullWidth
                      error={formik.touched.cover_charge && Boolean(formik.errors.cover_charge)}
                      helperText={formik.touched.cover_charge && formik.errors.cover_charge}
                      label="Cover Charge"
                      id="cover_charge"
                      name="cover_charge"
                      onChange={formik.handleChange}
                      disabled={!isCheckedCoverPrice}
                      required={isCheckedCoverPrice}
                      InputLabelProps={{
                        shrink: true,
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
                      error={formik.touched.no_of_people && Boolean(formik.errors.no_of_people)}
                      helperText={formik.touched.no_of_people && formik.errors.no_of_people}
                      label="No of people you want to sell this deal to"
                      id="no_of_people"
                      name="no_of_people"
                      onChange={formik.handleChange}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={formik.values.no_of_people}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item md={6} xs={12} alignItems="center">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isRecurring}
                          onChange={handleRecurringChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                      label="This is recurring deal"
                    />
                  </Grid>
                </Grid>

                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={6}>
                    <FormLabel component="legend" sx={{ m: 3 }}>
                      Deal Gallery*
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
                    {imageupload.length > 0 && (
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
                        Please select Deal images
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
                        Please select Deal videos
                      </Typography>
                    )}
                  </Grid>

                  <Grid item md={10} xs={12}>
                    <CheckBoxCustom
                      titleClass={{ ml: 4, mt: 2 }}
                      checkBoxTitle={"Music Genre*"}
                      checkBoxesContent={musicTypelistdata}
                      handleName={getUpdatedMusicType}
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
                      checkBoxTitle={"Entry Type*"}
                      checkBoxesContent={entryTypeCon}
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
                      checkBoxesContent={drinkListData}
                      handleName={getUpdatedDrinksType}
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
                      titleClass={{ ml: 4 }}
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
                    handlecancel(e);
                  }}
                  sx={{
                    "&:focus": {
                      transform: "scale(0.9)",
                    },
                  }}
                  disabled={
                    !formTouch &&
                    !imageTouch &&
                    !videoTouch &&
                    !musicTouch &&
                    !entryTouch &&
                    !drinkTouch &&
                    !recurringTouch
                  }
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !formTouch &&
                    !imageTouch &&
                    !videoTouch &&
                    !musicTouch &&
                    !entryTouch &&
                    !drinkTouch &&
                    !recurringTouch
                  }
                >
                  Create Deal
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
