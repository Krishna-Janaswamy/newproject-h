import React, { useState, useContext, useEffect, useMemo } from "react";
import { AuthContext } from "../../contexts/auth-context";
import Button from "@mui/material/Button";
import { Box, Container, Grid, Pagination, Typography, FormLabel, useTheme } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import ImageList from "@mui/material/ImageList";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ImageListItem from "@mui/material/ImageListItem";
import DeleteIcon from "@mui/icons-material/Delete";
import { pink } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";
import PropTypes from "prop-types";

export const ImageUploadButton = ({
  imagesData,
  handleImages,
  handlesave,
  isUpdate,
  error,
  helperText,
  buttonTitle,
}) => {
  const [selectedImage, setSelectedImage] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const authContext = useContext(AuthContext);
  const inputRef = React.useRef(null);
  const [enabelDelete, setEnabelDelete] = useState(true);
  const theme = useTheme();

  const urlImageUpdate = process.env.NEXT_PUBLIC_API_URL;

  const handleClick = async (e) => {
    e.preventDefault();
    const file = Object.values(e.target.files);
    setSelectedImage(Object.values(e.target.files));
    let formData = new FormData();
    formData.append("title", file[0].name.split(".", 1)[0]);
    formData.append("created_by", authContext?.profile?.id);
    formData.append("file", file[0]);
    handleImages(formData);
    inputRef.current.value = "";
  };

  const handleCheckBoxes = (event, selectedId) => {
    event.stopPropagation();
    const value = [...imagesData];
    const updateSelect =
      value &&
      value.map((item) => {
        if (item?.id === selectedId) {
          item.isSelected = event.target.checked;
        }
        return item;
      });
    const selectTrueId = updateSelect && updateSelect.filter((item) => item?.isSelected === true);
    const savedValue = isUpdate ? updateSelect : selectTrueId;
    handlesave(savedValue);
    setSelectedImage(updateSelect);
  };

  React.useEffect(() => {
    const selectedId = selectedImage && selectedImage.filter((item) => item?.isSelected === true);
    if (selectedId && selectedId.length === 1) {
      setEnabelDelete(false);
    } else {
      setEnabelDelete(true);
    }
  }, [selectedImage]);

  React.useEffect(() => {
    if (imagesData) {
      setSelectedImage(imagesData);
      if (isUpdate) {
        handlesave(imagesData);
      }
    }
  }, [imagesData]);

  return (
    <>
      {buttonTitle && (
        <FormLabel component="legend" sx={{ mt: 2, ml: 4 }}>
          {buttonTitle}
        </FormLabel>
      )}
      <Button
        variant="contained"
        component="label"
        onChange={(event) => event.preventDefault()}
        sx={{
          margin: 4,
          "&:focus": {
            outline: '1px solid black',
            transform: "scale(0.9)",
          },
        }}
        position="right"
      >
        Upload
        <input
          hidden
          accept="image/*"
          //   multiple
          ref={inputRef}
          error={error === 1 ? true : undefined}
          id="image-input"
          type="file"
          onChange={(event) => {
            event.preventDefault();
            handleClick(event);
          }}
        />
      </Button>
      {error === 1 && (
        <label htmlFor="image-input">
          <Typography sx={{ color: theme.palette.error.light, ml: 3 }} gutterBottom variant="body1">
            {helperText}
          </Typography>
        </label>
      )}
      {imagesData && imagesData.length !== 0 ? (
        <Grid
          container
          rowSpacing={3}
          columnSpacing={{ xs: 1, sm: 1, md: 20 }}
          columns={{ xs: 1, md: 16 }}
        >
          {/* <ImageList  gap={25} sx={{ height: "auto" }}> */}
          {imagesData.map((item, index) => {
            return !isLoading ? (
              <Grid item xs={1} sm={1} md={4} key={`${item?.id}-${index}-item`}>
                <ImageListItem
                  key={`${item?.id}-${index}-itemUpload`}
                  sx={{
                    width: "150px",
                    height: "150px",
                    margin: 2,
                    borderRadius: "1.5rem",
                    transform: item?.isSelected && "scale(0.9)",
                  }}
                >
                  <img
                    src={`${urlImageUpdate}${item?.file}`}
                    srcSet={`${urlImageUpdate}${item?.file}`}
                    alt={item?.title}
                    loading="lazy"
                    style={{
                      height: "150px",
                      width: "inherit",
                      objectFit: "cover",
                      aspectRatio: "1 / 1",
                    }}
                  />
                  <ImageListItemBar
                    sx={{ background: "none" }}
                    key={`${item?.title}-${index}-barItem`}
                    position="top"
                    actionIcon={
                      <Checkbox
                        sx={{ color: "black" }}
                        key={`${item?.title}_${index}-checkUpload`}
                        inputProps={{ "aria-label": "controlled" }}
                        checked={
                          item?.isSelected !== undefined &&
                          item?.isSelected !== "" &&
                          item?.isSelected !== null &&
                          item?.isSelected
                        }
                        onChange={(e) => handleCheckBoxes(e, item?.id)}
                      />
                    }
                    actionPosition="right"
                  />
                </ImageListItem>
              </Grid>
            ) : (
              <Skeleton />
            );
          })}
          {/* </ImageList> */}
        </Grid>
      ) : (
        <ImageList sx={{ width: 500, height: "auto", mt: 5, mb: 5, ml: 16 }}>
          <Typography align="right" color="textPrimary" variant="body1">
            {/* Your Gallery is Empty */}
          </Typography>
        </ImageList>
      )}
    </>
  );
};

ImageUploadButton.defaultProps = {
  error: 0,
};

ImageUploadButton.propTypes = {
  error: PropTypes.number,
};
