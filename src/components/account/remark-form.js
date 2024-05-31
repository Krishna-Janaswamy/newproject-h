import { useState, useContext, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Card, Divider, Grid, TextField } from "@mui/material";

export const RemarkForm = (props) => {
  const { postRemark, handleCancel } = props;

  const validate = Yup.object({
    remark: Yup.string()
      // .matches(/^[^-\s][a-zA-Z_\s-]+$/, "Only numeric values are allowed")
      .required("Fill proper remarks for rejecting the property")
      .min(6, "Minimum 10 characters are required")
      .max(200, "You have exceeded maximun characters"),
  });

  const formik = useFormik({
    initialValues: {
      remark: "",
    },
    enableReinitialize: true,
    handleChange: async () => {},
    validationSchema: validate,
    onSubmit: async (values) => {
      const result = { ...values };

      postRemark(result);
    },
  });

  return (
    <>
      <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
        <Grid container p={10} sx={{ justifyContent: "center"}}>
          <Grid item>
            <TextField
              fullWidth
              error={formik.touched.remark && Boolean(formik.errors.remark)}
              helperText={formik.touched.remark && formik.errors.remark}
              label="Remarks"
              id="remark"
              name="remark"
              multiline
              onChange={formik.handleChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
              value={formik.values.remark}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            sx={{
              "&:focus": {
                outline: "1px black solid",
                transform: "scale(0.9)",
              },
            }}
            onClick={handleCancel}
          >
            Cancel
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
            Submit
          </Button>
        </Box>
      </form>
    </>
  );
};
