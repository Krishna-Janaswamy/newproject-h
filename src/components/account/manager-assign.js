import { useState, useContext, useRef, useMemo, useEffect } from "react";
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
  SvgIcon,
  InputAdornment,
  FormLabel,
  CircularProgress,
} from "@mui/material";
import { filterIdToPost, filterManagerMobile } from "../../utils/method";
import { CheckSingleCustom } from "../check-box-custom/check-box-single";
import CheckBoxCustom from "../check-box-custom/check-box-custom";

export const ManagerAssignment = (props) => {
  const {
    searchManagerHandle,
    managerResult,
    roleResult,
    onSubmitManager,
    listProperty,
    roleFallBack,
    managerError,
  } = props;
  const [searchManager, setSearchManager] = useState([]);
  const inputRef = useRef(null);
  const inputRefProperty = useRef(null);
  const [checkError, setCeckError] = useState(false);
  const [checkRole, setCheckRole] = useState(false);
  const authContext = useContext(AuthContext);
  const theme = useTheme();
  const [disableSearch, setDisableSearch] = useState(false);
  const [newNumberCheck, setNewNumberCheck] = useState(false);
  const [propertyID, setPropertID] = useState("");
  const [arrayManager, setArrayManager] = useState([]);

  const validate = Yup.object({
    property:
      (propertyID === 0 || propertyID === "") && Yup.string().required("Select the property Id"),
    manager: searchManager.length === 0 && Yup.string().required("Select the manager for"),
  });

  const formik = useFormik({
    initialValues: {
      manager: "",
      property: "",
      managerId: "",
    },
    // enableReinitialize: true,
    handleChange: async () => {},
    validationSchema: validate,
    onSubmit: async (values) => {
      const result = { ...values };
      result.managerId = filterIdToPost(searchManager)[0];
      if (searchManager.length !== 0) {
        setCeckError(false);
      } else {
        setCeckError(true);
      }

      if (searchManager.length !== 0) {
        setCeckError(false);
        setCheckRole(false);
        setNewNumberCheck(false);
        onSubmitManager(result);
        setDisableSearch(true);
        formik.setFieldValue("property", "");
        formik.setFieldValue("manager", "");
        setPropertID("");
        inputRef.current.value = "";
        inputRefProperty.current.value = "";
        setArrayManager([]);
        setSearchManager([]);
        formik.resetForm();
      }
    },
  });

  const getUpdatedManager = (data) => {
    const updatedManager = data.filter((item) => item?.isSelected);
    setSearchManager(updatedManager);
  };
  // const getUpdatedRole = (data) => {
  //   const updatedRole = data.filter((item) => item?.isSelected);
  //   setRoleData(updatedRole);
  //   roleFallBack(updatedRole);
  // };

  const handleManager = (e, data) => {
    e.preventDefault();
    if (data.length === 10) {
      setTimeout(() => {
        searchManagerHandle(data);
      }, 3000);
    }
  };

  useEffect(() => {
    setArrayManager(filterManagerMobile(managerResult));
  }, [managerResult]);

  return (
    <>
      <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
        <Box sx={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }} mt={3}>
          <Card sx={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", p: 8 }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{}}>
              <Grid item xs={6}>
                <FormLabel component="legend" sx={{ m: 3 }}>
                  Select for Manager*
                </FormLabel>
                <TextField
                  error={formik.touched.manager && Boolean(formik.errors.manager)}
                  helperText={"Enter Mobile Number"}
                  // label="Select for Manager"
                  name="manager"
                  id="manager"
                  inputRef={inputRef}
                  sx={{ m: 2 }}
                  onChange={(e) => {
                    setTimeout(() => {
                      if (!arrayManager.includes(e.target.value)) {
                        formik.setFieldValue("manager", e.target.value);
                        setDisableSearch(false);
                        setNewNumberCheck(false);
                      } else {
                        setDisableSearch(true);
                        setNewNumberCheck(true);
                      }
                    }, 2000);
                    inputRef.current.value = e.target.value;
                  }}
                  fullWidth
                  onKeyDown={(keyEvent) => {
                    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
                      keyEvent.preventDefault();
                    }
                  }}
                  required
                  variant="outlined"
                />
                <Button
                  onClick={(e) => {
                    if (!arrayManager.includes(formik.values.manager)) {
                      handleManager(e, formik.values.manager);
                      setDisableSearch(false);
                      setNewNumberCheck(false);
                    } else {
                      setDisableSearch(true);
                      setNewNumberCheck(true);
                    }
                  }}
                  sx={{ p: 2, ml: 2, mt: 2 }}
                  variant="contained"
                  disabled={
                    formik.values.manager.length <= 9 ||
                    formik.values.manager.length >= 11 ||
                    disableSearch
                  }
                  // endIcon={isLoadingIcon ? <CircularProgress color="secondary" size={16} /> : null}
                >
                  Search
                </Button>
                {managerResult.length > 0 && (
                  <CheckSingleCustom
                    titleClass={{ mt: -3, ml: -6 }}
                    checkBoxesContent={managerResult}
                    handleName={getUpdatedManager}
                  />
                )}
                {checkError && (
                  <Typography
                    sx={{ color: theme.palette.error.light, ml: 3 }}
                    gutterBottom
                    variant="body1"
                  >
                    Selection is required
                  </Typography>
                )}
                {newNumberCheck && (
                  <Typography
                    sx={{ color: theme.palette.error.light, ml: 3 }}
                    gutterBottom
                    variant="body1"
                  >
                    Entered Number is already in the list
                  </Typography>
                )}
                {managerError && (
                  <Typography
                    sx={{ color: theme.palette.error.light, ml: 3 }}
                    gutterBottom
                    variant="body1"
                  >
                    {managerError}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={6}>
                <FormLabel component="legend" sx={{ m: 3 }}>
                  Select Property*
                </FormLabel>
                <TextField
                  error={formik.touched.property && Boolean(formik.errors.property)}
                  helperText={formik.touched.property && formik.errors.property}
                  // label="Select Property"
                  id="property"
                  name="property"
                  inputRef={inputRefProperty}
                  fullWidth
                  sx={{ m: 2 }}
                  value={formik.values.property}
                  onChange={(e) => {
                    setPropertID(e.target.value);
                    formik.setFieldValue("property", e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                  select
                  required
                  SelectProps={{ native: true }}
                  hiddenLabel
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                >
                  <option key={"defaultSelect"} value="">
                    {"Select"}
                  </option>
                  {listProperty &&
                    listProperty.map((option, index) => (
                      <option key={`${option.name}-${index}`} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                </TextField>
              </Grid>
              {/* <Grid item md={6} xs={12}>
                 <FormLabel component="legend" sx={{ ml: 4, mb: 2 }}>
                  Select Roles
                </FormLabel>
                <CheckBoxCustom
                  titleClass={{ mt: -3, ml: -6 }}
                  checkBoxesContent={roleResult}
                  handleName={getUpdatedRole}
                />
                {checkRole && (
                  <Typography
                    sx={{ color: theme.palette.error.light, ml: 3 }}
                    gutterBottom
                    variant="body1"
                  >
                    Selection is requiered
                  </Typography>
                )}
              </Grid> */}
            </Grid>
            <Grid
              container
              spacing={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 1,
              }}
            >
              <Grid item>
                <Button
                  onClick={formik.handleSubmit}
                  sx={{
                    "&:focus": {
                      transform: "scale(0.9)",
                    },
                  }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Box>
      </form>
    </>
  );
};
