import { DashboardLayout } from "../../components/dashboard-layout";
import { Box, Container, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { CustomTabs } from "../../components/custome-tabs/custome-tabs";
import { AccountUpdatedDetails } from "../../components/account/update-account-property";
import { ImagesUpdateProperty } from "../../components/account/update-images-property";
import { FacilitiesUpdateProperty } from "../../components/account/update-facilities-property";
import { useEffect } from "react";
import {
  getUpdatedProperty,
  patchUpdatedProperty,
  patchSocialToUpdateProperty,
  updateFacilitiesProperty,
} from "../../service/property.services";
import { useState } from "react";
import {
  getCityContent,
  getCountryContent,
  getFacilityContent,
  getPaymentsContent,
  getStateContent,
} from "../../service/content.service";
import {
  postFileRepo,
  getManagerWithNumber,
  deleteFileRepoImage,
} from "../../service/account.service";
import {
  formatState,
  formateUpdatedImagesGet,
  formatFacilities,
  formatManager,
  formatManagerUpdate,
  initialStateAddProperty,
} from "../../utils/method";
import { ToastBar } from "../../components/toast-bar/toast-bar";
import Router from "next/router";
import { LinearStepper } from "../../components/stepper-tab/stepper-tab";
import { DocumentsUpdateProperty } from "../../components/account/documents-update-property";

const Page = () => {
  const router = useRouter();
  const { paramId, name } = router.query;
  const [updatedPropertyData, setUpdatedPropertyData] = useState(initialStateAddProperty);
  const [imageUpdateData, setImageUpdateData] = useState([]);
  const [countryContent, setCountryContent] = useState([]);
  const [stateContent, setStateContent] = useState([]);
  const [cityContent, setCityContent] = useState([]);
  const [paymentContent, setPaymentContent] = useState([]);
  const [facilityContent, setFacilityContent] = useState([]);
  const [fileRepo, setFileRepo] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [exteriorImages, setExteriorImages] = useState([]);
  const [interiorImages, setInteriorImages] = useState([]);
  const [menuImages, setMenuImages] = useState([]);
  const [fileRepoGallery, setFileRepoGallery] = useState([]);
  const [fileMenu, setFileMenu] = useState([]);
  const [videoFile, setVideoFile] = useState([]);
  const [fileVideos, setFileVideos] = useState([]);
  const [galleryType, setGalleryType] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [propertyPostImages, setPropertyPostImages] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [managerResult, setManagerResult] = useState([]);
  const [updatedFacilities, setUpdatedFacilities] = useState([]);
  const [updatedPayments, setUpdatedPayments] = useState([]);
  const [managerData, setManagerData] = useState([]);
  const [otherDocuments, setOtherDocuments] = useState([]);
  const [updatedDocuments, setUpdatedDocuments] = useState({});
  const [initImages, setInitImages] = useState([]);
  const [initAccountProp, setInitAccountProp] = useState({});

  const bindUpdaedProperty = async () => {
    const data = await getUpdatedProperty(paramId);
    setUpdatedPropertyData(data?.results);
    setInitAccountProp({
      name: data?.results?.name,
      description: data?.results?.description,
      email: data?.results?.email,
      state: data?.results?.state?.id,
      city: data?.results?.city?.id,
      country: data?.results?.country?.id,
      pin_code: data?.results?.pin_code,
      opening_time: data?.results?.opening_time,
      closing_time: data?.results?.closing_time,
      seating_capacity: data?.results?.seating_capacity,
      total_capacity: data?.results?.total_capacity,
      lat: data?.results?.lat,
      long: data?.results?.long,
    });
    setImageUpdateData(data?.results?.social_data);
    setInitImages(data?.results?.social_data);
    const stateData = await getStateContent(data?.results?.country?.id);
    setStateContent(stateData?.results);
    const cityData = await getCityContent(data?.results?.state?.id);
    setCityContent(cityData?.results);
    setUpdatedFacilities(data?.results?.available_facilities?.facilities);
    setUpdatedPayments(data?.results?.payment);
    setManagerData(data?.results?.manager);
    setFileRepo(data?.results?.social_data?.exterior_gallery);
    setFileRepoGallery(data?.results?.social_data?.interior_gallery);
    setFileMenu(data?.results?.social_data?.menu_place);
    setVideoFile(data?.results?.social_data?.video_file);
    setOtherDocuments(data?.results?.documents);
  };

  const bindCountryValuesContent = async () => {
    const data = await getCountryContent();
    setCountryContent(formatState(data?.results));
  };
  const handlestatewithcountryid = async (id) => {
    const data = await getStateContent(id);
    setStateContent(data?.results);
  };

  const bindPaymentsContent = async () => {
    const data = await getPaymentsContent();
    setPaymentContent(data?.results);
  };

  const bindFacilitiesContent = async () => {
    const data = await getFacilityContent();
    setFacilityContent(data?.results);
  };

  const handleSave = (galleryTypeValue, data) => {
    setDatasets(data);
  };

  const handleconfirmation = () => {
    if (galleryType === "exterior") {
      setFileRepo(datasets);
    }
    if (galleryType === "interior") {
      setFileRepoGallery(datasets);
    }
    if (galleryType === "menu") {
      setFileMenu(datasets);
    }
    if (galleryType === "videoupload") {
      setFileVideos(datasets);
    }
  };

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

  const bindDocuments = (data) => {
    if (data && data.length !== 0) {
      setOtherDocuments((prev) => prev.concat(data));
    }
  };

  const handlepostfilerepo = async (postData, dataType) => {
    const data = await postFileRepo(postData);

    if (data?.status === true && dataType === "exterior") {
      bindFileRepoExterior(data.results);
    }

    if (data?.status === true && dataType === "interior") {
      bindFileRepoInterior(data.results);
    }
    if (data?.status === true && dataType === "menu") {
      bindFileRepoMenu(data.results);
    }

    if (data?.status === true && dataType === "videoupload") {
      bindVideoFile(data?.results);
    }
    if (data?.status === true && dataType === "other") {
      bindDocuments(data?.results);
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

    if (galleryType === "other") {
      const files = otherDocuments;
      const deletedImg = files.filter((value) => value.id !== deleteId);
      setOtherDocuments(deletedImg);
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

  const postUpdateHandle = async (patchData) => {
    const formatPatchData = {
      name: patchData?.name,
      description: patchData?.description,
      email: patchData?.email,
      state: { id: patchData?.state },
      city: { id: patchData?.city },
      country: { id: patchData?.country },
      pin_code: patchData?.pin_code,
      opening_time: patchData?.opening_time,
      closing_time: patchData?.closing_time,
      seating_capacity: patchData?.seating_capacity,
      total_capacity: patchData?.total_capacity,
      fee: patchData?.fee,
      lat: patchData?.lat,
      long: patchData?.long,
    };
    setUpdatedPropertyData(formatPatchData);
    setTabIndex(1);
  };

  const handlepropertyiddelete = async (value) => {
    bindUpdaedProperty();
    if (value === "zero") {
      setTabIndex(0);
    }
    if (value === "one") {
      setTabIndex(1);
    }
    if (value === "two") {
      setTabIndex(2);
    }
    if (value === "three") {
      setTabIndex(3);
    }
  };

  const onSubmitCallBackImages = async (imagesData) => {
    setImageUpdateData(imagesData);
    setTabIndex(2);
  };

  const onSubmitDocuments = async (documents) => {
    setUpdatedDocuments(documents);
    setTabIndex(3);
  };

  const onSubmitCallBackFacilities = async (facilitiesData) => {
    const data = await updateFacilitiesProperty(paramId, facilitiesData);
    if (data?.status === true) {
      bindUpdaedProperty();
      setMessageText("Property has been Updated SuccessFully");
      setOpenToast(true);
      setTimeout(() => {
        Router.push("/property").catch(console.error);
      }, 2000);
    } else {
      const errorMsg = data?.message;
      if(errorMsg.includes('property code'))
      {
        setMessageText("Please resubmit again with correct Property Code");
      } else {
        setMessageText("Please try again with correct data");
      }
      setErrorType("error");
      setOpenToast(true);
    }
  };

  const handlecitywithstateid = async (id) => {
    const data = await getCityContent(id);
    setCityContent(data?.results);
  };

  const searchManagerHandle = async (managerNumber) => {
    if (managerNumber) {
      const data = await getManagerWithNumber(managerNumber);
      if (data?.results.length > 0) {
        let formated = formatFacilities(data?.results);
        formated = formatManager(formated);
        setManagerResult((prev) => [...prev, formated[0]]);
      }
    }
  };

  const InitialRender = (data) => {
    const formated = formatManagerUpdate(data);
    setManagerResult(formated);
  };

  const backToStepOne = async (e) => {
    e.preventDefault();
    const stateData = await getStateContent(updatedPropertyData?.country?.id);
    setStateContent(stateData?.results);
    const cityData = await getCityContent(updatedPropertyData?.state?.id);
    setCityContent(cityData?.results);
    setTabIndex(0);
  };

  const backToStepTwo = async (e) => {
    e.preventDefault();
    setImageUpdateData(imageUpdateData);
    setTabIndex(1);
  };
  const backToStepThree = async (e) => {
    e.preventDefault();
    setImageUpdateData(imageUpdateData);
    setTabIndex(2);
  };

  const handleCancelAccount = () => {
    bindUpdaedProperty();
  };

  const renderComponentTab1 = () => {
    return (
      <AccountUpdatedDetails
        updatedpropertydata={updatedPropertyData}
        countrycontent={countryContent}
        statecontent={stateContent}
        citycontent={cityContent}
        facilitycontent={facilityContent}
        handlestatewithcountryid={handlestatewithcountryid}
        handlecitywithstateid={handlecitywithstateid}
        postupdatehandle={postUpdateHandle}
        propertyid={paramId}
        handleCancelAccount={handleCancelAccount}
        handlepropertyiddelete={handlepropertyiddelete}
        initAccountProp={initAccountProp}
      />
    );
  };

  const renderComponentTab2 = () => {
    return (
      <ImagesUpdateProperty
        imageupdatedata={imageUpdateData}
        initImagesData={initImages}
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
        menuImages={menuImages}
        videoFile={videoFile}
        fileVideos={fileVideos}
        handlepropertyiddelete={handlepropertyiddelete}
        onSubmitCallBackImages={onSubmitCallBackImages}
        propertyid={paramId}
        backToStepOne={backToStepOne}
      />
    );
  };

  const renderComponentTab4 = () => {
    return (
      <FacilitiesUpdateProperty
        updatedpropertydata={updatedPropertyData}
        imageupdatedata={imageUpdateData}
        InitialRender={InitialRender}
        paymentscontent={paymentContent}
        facilitycontent={facilityContent}
        searchManagerHandle={searchManagerHandle}
        managerResult={managerResult}
        propertyPostImages={propertyPostImages}
        onSubmitCallBackFacilities={onSubmitCallBackFacilities}
        updatedFacilitiesData={updatedFacilities}
        updatedPaymentsData={updatedPayments}
        managerUpdateData={managerData}
        backToStepThree={backToStepThree}
        handlepropertyiddelete={handlepropertyiddelete}
        propertyid={paramId}
        otherDocuments={updatedDocuments}
      />
    );
  };

  const renderComponentTab3 = () => {
    return (
      <DocumentsUpdateProperty
        filerepocontent={otherDocuments}
        deleteImagecallBack={deleteImagecallBack}
        postfilerepohandle={handlepostfilerepo}
        propertyPostImages={propertyPostImages}
        handlepropertyiddelete={handlepropertyiddelete}
        onSubmitCallBackImages={onSubmitDocuments}
        backToStepTwo={backToStepTwo}
      />
    );
  };

  useEffect(() => {
    setExteriorImages(fileRepo);
  }, [fileRepo]);

  useEffect(() => {
    setInteriorImages(fileRepoGallery);
  }, [fileRepoGallery]);

  useEffect(() => {
    setMenuImages(fileMenu);
  }, [fileMenu]);

  useEffect(() => {
    bindUpdaedProperty();
    bindCountryValuesContent();
    bindPaymentsContent();
    bindFacilitiesContent();
    bindVideoFile();
  }, []);
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 1,
      }}
    >
      <Typography sx={{ m: 2 }} variant="h4">
        Update Property
      </Typography>
      <Box sx={{ p: 3 }}>
        {/* <CustomTabs
        initialState={tabIndex}
        renderComponentTab1={() => renderComponentTab1()}
        renderComponentTab2={() => renderComponentTab2()}
        renderComponentTab3={() => renderComponentTab3()}
      /> */}
        <LinearStepper
          initialState={tabIndex}
          renderComponentTab1={() => renderComponentTab1()}
          renderComponentTab2={() => renderComponentTab2()}
          renderComponentTab3={() => renderComponentTab3()}
          renderComponentTab4={() => renderComponentTab4()}
        />
      </Box>
      {openToast && (
        <ToastBar
          isOpen={openToast}
          setIsOpen={setOpenToast}
          type={"success"}
          displayMessage={messageText}
        />
      )}
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
