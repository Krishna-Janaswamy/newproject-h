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
import { BasicUploadButton } from "../imageupload/basic-image-upload";
import { filterIdToPost, formateUpdatedImagesGet, filterIdToPostTrue } from "../../utils/method";
import { ImagesCheckBoxes } from "../imageupload/images-checkbox";
import { CustomizedDialogs } from "../modalpopup/modal-pop-up";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import { ImageList } from "../customer/images-list";
import { MultiImages } from "../imageupload/multiple-image-upload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export const ImagesUpdateProperty = (props) => {
  const {
    filerepocontent,
    fileRepoGallery,
    fileMenu,
    postfilerepohandle,
    deleteImagecallBack,
    videoFile,
    handleconfirmation,
    handleClosePopUpCallBack,
    handleOnClickSection,
    handlepropertyiddelete,
    onSubmitCallBackImages,
    imageupdatedata,
    backToStepOne,
    initImagesData,
  } = props;
  const [imageError, setImageError] = useState(false);
  const [imageInteriorError, setImageInteriorError] = useState(false);
  const [errorMenu, setErrorMenu] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalExteriorOpen, setModalExteriorOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const [cancleConfirmationPop, setCancleConfirmationPop] = useState(false);
  const [errorVideo, setErrorVideo] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const theme = useTheme();
  const [exteriorTouch, setExteriorTouch] = useState(false);
  const [interiorTouch, setInteriorTouch] = useState(false);
  const [menuPlaceTouch, setMenuPlaceTouch] = useState(false);
  const [videoTouch, setVideoTouch] = useState(false);
  const [initImages, setInitImages] = useState(initImagesData);

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

  const validate = Yup.object({
    exterior_gallery: Yup.array().required("Please select property images"),
    exterior_facebook: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      exterior_instagram: imageupdatedata?.exterior_instagram,
      exterior_facebook: imageupdatedata?.exterior_facebook,
      interior_instagram: imageupdatedata?.interior_facebook,
      interior_facebook: imageupdatedata?.interior_facebook,
      instagram: imageupdatedata?.instagram,
      youtube: imageupdatedata?.youtube,
      facebook: imageupdatedata?.facebook,
      twitter: imageupdatedata?.twitter,
      exterior_gallery: imageupdatedata?.exterior_gallery,
      interior_gallery: imageupdatedata?.interior_gallery,
      menu_place: imageupdatedata?.menu_place,
      promoter: imageupdatedata?.promoter,
      video_file: imageupdatedata?.video_file,
    },
    // enableReinitialize: true,
    handleChange: async () => {},
    validationSchema: validate,
    onSubmit: async (values) => {
      const result = { ...values };
      result.exterior_gallery = filerepocontent;
      result.interior_gallery = fileRepoGallery;
      result.menu_place = fileMenu;
      result.video_file = videoFile;

      if (result.exterior_gallery.length === 0) {
        setImageError(true);
      } else {
        setImageError(false);
      }

      if (result.interior_gallery.length === 0) {
        setImageInteriorError(true);
      } else {
        setImageInteriorError(false);
      }

      if (result.menu_place.length === 0) {
        setErrorMenu(true);
      } else {
        setErrorMenu(false);
      }
      if (result.video_file.length === 0) {
        setErrorVideo(true);
      } else {
        setErrorVideo(false);
      }

      if (
        result.exterior_gallery.length !== 0 &&
        result.interior_gallery.length !== 0 &&
        result.menu_place.length !== 0 &&
        result.video_file.length !== 0
      ) {
        onSubmitCallBackImages(result);
      }
    },
  });

  const getUpdatedImages = (data, Gallerytype) => {
    if (Gallerytype === "exterior" && data.length !== 0) {
      setImageError(false);
    }
    if (Gallerytype === "interior" && data.length !== 0) {
      setImageInteriorError(false);
    }
    if (Gallerytype === "menu" && data.length !== 0) {
      setErrorMenu(false);
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
    if (galleryType === "interior") {
      const values = { ...sizeError };
      values.interiorGallery = errorValue;
      setSizeError(values);
    }
    if (galleryType === "menu") {
      const values = { ...sizeError };
      values.menuPlaces = errorValue;
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
    if (galleryType === "interior") {
      const values = { ...sizeError };
      values.interiorGallery = errorValue;
      setTypeError(values);
    }
    if (galleryType === "menu") {
      const values = { ...sizeError };
      values.menuPlaces = errorValue;
      setTypeError(values);
    }
    if (galleryType === "videoupload") {
      const values = { ...sizeError };
      values.videoGallery = errorValue;
      setTypeError(values);
    }
  };

  const getImageDeleted = (id, galleryType) => {
    deleteImagecallBack(id, galleryType);
  };

  const handleCancelModal = (modalType) => {
    if (modalType === "exterior") {
      setModalExteriorOpen(false);
    }
    if (modalType === "interior") {
      setModalOpen(false);
    }
    if (modalType === "menu") {
      setMenuOpen(false);
    }
    if (modalType === "videoupload") {
      setVideoOpen(false);
    }
  };

  const uploadButton = (galleryType) => {
    return (
      <>
        <ImageList
          customers={filerepocontent}
          galleryType={galleryType}
          handledeleteaction={deleteImagecallBack}
          sizeError={sizeError.exteriorGallery}
          typeError={typeError.exteriorGallery}
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

  const uploadInteriorButton = (galleryType) => {
    return (
      <>
        <ImageList
          customers={fileRepoGallery}
          galleryType={galleryType}
          handledeleteaction={deleteImagecallBack}
          sizeError={sizeError.interiorGallery}
          typeError={typeError.interiorGallery}
        />
      </>
    );
  };

  const uploadMenuPlaces = (galleryType) => {
    return (
      <>
        <ImageList
          customers={fileMenu}
          galleryType={galleryType}
          handledeleteaction={deleteImagecallBack}
          sizeError={sizeError.menuPlaces}
          typeError={typeError.menuPlaces}
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

  const handleExteriorGalleryClick = (exterior) => {
    setModalExteriorOpen(true);
    handleOnClickSection(exterior);
  };

  const handleInteriorGalleryClick = (interior) => {
    setModalOpen(true);
    handleOnClickSection(interior);
  };
  const handleMenuClick = (menu) => {
    setMenuOpen(true);
    handleOnClickSection(menu);
  };

  const handleVideoClick = (videoupload) => {
    setVideoOpen(true);
    handleOnClickSection(videoupload);
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

  useEffect(() => {
    if (filerepocontent.length !== 0) {
      setImageError(false);
    }
    if (JSON.stringify(filerepocontent) !== JSON.stringify(initImages?.exterior_gallery)) {
      setExteriorTouch(true);
    } else {
      setExteriorTouch(false);
    }
    if (fileRepoGallery.length !== 0) {
      setImageInteriorError(false);
    }
    if (JSON.stringify(fileRepoGallery) !== JSON.stringify(initImages?.interior_gallery)) {
      setInteriorTouch(true);
    } else {
      setInteriorTouch(false);
    }
    if (fileMenu.length !== 0) {
      setErrorMenu(false);
    }
    if (JSON.stringify(fileMenu) !== JSON.stringify(initImages?.menu_place)) {
      setMenuPlaceTouch(true);
    } else {
      setMenuPlaceTouch(false);
    }
    if (videoFile.length !== 0) {
      setErrorVideo(false);
    }

    if (JSON.stringify(videoFile) !== JSON.stringify(imageupdatedata?.video_file)) {
      setVideoTouch(true);
    } else {
      setVideoTouch(false);
    }
  }, [filerepocontent, fileRepoGallery, fileMenu, videoFile, initImages]);

  useEffect(() => {
    setInitImages(initImagesData);
  }, []);

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
      !exteriorTouch && !interiorTouch && !menuPlaceTouch && !videoTouch;

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
  }, [navigate, exteriorTouch, interiorTouch, menuPlaceTouch, videoTouch]);

  const handleConfirm = () => {
    setNavigate(true);
    void router.push(urlPath);
  };

  return (
    <>
      <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
        <Box sx={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }} mt={3}>
          <Card sx={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={6}>
                <FormLabel component="legend" sx={{ m: 4 }}>
                  Exterior Collection*
                </FormLabel>
                <Grid container spacing={3} ml={1}>
                  {/* <Grid item md={2} xs={12}>
                <BasicUploadButton buttonTitle={"Exterior Facebook"} isDisabled />
              </Grid> */}
                  {/* <Grid item md={2} xs={12}>
                <BasicUploadButton buttonTitle={"Exterior Instagram"} isDisabled />
              </Grid> */}
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      component="label"
                      onClick={() => handleExteriorGalleryClick("exterior")}
                      sx={{
                        "&:focus": {
                          transform: "scale(0.9)",
                        },
                      }}
                      startIcon={<FolderCopyIcon />}
                    >
                      Choose Exterior Gallery
                    </Button>
                    {modalExteriorOpen && (
                      <CustomizedDialogs
                        isOpen={modalExteriorOpen}
                        handleClosePopUpCallBack={handleClosePopUpCallBack}
                        setIsOpen={setModalExteriorOpen}
                        isExteriorFlag={"exterior"}
                        modalTitle={"Images Gallery"}
                        handleconfirmation={handleconfirmation}
                        customstyle={{
                          width: "750px",
                          height: "350px",
                        }}
                        renderComponent={() => uploadButton("exterior")}
                        footerComponent={() => footerComponentUpload("exterior", "image/*")}
                      />
                    )}

                    {imageError && (
                      <Typography
                        sx={{ color: theme.palette.error.light }}
                        gutterBottom
                        variant="body1"
                      >
                        Please select Your Property Images
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    {filerepocontent.length > 0 && (
                      <CheckCircleIcon
                        sx={{ color: theme.palette.success.light, ml: -8, mt: 1 }}
                        fontSize="small"
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <FormLabel component="legend" sx={{ m: 4 }}>
                  Interior Collection*
                </FormLabel>
                <Grid container spacing={3} ml={1}>
                  {/* <Grid item md={2} xs={12}>
                <BasicUploadButton buttonTitle={"Interior Facebook"} isDisabled />
              </Grid> */}
                  {/* <Grid item md={2} xs={12}>
                <BasicUploadButton buttonTitle={"Interior Instagram"} isDisabled />
              </Grid> */}
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      component="label"
                      onClick={() => handleInteriorGalleryClick("interior")}
                      sx={{
                        "&:focus": {
                          transform: "scale(0.9)",
                        },
                      }}
                      startIcon={<FolderCopyIcon />}
                    >
                      Choose Interior Gallery
                    </Button>
                    {modalOpen && (
                      <CustomizedDialogs
                        isOpen={modalOpen}
                        setIsOpen={setModalOpen}
                        handleClosePopUpCallBack={handleClosePopUpCallBack}
                        isExteriorFlag={"interior"}
                        modalTitle={"Images Gallery"}
                        customstyle={{
                          width: "750px",
                          height: "350px",
                        }}
                        handleconfirmation={handleconfirmation}
                        renderComponent={() => uploadInteriorButton("interior")}
                        footerComponent={() => footerComponentUpload("interior", "image/*")}
                      />
                    )}

                    {imageInteriorError && (
                      <Typography
                        sx={{ color: theme.palette.error.light }}
                        gutterBottom
                        variant="body1"
                      >
                        Please select Your Property Images
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    {fileRepoGallery.length > 0 && (
                      <CheckCircleIcon
                        sx={{ color: theme.palette.success.light, ml: -8, mt: 1 }}
                        fontSize="small"
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <FormLabel component="legend" sx={{ m: 4 }}>
                  Menu Place*
                </FormLabel>
                <Grid container spacing={3} ml={1}>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      component="label"
                      onClick={() => handleMenuClick("menu")}
                      sx={{
                        "&:focus": {
                          transform: "scale(0.9)",
                        },
                      }}
                      startIcon={<FolderCopyIcon />}
                    >
                      Choose Menu 
                    </Button>
                    {menuOpen && (
                      <CustomizedDialogs
                        isOpen={menuOpen}
                        setIsOpen={setMenuOpen}
                        handleClosePopUpCallBack={handleClosePopUpCallBack}
                        isExteriorFlag={"menu"}
                        customstyle={{
                          width: "750px",
                          height: "350px",
                        }}
                        modalTitle={"Images Gallery"}
                        handleconfirmation={handleconfirmation}
                        renderComponent={() => uploadMenuPlaces("menu")}
                        footerComponent={() => footerComponentUpload("menu", "image/*")}
                      />
                    )}

                    {errorMenu && (
                      <Typography
                        sx={{ color: theme.palette.error.light }}
                        gutterBottom
                        variant="body1"
                      >
                        Please select menu
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    {fileMenu.length > 0 && (
                      <CheckCircleIcon
                        sx={{ color: theme.palette.success.light, ml: -8, mt: 1 }}
                        fontSize="small"
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <FormLabel component="legend" sx={{ m: 4 }}>
                  Video Upload*
                </FormLabel>
                <Grid container spacing={3} ml={1}>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      component="label"
                      onClick={() => handleVideoClick("videoupload")}
                      sx={{
                        "&:focus": {
                          transform: "scale(0.9)",
                        },
                      }}
                      startIcon={<FolderCopyIcon />}
                    >
                      Choose Video Gallery
                    </Button>
                    {videoOpen && (
                      <CustomizedDialogs
                        isOpen={videoOpen}
                        setIsOpen={setVideoOpen}
                        handleClosePopUpCallBack={handleClosePopUpCallBack}
                        isExteriorFlag={"videoupload"}
                        modalTitle={"Videos Gallery"}
                        customstyle={{
                          width: "750px",
                          height: "350px",
                        }}
                        handleconfirmation={handleconfirmation}
                        renderComponent={() => uploadVideo("videoupload")}
                        footerComponent={() => footerComponentUpload("videoupload", "video/*")}
                      />
                    )}

                    {errorVideo && (
                      <Typography
                        sx={{ color: theme.palette.error.light, pt: 1 }}
                        gutterBottom
                        variant="body1"
                      >
                        Please select property videos
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={6} ml={-8} mt={1}>
                    {videoFile.length > 0 && (
                      <CheckCircleIcon
                        sx={{ color: theme.palette.success.light }}
                        fontSize="small"
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Divider sx={{ mt: 3 }} />
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
                  disabled={!exteriorTouch && !interiorTouch && !menuPlaceTouch && !videoTouch}
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
                  onClick={(e) => backToStepOne(e)}
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
          handleconfirmation={() => handlepropertyiddelete("one")}
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
