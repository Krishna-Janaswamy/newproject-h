import * as React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Stack from "@mui/material/Stack";

export const BasicUploadButton = (props) => {
  const { buttonTitle, isDisabled } = props;
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Button variant="contained" component="label" disabled={isDisabled}>
        {buttonTitle}
        <input hidden accept="image/*" multiple type="file" />
      </Button>
    </Stack>
  );
};
