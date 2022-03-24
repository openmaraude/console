import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';

export const TimeoutContext = React.createContext();

/*
 * Similar to MUI TextField, but calls TimeoutGroup.onSubmit when value
 * changes.
 */
export function TimeoutTextField({ ...props }) {
  const updateValues = React.useContext(TimeoutContext);

  const onChange = (e) => {
    e.preventDefault();
    updateValues({ [e.target.name]: e.target.value });
  };

  return <TextField {...props} onChange={onChange} />;
}

/*
 * Calls onSubmit() after some time when children are updated.
 */
export function TimeoutGroup({ onSubmit, children }) {
  const [values, setValues] = React.useState({});
  const timeoutRef = React.useRef(false);

  React.useEffect(() => {
    // Timeout not enabled, do nothing
    if (!timeoutRef.current) {
      return () => { };
    }

    // When timeout is reached, disable it and call onSubmit.
    const timeout = setTimeout(() => {
      timeoutRef.current = false;
      onSubmit(values);
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  });

  // Called when an input field has been updated. Enable timeout and refresh
  // the group with new content.
  const updateValues = ({ ...newValues }) => {
    timeoutRef.current = true;
    setValues({ ...values, ...newValues });
  };

  const providerValue = React.useCallback(updateValues, [values]);

  return (
    <TimeoutContext.Provider value={providerValue}>
      {children}
    </TimeoutContext.Provider>
  );
}

TimeoutGroup.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
