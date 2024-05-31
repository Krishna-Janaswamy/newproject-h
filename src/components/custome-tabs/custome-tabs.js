import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const CustomTabs = (props) => {
  const {
    isHandleChange,
    initialState,
    renderComponentTab1,
    renderComponentTab2,
    renderComponentTab3,
  } = props;
  const [value, setValue] = React.useState(initialState);

  const handleChange = (event, newValue) => {
    if (isHandleChange) {
      setValue(newValue);
    }
  };

  React.useEffect(() => {
    setValue(initialState);
  }, [initialState]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 2, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="Tabs Section">
          <Tab label="Add Property Details" {...a11yProps(0)} />
          <Tab label="Upload Images" {...a11yProps(1)} />
          <Tab label="Available Facilities" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0} aria-label="Tabs Panel">
        {renderComponentTab1 && renderComponentTab1()}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {renderComponentTab2 && renderComponentTab2()}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {renderComponentTab3 && renderComponentTab3()}
      </TabPanel>
    </Box>
  );
};
