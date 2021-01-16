import React from "react";
import PropTypes from "prop-types";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const CustomSnackbar = ({
  open,
  handleClose,
  transition,
  message = "Default snackbar message",
  severity = "info",
}) => {
  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      autoHideDuration={5000}
      message={message}
      key={transition ? transition.name : ""}
    >
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

CustomSnackbar.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  transition: PropTypes.func,
  message: PropTypes.string,
  severity: PropTypes.string,
};

export default CustomSnackbar;
