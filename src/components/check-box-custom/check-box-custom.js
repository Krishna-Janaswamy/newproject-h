import React, { memo } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import PropTypes from "prop-types";
import { margin } from "@mui/system";

export const CheckBoxCustom = (props) => {
  const { checkBoxesContent, handleName, ischeckAll, checkBoxTitle, titleClass } = props;
  const [checkBoxes, setCheckBox] = React.useState([]);
  const [checkAll, setCheckAll] = React.useState(false);

  const handleCheckAll = (event) => {
    const values = [...checkBoxes];
    const checkAllTrue =
      values &&
      values.map((item) => {
        item.isSelected = event.target.checked;
      });
    setCheckBox(values);
    setCheckAll(!checkAll);
  };

  const handleCheckBoxes = (event, index) => {
    const value = [...checkBoxes];
    value[index].isSelected = event.target.checked;
    const stateTrue = value.filter((item) => item.isSelected === true);
    if (value.length === stateTrue.length) {
      setCheckAll(true);
    }
    if (value.length !== stateTrue.length) {
      setCheckAll(false);
    }
    setCheckBox(value);
  };

  React.useEffect(() => {
    const stateTrue =
      checkBoxesContent && checkBoxesContent.filter((item) => item.isSelected == true);
    if (checkBoxesContent && checkBoxesContent.length === stateTrue.length) {
      setCheckBox(checkBoxesContent);
      setCheckAll(true);
    } else {
      setCheckBox(checkBoxesContent);
      setCheckAll(false);
    }
  }, [checkBoxesContent]);
  React.useEffect(() => {
    handleName(checkBoxes);
  }, [checkBoxes]);

  // React.useEffect(() => {
  //   setCheckAll(false);
  // }, []);
  return (
    <>
      <FormLabel component="legend" sx={titleClass}>
        {checkBoxTitle}
      </FormLabel>
      <FormGroup aria-label="position" row sx={{ margin: 4, gap: 3 }}>
        {ischeckAll && (
          <FormControlLabel
            label="Check All"
            control={<Checkbox checked={checkAll} onChange={(e) => handleCheckAll(e)} />}
          />
        )}
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
                onChange={(e) => handleCheckBoxes(e, index)}
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

CheckBoxCustom.defaultProps = {
  ischeckAll: false,
};

CheckBoxCustom.propTypes = {
  ischeckAll: PropTypes.bool,
};

export default memo(CheckBoxCustom);
