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

export const ImagesInteriorCheckBoxes = ({
  imagesData,
  handleImages,
  handleDeleteMastereId,
  handleInteriorSave,
}) => {
  const [selectedImage, setSelectedImage] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const authContext = useContext(AuthContext);
  const inputRef = React.useRef(null);
  const [enabelDelete, setEnabelDelete] = useState(true);

  const handleDelete = (e) => {
    setIsLoading(true);
    e.preventDefault();
    const selectedItem = imagesData.filter((image) => image.isSelected === true);
    handleDeleteMastereId(selectedItem[0]?.id);

    setIsLoading(false);
  };
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const file = Object.values(e.target.files);
    const formatedFile = await convertBase64(file[0]);
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
    const updateSelect = value.map((item) => {
      if (item?.id === selectedId) {
        item.isSelected = event.target.checked;
      }
      return item;
    });
    const selectTrueId = updateSelect.filter((item) => item.isSelected === true);
    handleInteriorSave(selectTrueId);
    setSelectedImage(updateSelect);
  };

  React.useEffect(() => {
    const selectedId = selectedImage.filter((item) => item.isSelected === true);
    if (selectedId.length === 1) {
      setEnabelDelete(false);
    } else {
      setEnabelDelete(true);
    }
  }, [selectedImage]);

  React.useEffect(() => {
    setSelectedImage(imagesData);
  }, []);

  return (
    <>
      <ImageList cols={4} gap={25}>
        {imagesData.length !== 0 ? (
          imagesData.map((item, index) => {
            return !isLoading ? (
              <ImageListItem
                key={`${item.id}-${index}`}
                sx={{
                  width: "150px",
                  height: "150px",
                  margin: 2,
                  borderRadius: "1.5rem",
                  transform: item?.isSelected && "scale(0.9)",
                }}
              >
                <img
                  src={item?.file}
                  srcSet={item?.file}
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
                  key={`${item.img}-${index}-bar`}
                  position="top"
                  actionIcon={
                    <Checkbox
                      sx={{ color: "black" }}
                      key={`${item?.title}_${index}`}
                      checked={item?.isSelected}
                      onChange={(e) => handleCheckBoxes(e, item?.id)}
                    />
                  }
                  actionPosition="right"
                />
              </ImageListItem>
            ) : (
              <Skeleton />
            );
          })
        ) : (
          <ImageList cols={1}>
            <Typography align="right" color="textPrimary" variant="body1">
              Your Gallery is Empty Yet,
            </Typography>
          </ImageList>
        )}
      </ImageList>

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
      {selectedImage.length !== 0 && (
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
      )}
    </>
  );
};
