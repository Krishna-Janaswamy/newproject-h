import { useState, useContext, useEffect, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { DashboardLayout } from "../../../components/dashboard-layout";
import { AccountProfileDetails } from "../../../components/account/account-add-property";
import {
  getFacilityContent,
  getCountryContent,
  getBarTypes,
  getPropertyTypes,
  getPaymentsContent,
  getStateContent,
  getCityContent,
} from "../../../service/content.service";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import { CustomTabs } from "../../../components/custome-tabs/custome-tabs";
import {
  getAddProperty,
  postAddProperty,
  deletePropertyId,
  postSocialToAddProperty,
  updateFacilitiesProperty,
  postAddPropertyDetails,
  postPropertyEmailVerification,
} from "../../../service/property.services";
import {
  formatState,
  formatFacilities,
  formatManager,
  initialStateAddProperty,
  formateIsLoadingTrue,
  formateIsLoadingFalse,
} from "../../../utils/method";
import { ToastBar } from "../../../components/toast-bar/toast-bar";
import {
  getFileRepo,
  postFileRepo,
  deleteFileRepoImage,
  getManagerWithNumber,
} from "../../../service/account.service";
import Router from "next/router";
import { ImagesUploadAddProperty } from "../../../components/account/images-add-property";
import { FacilitiesAddProperty } from "../../../components/account/facilities-add-property";
import { LinearStepper } from "../../../components/stepper-tab/stepper-tab";
import { TemplateEmailVerify } from "../../../components/account/template-email-verify";

export const Page = (props) => {
  const [facilityContent, setFacilityContent] = useState([]);
  const [countryContent, setCountryContent] = useState([]);
  const [clubTypeContent, setClubTypeContent] = useState([]);
  const [barTypes, setBarTypes] = useState([]);
  const [paymentsContent, setPaymentsContent] = useState([]);
  const [addProperty, setAddProperty] = useState([]);
  const [stateContent, setStateContent] = useState([]);
  const [cityContent, setCityContent] = useState([]);
  const [fileRepo, setFileRepo] = useState([]);
  const [fileRepoGallery, setFileRepoGallery] = useState([]);
  const [fileMenu, setFileMenu] = useState([]);
  const [videoFile, setVideoFile] = useState([]);
  const [managerResult, setManagerResult] = useState([]);
  const [errorType, setErrorType] = useState("");
  const [exteriorLoading, setExteriorLoading] = useState(false);
  const [propertyPostImages, setPropertyPostImages] = useState(initialStateAddProperty);
  const [latlong, setLatlong] = useState({
    lat: "",
    long: "",
  });
  const [tabIndex, setTabIndex] = useState(0);
  const [dataInterior, setDataInterior] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [exteriorImages, setExteriorImages] = useState([]);
  const [interiorImages, setInteriorImages] = useState([]);
  const [menuImages, setMenuImages] = useState([]);
  const [fileVideos, setFileVideos] = useState([]);
  const [galleryType, setGalleryType] = useState("");
  const [propertyPostResult, setPropertyPostResult] = useState(initialStateAddProperty);
  const [openToast, setOpenToast] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [forIndia, setForIndia] = useState([]);
  const [otpEmail, setOtpEmail] = useState(false);
  const [emailVerifiedFlag, setEmailVerifiedFlag] = useState(false);
  const [otpVerification, setOtpVerification] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);

  const urlImagePost = process.env.NEXT_PUBLIC_API_URL;

  const handleSave = (galleryTypeValue, data) => {
    setDatasets(data);
  };
  const handleconfirmation = () => {
    if (galleryType === "exterior") {
      setExteriorImages(datasets);
    }
    if (galleryType === "interior") {
      setInteriorImages(datasets);
    }
    if (galleryType === "menu") {
      setMenuImages(datasets);
    }
    if (galleryType === "videoupload") {
      setFileVideos(datasets);
    }
  };

  const bindFacilityContent = async () => {
    const data = await getFacilityContent();
    const update = formatFacilities(data?.results);
    setFacilityContent(update);
  };

  const bindCountryValuesContent = async () => {
    const data = await getCountryContent();
    const filterIndia = data?.results.filter((value) => value?.id === 1);
    setForIndia(formatState(filterIndia));
    setCountryContent(formatState(data?.results));
  };

  const bindClubTypesData = async () => {
    const data = await getPropertyTypes();
    setClubTypeContent(data?.results);
  };

  const bindBarTypes = async () => {
    const data = await getBarTypes();
    setBarTypes(data?.results);
  };

  const bindPaymentsContent = async () => {
    const data = await getPaymentsContent();
    setPaymentsContent(data?.results);
  };

  const bindAddProperty = async () => {
    const data = await getAddProperty();
    setAddProperty(data);
  };

  const handlestatewithcountryid = useCallback(async (id) => {
    const data = await getStateContent(id);
    setStateContent(formatState(data?.results));
  }, [stateContent]);

  const handlecitywithstateid = useCallback(async (id) => {
    const data = await getCityContent(id);
    setCityContent(formatState(data?.results));
  }, [cityContent]);

  const bindFileRepoExterior = (data) => {
    if (data && data.length !== 0) {
      setFileRepo((prev) => prev.concat(data));
    }
  };

  const bindFileRepoInterior = (data) => {
    if (data && data.length !== 0) {
      setFileRepoGallery((prev) => prev.concat(data));
    }
  };

  const bindFileRepoMenu = (data) => {
    if (data && data.length !== 0) {
      setFileMenu((prev) => prev.concat(data));
    }
  };

  const bindVideoFile = (data) => {
    if (data && data.length !== 0) {
      setVideoFile((prev) => prev.concat(data));
    }
  };

  const handlepostfilerepo = async (postData, dataType) => {
    const data = await postFileRepo(postData);
    if (data?.status === true && dataType === "exterior") {
      bindFileRepoExterior(data?.results);
    }

    if (data?.status === true && dataType === "interior") {
      bindFileRepoInterior(data?.results);
    }
    if (data?.status === true && dataType === "menu") {
      bindFileRepoMenu(data?.results);
    }
    if (data?.status === true && dataType === "videoupload") {
      bindVideoFile(data?.results);
    }
  };

  const deleteHandleImages = (deleteId, galleryType) => {
    if (galleryType === "exterior") {
      const files = fileRepo;
      const deletedImg = files.filter((value) => value.id !== deleteId);
      setFileRepo(deletedImg);
    }

    if (galleryType === "interior") {
      const files = fileRepoGallery;
      const deletedImg = files.filter((value) => value.id !== deleteId);
      setFileRepoGallery(deletedImg);
    }
    if (galleryType === "menu") {
      const files = fileMenu;
      const deletedImg = files.filter((value) => value.id !== deleteId);
      setFileMenu(deletedImg);
    }
    if (galleryType === "videoupload") {
      const files = videoFile;
      const deletedImg = files.filter((value) => value.id !== deleteId);
      setVideoFile(deletedImg);
    }
  };

  const deleteImagecallBack = async (deleteId, galleryType) => {
    const data = await deleteFileRepoImage(deleteId);
    if (data?.status === true) {
      deleteHandleImages(deleteId, galleryType);
    }
  };
  const handleClosePopUpCallBack = (dataType) => {
    if (dataType === "exterior") {
      bindFileRepoExterior();
    }
    if (dataType === "interior") {
      bindFileRepoInterior();
    }
    if (dataType === "menu") {
      bindFileRepoMenu();
    }
    if (dataType === "videoupload") {
      bindVideoFile();
    }
  };

  const handleOnClickSection = (data) => {
    setGalleryType(data);
  };

  const searchManagerHandle = async (managerNumber) => {
    if (managerNumber) {
      const data = await getManagerWithNumber(managerNumber);
      let formated = formatFacilities(data?.results);
      formated = formatManager(formated);
      setManagerResult((prev) => [...prev, formated[0]]);
    }
  };
  const postAppPropertyHandle = async (postData) => {
    setPropertyPostResult(postData);
    setTabIndex(1);
  };

  const handlepropertyiddelete = async (propertyIdValue) => {
    setExteriorImages([]);
    setInteriorImages([]);
    setMenuImages([]);
    setFileVideos([]);
    setFileRepo([]);
    setFileRepoGallery([]);
    setFileMenu([]);
    setVideoFile([]);
    bindFacilityContent();
    bindPaymentsContent();
    setPropertyPostResult(initialStateAddProperty);
    setStateContent([]);
    setCityContent([]);
    setManagerResult([]);
    setTabIndex(0);
  };

  const onSubmitCallBackFacilities = async (facilitiesData) => {
    const data = await postAddPropertyDetails(facilitiesData);
    if (data?.status === true) {
      bindAddProperty();
      setErrorType("success");
      setMessageText("Your property has been created SuccessFully!!!");
      setOpenToast(true);
      setTimeout(() => {
        location.replace("/admin");
      }, 2000);
    } else {
      setErrorType("error");
      setMessageText("OOps!!! something went wrong, please try again with correct data");
      setOpenToast(true);
      setTimeout(() => {
        location.replace("/admin");
      }, 2000);
    }
  };

  const onSubmitCallBackImages = async (imagesData) => {
    setPropertyPostImages(imagesData);
    setTabIndex(2);
  };

  const handleEmailVerification = async (email) => {
    const data = await postPropertyEmailVerification(email);
    if (data.status) {
      setOtpEmail(true);
    } else {
      setOtpEmail(false);
    }
  };

  const handleEmailOtp = async (emailData) => {
    const data = await postPropertyEmailVerification(emailData);
    const updateEmail = { ...propertyPostResult };
    updateEmail.email = emailData?.email;
    setPropertyPostResult(updateEmail);
    if (data.status) {
      setOtpVerification(true);
      setEmailVerifiedFlag(true);
      setErrorType("success");
      setMessageText("Your email has been SuccessFully Verified!!!");
      setOpenToast(true);
      setTimeout(() => {
        setEmailVerifiedFlag(true);
      }, 2000);
    } else {
      setOtpVerification(false);
      setErrorStatus(true);
      setMessageText(data.message);
    }
  };

  const backToStepOne = async (e, backData) => {
    e.preventDefault();
    setPropertyPostResult(backData);
    setTabIndex(0);
  };

  const backToStepTwo = async (e) => {
    e.preventDefault();
    setTabIndex(1);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLatlong({
        lat: position.coords.latitude,
        long: position.coords.longitude,
      });
    });
  }, []);

  const renderComponentTab1 = () => {
    return (
      <AccountProfileDetails
        forIndia={forIndia}
        countrycontent={countryContent}
        clubtypecontent={clubTypeContent}
        paymentscontent={paymentsContent}
        statecontent={stateContent}
        handlestatewithcountryid={handlestatewithcountryid}
        citycontent={cityContent}
        handlecitywithstateid={handlecitywithstateid}
        latlong={latlong}
        postapppropertyhandle={postAppPropertyHandle}
        propertypostresult={propertyPostResult}
        handleemailverification={handleEmailVerification}
        otpEmail={otpEmail}
      />
    );
  };

  const renderComponentTab2 = () => {
    return (
      <ImagesUploadAddProperty
        filerepocontent={fileRepo}
        postfilerepohandle={handlepostfilerepo}
        deleteImagecallBack={deleteImagecallBack}
        handleSave={handleSave}
        handleconfirmation={handleconfirmation}
        exteriorImages={exteriorImages}
        interiorImages={interiorImages}
        handleClosePopUpCallBack={handleClosePopUpCallBack}
        fileRepoGallery={fileRepoGallery}
        handleOnClickSection={handleOnClickSection}
        fileMenu={fileMenu}
        videoFile={videoFile}
        menuImages={menuImages}
        fileVideos={fileVideos}
        propertypostresult={propertyPostResult}
        handlepropertyiddelete={handlepropertyiddelete}
        onSubmitCallBackImages={onSubmitCallBackImages}
        propertyPostImages={propertyPostImages}
        backToStepOne={backToStepOne}
      />
    );
  };

  const renderComponentTab3 = () => {
    return (
      <FacilitiesAddProperty
        facilitycontent={facilityContent}
        paymentscontent={paymentsContent}
        searchManagerHandle={searchManagerHandle}
        managerResult={managerResult}
        propertypostresult={propertyPostResult}
        handlepropertyiddelete={handlepropertyiddelete}
        onSubmitCallBackFacilities={onSubmitCallBackFacilities}
        propertyPostImages={propertyPostImages}
        backToStepTwo={backToStepTwo}
      />
    );
  };

  const steps = [renderComponentTab1(), renderComponentTab2(), renderComponentTab3()];

  useEffect(() => {
    bindFacilityContent();
    bindCountryValuesContent();
    bindClubTypesData();
    bindBarTypes();
    bindPaymentsContent();
    bindAddProperty();
    bindFileRepoExterior();
    bindFileRepoInterior();
    bindFileRepoMenu();
    bindVideoFile();
  }, []);
  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          py: 1,
        }}
      >
        {!emailVerifiedFlag && (
          <>
            <Typography sx={{ m: 2 }} variant="h4">
              Verify Email
            </Typography>
            <Box sx={{ p: 3 }}>
              <TemplateEmailVerify
                handleemailverification={handleEmailVerification}
                handleemailotp={handleEmailOtp}
                otpverification={otpVerification}
                otpEmail={otpEmail}
                errorstatus={errorStatus}
                errormessage={messageText}
              />
            </Box>
          </>
        )}

        {emailVerifiedFlag && (
          <>
            <Typography sx={{ m: 2 }} variant="h4">
              Create Property
            </Typography>
            <Box sx={{ p: 3 }}>
              <LinearStepper
                initialState={tabIndex}
                renderComponentTab1={() => renderComponentTab1()}
                renderComponentTab2={() => renderComponentTab2()}
                renderComponentTab3={() => renderComponentTab3()}
              />
            </Box>
          </>
        )}
      </Box>
      {openToast && (
        <ToastBar
          isOpen={openToast}
          setIsOpen={setOpenToast}
          type={errorType}
          displayMessage={messageText}
        />
      )}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
