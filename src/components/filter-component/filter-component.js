import { useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { format } from "date-fns";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  CircularProgress,
  TableRow,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export const FilterComponent = ({
  propertylist,
  filterByPropertyName,
  filterByStatus,
  optionLabels,
  filterWithEmail,
}) => {
  const [propertyname, setPropertyName] = useState("");
  const [status, setStatus] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const handleChange = (event) => {
    filterByPropertyName(event.target.value);
    setPropertyName(event.target.value);
  };

  const handleChangeStatus = (event) => {
    filterByStatus(event.target.value);
    setStatus(event.target.value);
  };

  return (
    <>
      <Box>
        <FilterListIcon sx={{ mt: 1.5 }} />
        {filterWithEmail && (
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel htmlFor="demo-dialog-native-property">
             Property Email
            </InputLabel>
            <Select
              native
              value={propertyname}
              disabled={!propertylist.length}
              sx={{ height: 40 }}
              onChange={handleChange}
              input={<OutlinedInput label="Property Name" id="demo-dialog-native-property" />}
            >
              <option value="all">All</option>
              {propertylist &&
                propertylist.map((option, index) => (
                  <option key={`${option}-${index}`} value={option}>
                    {option}
                  </option>
                ))}
            </Select>
          </FormControl>
        )}
        {!filterWithEmail && (
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel htmlFor="demo-dialog-native-property">
              Property Name
            </InputLabel>
            <Select
              native
              value={propertyname}
              sx={{ height: 40 }}
              disabled={!propertylist.length}
              onChange={handleChange}
              input={<OutlinedInput label="Property Name" id="demo-dialog-native-property" />}
            >
              <option value="all">All</option>
              {propertylist &&
                propertylist.map((option, index) => (
                  <option key={`${option?.id}-${index}`} value={option?.id}>
                    {option?.name}
                  </option>
                ))}
            </Select>
          </FormControl>
        )}

        <FormControl sx={{ m: 1, minWidth: 200 }}>
          <InputLabel htmlFor="demo-dialog-native">Status</InputLabel>
          <Select
            native
            disabled={!propertylist.length}
            value={status}
            onChange={handleChangeStatus}
            sx={{ height: 40 }}
            input={<OutlinedInput label="Status" id="demo-dialog-native" />}
          >
            {" "}
            {optionLabels &&
              optionLabels.map((option, index) => (
                <option key={`${option.value}-${index}`} value={option?.value}>
                  {option?.label}
                </option>
              ))}
          </Select>
        </FormControl>
      </Box>
    </>
  );
};

// FilterComponent.propTypes = {
//   customers: PropTypes.array.isRequired,
// };
