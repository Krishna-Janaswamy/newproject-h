import React, { useState, useContext, useEffect, useMemo } from "react";
import { AuthContext } from "../../contexts/auth-context";
import Button from "@mui/material/Button";
import { Box, Container, Grid, Pagination, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import ImageList from "@mui/material/ImageList";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ImageListItem from "@mui/material/ImageListItem";
import DeleteIcon from "@mui/icons-material/Delete";
import { pink } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";

export const ImagesCheckBoxes = ({
  imagesData,
  handleImages,
  handleDeleteMastereId,
  handleSave,
  galleryType,
  isUpdate,
}) => {
  const [selectedImage, setSelectedImage] = React.useState([{ isSelected: "" }]);
  const [isLoading, setIsLoading] = React.useState(false);
  const authContext = useContext(AuthContext);
  const inputRef = React.useRef(null);
  const [enabelDelete, setEnabelDelete] = useState(true);

  const urlImageUpdate = process.env.NEXT_PUBLIC_API_URL;

  const handleDelete = (e) => {
    setIsLoading(true);
    e.preventDefault();
    const selectedItem = imagesData.filter((image) => image.isSelected === true);
    handleDeleteMastereId(selectedItem[0]?.id, galleryType);

    setIsLoading(false);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const file = Object.values(e.target.files);
    setSelectedImage(Object.values(e.target.files));
    let formData = new FormData();
    formData.append("title", file[0].name.split(".", 1)[0]);
    formData.append("created_by", authContext?.profile?.id);
    formData.append("file", file[0]);
    handleImages(formData, galleryType);
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
    handleSave(galleryType, savedValue);
    setSelectedImage(updateSelect);
  };

  React.useEffect(() => {
    const selectedId = selectedImage && selectedImage.filter((item) => item?.isSelected === true);
    if (selectedId.length === 1) {
      setEnabelDelete(false);
    } else {
      setEnabelDelete(true);
    }
  }, [selectedImage]);

  React.useEffect(() => {
    if (imagesData) {
      setSelectedImage(imagesData);
      if (isUpdate) {
        handleSave(galleryType, imagesData);
      }
    }
  }, [imagesData]);

  return (
    <>
      {imagesData && imagesData.length !== 0 ? (
        <ImageList cols={4} gap={25} sx={{ width: 600, height: "auto" }}>
          {imagesData.map((item, index) => {
            return !isLoading ? (
              <ImageListItem
                key={`${item?.id}-${index}`}
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
                  key={`${item?.title}-${index}-bar`}
                  position="top"
                  actionIcon={
                    <Checkbox
                      sx={{ color: "black" }}
                      key={`${item?.title}_${index}`}
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
            ) : (
              <Skeleton />
            );
          })}
        </ImageList>
      ) : (
        <ImageList sx={{ width: 500, height: "auto", mt: 5, mb: 5, ml: 16 }}>
          <Typography align="right" color="textPrimary" variant="body1">
            Your Gallery is Empty
          </Typography>
        </ImageList>
      )}

      <Button
        variant="contained"
        component="label"
        onChange={(event) => event.preventDefault()}
        sx={{ margin: 2 }}
        position="right"
      >
        Upload
        <input
          hidden
          accept="image/*"
          //   multiple
          ref={inputRef}
          type="file"
          onChange={(event) => {
            event.preventDefault();
            handleClick(event);
          }}
        />
      </Button>
      {/* {selectedImage.length !== 0 && (
        <Button
          variant="contained"
          component="label"
          disabled={enabelDelete}
          onClick={(e) => handleDelete(e)}
          onChange={(event) => event.preventDefault()}
          sx={{ margin: 2 }}
          position="right"
        >
          Delete
        </Button>
      )} */}
    </>
  );
};
