import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { CardActionArea, Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";

export const BasicCard = (props) => {
  const { cardNames, handleName } = props;
  const [cardValues, setCardValues] = React.useState([]);


  const handleClick = (key, index) => {
    const value = [...cardValues];
    value[index].isSelected = !value[index].isSelected;
    setCardValues(value);
    const sum = [...value];
    handleName(sum);
  };
 
  React.useEffect(()=> {
    setCardValues(cardNames);
  })
  return (
    <>
      <Typography variant="h6" sx={{ m: 2 }}>
        Facilities Available
      </Typography>
      <Grid container alignItems="stretch" spacing={2} m={2}>
        {cardValues &&
          cardValues.map((cardName, index) => (
            <Grid item xs={3} key={index}>
              <Card
                sx={{
                  width: 120,
                  height: 150,
                  position: "relative",
                  borderRadius: 1.5,
                  // background: cardName.isSelected ? "green" : "#5F3B92",
                }}
                key={index}
              >
                <CardActionArea
                  onClick={() => handleClick(cardName, index)}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    background: "#B8B8D2",
                    width: 120,
                  }}
                >
                  <Button size="small" sx={{ margin: "12px" }}>
                    {cardName?.name}
                  </Button>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
      </Grid>
    </>
  );
};

// BasicCard.defaultProps = {
//   cardNames: [],
//   handleName: () => {},
// };

// BasicCard.propTypes = {
//   cardNames: PropTypes.array,
//   handleName: PropTypes.func,
// };
