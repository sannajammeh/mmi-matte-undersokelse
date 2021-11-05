import Rating from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import React from "react";

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon fontSize="large" />,
    label: "Veldig vanskelig",
  },
  2: {
    icon: <SentimentDissatisfiedIcon fontSize="large" />,
    label: "Vanskelig",
  },
  3: {
    icon: <SentimentSatisfiedIcon fontSize="large" />,
    label: "Helt ok",
  },
  4: {
    icon: <SentimentSatisfiedAltIcon fontSize="large" />,
    label: "Ganske enkelt",
  },
  5: {
    icon: <SentimentVerySatisfiedIcon fontSize="large" />,
    label: "Veldig enkelt",
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

export default function EmojiRating({ name, ...rest }) {
  return (
    <Rating
      name={name}
      {...rest}
      defaultValue={2}
      IconContainerComponent={IconContainer}
      highlightSelectedOnly
    />
  );
}
