import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/auth-context";
import Button from "@mui/material/Button";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

export const MultiImages = ({
  imagesData,
  handleImages,
  handleSave,
  galleryType,
  isUpdate,
  typeOfInput,
  multiple,
  setSelectedImage,
  handleSizeError,
  handleTypeError,
  isVideo,
  isDoc,
}) => {
  const authContext = useContext(AuthContext);
  const inputRef = React.useRef(null);

  const handleClick = async (e) => {
    e.preventDefault();
    const files = Object.values(e.target.files);
    let formData = new FormData();
    const Pattern = typeOfInput;
    const oneMBtoBytes = 0.000001;
    const oneMBtoKB = 0.001;
    const fivekb = 50000;
    const tenMB = 10485760;
    const twoMB = 2097152;
    let typeErrorMsg = '';
    let sizeErrorMsg = ''
    if(typeOfInput === 'image/*') {
      typeErrorMsg = 'Only files with following extensions are allowed: jpeg, jpg, png.'
      sizeErrorMsg = 'Image size should be below 50kb'
    }
    if(typeOfInput === 'video/*') {
      typeErrorMsg = 'Upload valid video formate'
      sizeErrorMsg = 'Video size should be below 10mb'
    }
    if(typeOfInput === 'application/pdf') {
      typeErrorMsg = 'Only files with extension pdf is allowed'
      sizeErrorMsg = 'Image size should be below 2mb'
    }
    const sizeCheck = isVideo ? tenMB : isDoc ? twoMB : fivekb;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.match(Pattern)) {
        if (files[i].size <= sizeCheck) {
          files[i].sizeError = false;
        } else {
          files[i].sizeError = true;
        }
      } else {
        files[i].typeError = true;
        files[i].sizeError = false;
      }
    }
    const sizeError = files.filter((item) => item.sizeError === true);
    const typeError = files.filter((item) => item.typeError === true);

    if (typeError.length) {
      handleTypeError(typeErrorMsg, galleryType);
    }

    if (sizeError.length) {
      handleSizeError(sizeErrorMsg, galleryType);
    }

    if (typeError.length === 0 && sizeError.length === 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append("title", files[i].name);
        // formData.append("title", files[i].name.split(".", 1)[0]);
        formData.append("created_by", authContext?.profile?.id);
        formData.append("file", files[i]);
      }

      handleImages(formData, galleryType);
      handleSizeError('', galleryType);
      handleTypeError('', galleryType);
      inputRef.current.value = "";
    }
  };

  React.useEffect(() => {
    if (imagesData) {
      setSelectedImage(imagesData);
      if (isUpdate) {
        handleSave(galleryType, imagesData);
      }
    }
  }, [imagesData, galleryType, handleSave]);

  return (
    <>
      <Button
        component="label"
        onChange={(event) => event.preventDefault()}
        endIcon={<CloudUploadOutlinedIcon />}
        sx={{ margin: 2, backgroundColor: "#f5f5f5", border: "1.5px solid grey" }}
      >
        Upload file
        <input
          hidden
          accept={typeOfInput}
          multiple={!multiple}
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
