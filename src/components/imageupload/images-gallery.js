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

export const ImagesGallery = ({ imagesData, handleImages, handleDeleteMastereId }) => {
  const [selectedImage, setSelectedImage] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const authContext = useContext(AuthContext);
  const inputRef = React.useRef(null);

  const handleDelete = (e, deleteId) => {
    setIsLoading(true);
    e.preventDefault();
    handleDeleteMastereId(deleteId)
    
    setIsLoading(false);
  };
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    })
  }

  const handleClick = async (e) => {
    const file = Object.values(e.target.files);
    const formatedFile = await convertBase64(file[0]);
    setSelectedImage(Object.values(e.target.files));
    let formData = new FormData();
    formData.append("title", file[0].name.split(".", 1)[0]);
    formData.append("created_by", authContext?.profile?.id);
    formData.append("file", file[0]);


    handleImages(formData)
    inputRef.current.value = "";
  };

  React.useEffect(() => {
    setSelectedImage(imagesData);
  }, [imagesData]);

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
                }}
              >
                <img
                  src={item?.file}
                  srcSet={item?.file}
                  alt={item?.title}
                  // loading="lazy"
                  style={{
                    height: "150px",
                    width: "inherit",
                    objectFit: "cover",
                    aspectRatio: "1 / 1",
                  }}
                />
                <ImageListItemBar
                  sx={{ background: "none", transform: "scale(0.9)" }}
                  key={`${item.img}-${index}-bar`}
                  position="top"
                  actionIcon={
                    <IconButton
                      aria-label={`star ${item.title}`}
                      onClick={(e) => handleDelete(e, item?.id)}
                    >
                      <DeleteIcon sx={{ color: pink[500] }} />
                    </IconButton>
                  }
                  actionPosition="right"
                />
              </ImageListItem>
            ) : (
              <Skeleton />
            );
          })
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "right",
              p: 6,
            }}
          >
            <Typography align="right" color="textPrimary" variant="body1">
              Your Gallery is Empty Yet,
            </Typography>
          </Box>
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
    </>
  );
};
