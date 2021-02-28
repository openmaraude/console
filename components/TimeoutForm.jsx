import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';

export const TimeoutContext = React.createContext();

/*
 * Similar to MUI TextField, but calls TimeoutGroup.onSubmit when value
 * changes.
 */
export function TimeoutTextField({ ...props }) {
  const updateValue = React.useContext(TimeoutContext);

  const onChange = (e) => {
    e.preventDefault();
    updateValue(e.target.name, e.target.value);
  };

  return <TextField {...props} onChange={onChange} />;
}

/*
 * Calls onSubmit() after some time when children are updated.
 */
export function TimeoutGroup({ onSubmit, children }) {
  const [values, setValues] = React.useState();

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (typeof values !== 'undefined') {
        onSubmit(values);
      }
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  });

  const updateValue = (name, value) => {
    setValues({ ...values, [name]: value });
  };

  return (
    <TimeoutContext.Provider value={updateValue}>
      {children}
    </TimeoutContext.Provider>
  );
}

TimeoutGroup.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
