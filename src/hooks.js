import React from 'react';

/*
 * Store the previous value of a state.
 *
 * To use:
 *
 * const [myState, setMyState] = React.useState();
 * const previousValue = usePrevious(myState);
 */
export function usePrevious(value) {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
