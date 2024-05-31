import React, { useEffect, useState, useContext } from "react";
import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
// import { AccountProfile } from "../components/account/account-profile";
import { PersonalInfoDetails } from "../components/account/account-personal-details";
import { DashboardLayout } from "../components/dashboard-layout";
import {
  getProfileData,
  patchGenderData,
  patchProfileData,
  patchProfileImage,
  postAccountEmailVerification,
} from "../service/account.service";
import { AuthContext } from "../contexts/auth-context";
import { getGenderContent } from "../service/content.service";
import { ToastBar } from "../components/toast-bar/toast-bar";
import Slide from "@mui/material/Slide";
import { ProfileImagePreview } from "../components/account/profile-image-preview";
import { setProfileAuth } from "../service/identity.service";

const Page = () => {
  const [profileData, setProfileData] = useState({});
  const [genderContent, setGenderContent] = useState([]);
  const [openToast, setOpenToast] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [typeText, setTypeText] = useState("");
  const [transition, setTransition] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const [inputOpen, setInputOpen] = useState(false);

  const bindProfileData = async () => {
    // const data = await getProfileData();
    fetch('/api/profile')
    .then((response) => response.json())
    .then((data) =>  {
    setProfileData(data?.results);
    authContext.updateProfile(data?.results);
    setProfileAuth(data?.results)
  })};

  // const bindGenderData = async () => {
  //   const data = await getGenderContent();
  //   setGenderContent(data?.results);
  // };

  const postProfileData = async (value) => {
    // const data = await patchProfileData(value);
    // const genderData = await patchGenderData(value);
    // if (data?.status && genderData?.status) {
      // bindProfileData();
      setOpenToast(true);
      setMessageText("Data Saved Successfully State is not implemented here though!!!");
      setTypeText("success");
      getTransition(TransitionDown);
    // } else {
    //   setOpenToast(true);
    //   setMessageText("Ooops please try again!!!");
    //   setTypeText("error");
    //   getTransition(TransitionDown);
    // }
  };

  const TransitionDown = (props) => {
    return <Slide {...props} direction="down" />;
  };

  const onSubmitCallBack = (data) => {
    postProfileData(data);
  };
  const handleImages = async (data) => {
    setIsLoading(true);
    const res = await patchProfileImage(data);
    if (res?.status === true) {
      bindProfileData();
      setOpenToast(true);
      setMessageText("Data Saved Successfully!!!");
      setTypeText("success");
      getTransition(TransitionDown);
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
      
    } else {
      setOpenToast(true);
      setMessageText("Ooops please try again!!!");
      setTypeText("error");
      getTransition(TransitionDown);
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
    
  };

  const handleEmailVerification = async (email) => {
    if (email) {
      const result = await postAccountEmailVerification(email);
    }

  }

  useEffect(() => {
    bindProfileData();
  }, []);

  // useEffect(() => {
  //   bindGenderData();
  // }, []);

  const getTransition = (Transition) => {
    setTransition(() => Transition);
  };

  return (
    <>
      <Head>
        <title>Profile | ProjectK</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 1,
        }}
      >
        <Container>
          <Typography sx={{ mb: 3 }} variant="h4">
            Profile
          </Typography>
          <Grid container spacing={3}>
            <Grid item lg={4} md={6} xs={12}>
              <ProfileImagePreview profiledata={profileData} handleimages={handleImages} loading={isLoading}/>
            </Grid>
            <Grid item lg={8} md={6} xs={12}>
              <PersonalInfoDetails
                profiledata={profileData}
                // gendercontent={genderContent}
                postprofiledata={onSubmitCallBack}
                getTransition={getTransition}
                handleEmailVerification={handleEmailVerification}
                inputOpen={inputOpen}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      {openToast && (
        <ToastBar
          isOpen={openToast}
          setIsOpen={setOpenToast}
          type={typeText}
          displayMessage={messageText}
          transition={transition}
        />
      )}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
