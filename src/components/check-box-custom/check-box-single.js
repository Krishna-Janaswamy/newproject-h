import React, { memo } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import PropTypes from "prop-types";
import { margin } from "@mui/system";

export const CheckSingleCustom = (props) => {
  const { checkBoxesContent, handleName, ischeckAll, checkBoxTitle, titleClass } = props;
  const [checkBoxes, setCheckBox] = React.useState([]);
//   const [checkAll, setCheckAll] = React.useState(false);

//   const handleCheckAll = (event) => {
//     const values = [...checkBoxes];
//     const checkAllTrue =
//       values &&
//       values.map((item) => {
//         item.isSelected = event.target.checked;
//       });
//     setCheckBox(values);
//     setCheckAll(!checkAll);
//   };

  const handleCheckBoxes = (event, index, selectedId) => {
    const value = [...checkBoxes];
    const updateSelect =
      value &&
      value.map((item) => {
        if (item?.id === selectedId) {
          item.isSelected = event.target.checked;
        } else {
            item.isSelected = false; 
        }
        return item;
      });
    // value[index].isSelected = event.target.checked;
   
    setCheckBox(updateSelect);
  };

  React.useEffect(() => {
    const stateTrue =
      checkBoxesContent && checkBoxesContent.filter((item) => item.isSelected == true);
    if (checkBoxesContent) {
      setCheckBox(checkBoxesContent);
    }
  }, [checkBoxesContent]);
  React.useEffect(() => {
    handleName(checkBoxes);
  }, [checkBoxes]);
  
  return (
    <>
      <FormLabel component="legend" sx={titleClass}>
        {checkBoxTitle}
      </FormLabel>
      <FormGroup aria-label="position" row sx={{ margin: 4, gap: 3 }}>
        {checkBoxes?.map((checkBox, index) => (
          <FormControlLabel
            label={checkBox?.name}
            key={`${checkBox?.id}-${index}`}
            control={
              <Checkbox
                key={`${checkBox?.name}_${index}`}
                inputProps={{ "aria-label": "controlled" }}
                checked={
                  checkBox?.isSelected !== undefined &&
                  checkBox?.isSelected !== "" &&
                  checkBox?.isSelected !== null &&
                  checkBox?.isSelected
                }
                onChange={(e) => handleCheckBoxes(e, index, checkBox?.id)}
                sx={{
                  "&:focus": {
                    transform: "scale(0.9)",
                  },
                }}
              />
            }
          />
        ))}
      </FormGroup>
    </>
  );
};

CheckSingleCustom.defaultProps = {
  ischeckAll: false,
};

CheckSingleCustom.propTypes = {
  ischeckAll: PropTypes.bool,
};

export default memo(CheckSingleCustom);
