import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';

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
 * Select already wrapped in a FormControl, as required
 */
export function TimeoutSelectField({
  name,
  label,
  children,
  ...props
}) {
  const updateValues = React.useContext(TimeoutContext);

  const onChange = (e) => {
    e.preventDefault();
    updateValues({ [e.target.name]: e.target.value });
  };

  return (
    <FormControl sx={{ minWidth: 120 }} {...props}>
      <InputLabel>{label}</InputLabel>
      <Select
        name={name}
        label={label}
        onChange={onChange}
      >
        {children}
      </Select>
    </FormControl>
  );
}

TimeoutSelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

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
