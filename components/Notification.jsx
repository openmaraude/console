//import React from 'react';
//import PropTypes from 'prop-types';
//
//import { Alert } from '@material-ui/lab';
//import Snackbar from '@material-ui/core/Snackbar';
//
//export default function Notification({ key, message, severity }) {
//  const [open, setOpen] = React.useState(true);
//
//  const handleClose = (event, reason) => {
//    if (reason === 'clickaway') {
//      return;
//    }
//    setOpen(false);
//  };
//
//  return (
//    <Snackbar
//      key={key}
//      open={open}
//      autoHideDuration={5000}
//      onClose={handleClose}
//      onClick={handleClose}
//    >
//      <Alert onClose={handleClose} severity={severity || "success"}>
//        {message}
//      </Alert>
//    </Snackbar>
//  );
//}
//
//Notification.propTypes = {
//  message: PropTypes.string.isRequired,
//};
