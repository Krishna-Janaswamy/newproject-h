import { useState, useContext, useEffect, useMemo, useRef } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { useFormik, FormikProvider } from "formik";
import Fade from "@mui/material/Fade";
import Badge from "@mui/material/Badge";
import CircularProgress from "@mui/material/CircularProgress";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
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
  Avatar,
  Typography,
  IconButton,
} from "@mui/material";
import AddAPhotoRoundedIcon from "@mui/icons-material/AddAPhotoRounded";
import { CustomizedDialogs } from "../modalpopup/modal-pop-up";
import { Pattern } from "@mui/icons-material";

export const ProfileImagePreview = (props) => {
  const { profiledata, handleimages, loading } = props;
  const [openAccountPopover, setOpenAccountPopover] = useState(false);
  const [imageTypeError, setImageTypeError] = useState(false);
  const [sizeError, setSizeError] = useState(false)
  const inputRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const urlImageUpdate = process.env.NEXT_PUBLIC_API_URL;

  const authContext = useContext(AuthContext);
  const theme = useTheme();

  const bodyComp = () => {
    return (
      <Grid sx={{ flexGrow: 1 }} container spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={12}>
            {profiledata?.role.map((role) => (
              <Grid key={`${role.name}-${role?.id}`} item>
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    width: "130px",
                    height: "130px",
                    textAlign: "center",
                    "&:focus": {
                      transform: "scale(0.9)",
                    },
                  }}
                  key={`${role.name}-${role?.id}`}
                >
                  {role?.name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const file = Object.values(e.target.files);
    const Pattern = 'image/*';
    const fiveKb = 5120;
    if (file[0].type.match(Pattern)) {
     if (file[0].size <= fiveKb) {
      let formData = new FormData();
      formData.append("file_name", file[0]);
      handleimages(formData);
      inputRef.current.value = "";
      setSizeError(false);
     } else {
      setSizeError(true);
     }
    setImageTypeError(false);
    } else {
      setImageTypeError(true);
      setSizeError(false);
    }
  };

  const validate = Yup.object({
    first_name: Yup.string("First name is required").required("First name is required"),
  });

  const formik = useFormik({
    initialValues: {
      file_name: `${urlImageUpdate}${profiledata?.profile?.file_name}`,
    },
    enableReinitialize: true,
    validationSchema: validate,
    onChange: async (values) => {},
    onSubmit: async (values) => {},
  });

  const handleModal = () => {
    // authContext.updateRole("USER");
    setModalOpen(!modalOpen);
  };


  return (
    <FormikProvider value={formik}>
      <form
        autoComplete="off"
        noValidate
        // onSubmit={formik.handleSubmit}
        // onChange={formik.handleChange}
      >
        <Box sx={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
          <Card sx={{ background: "" }}>
            <CardHeader subheader="" title="Profile Image" sx={{ textAlign: "center" }} />
            <Divider />
            <CardContent sx={{ justifyContent: "center", display: "flex", position: "relative" }}>
              {!loading && (
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <Button
                      variant="contained"
                      component="label"
                      sx={{
                        width: "15px",
                        height: "40px",
                        borderRadius: "2rem",
                        "&:focus": {
                          transform: "scale(0.9)",
                        },
                      }}
                      disabled
                      onChange={(event) => event.preventDefault()}
                      endIcon={<FileUploadRoundedIcon sx={{ mr: 1 }} fontSize="large" />}
                    >
                      <input
                        hidden
                        accept=".png, .jpg, .jpeg"
                        //   multiple
                        ref={inputRef}
                        id="image-input"
                        type="file"
                        onChange={(event) => {
                          event.preventDefault();
                          handleClick(event);
                        }}
                      />
                    </Button>
                  }
                >
                  <Avatar
                    onClick={() => setOpenAccountPopover(true)}
                    sx={{
                      height: 150,
                      width: 150,
                    }}
                    src={formik.values.file_name}
                  />
                </Badge>
              )}
              {loading && (
                <Fade
                  in={loading}
                  style={{
                    transitionDelay: loading ? "800ms" : "0ms",
                  }}
                  sx={{
                    height: 150,
                    width: 150,
                  }}
                  unmountOnExit
                >
                  <CircularProgress />
                </Fade>
              )}
            </CardContent>
            {imageTypeError && (
                  <Typography
                    sx={{ color: theme.palette.error.light, ml: 6 }}
                    gutterBottom
                    variant="body1"
                  >
                  Only files with following extensions are allowed: jpeg, jpg, png.
                  </Typography>
                )}
                 {sizeError && (
                  <Typography
                    sx={{ color: theme.palette.error.light, ml: 6 }}
                    gutterBottom
                    variant="body1"
                  >
                    * Image size should be less than 5kb
                  </Typography>
                )}

            <Box
              sx={{
                display: "flex",
                flexDirection: 'column',
                justifyContent: "center",
                alignItems: "center",
                rowGap: "15px",
                p: 2,
              }}
            >
              {/* <>
                <Typography>Role</Typography>
                <Typography>{authContext?.role?.replace("_", " ")}</Typography>
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    "&:focus": {
                      transform: "scale(0.9)",
                    },
                  }}
                  onClick={() => handleModal()}
                  disabled
                >
                  Switch
                </Button>
                {modalOpen && (
                  <CustomizedDialogs
                    modalTitle="Switch Role"
                    isOpen={modalOpen}
                    setIsOpen={setModalOpen}
                    customstyle={{
                      width: "750px",
                      height: "350px",
                    }}
                    renderComponent={bodyComp}
                  />
                )}
              </> */}
            </Box>
          </Card>
        </Box>
      </form>
    </FormikProvider>
  );
};
