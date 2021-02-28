/*
 * A lot of components need to make a HTTP query and use the result to set a
 * state, with:
 *
 *   React.useEffect(
 *     async () => {
 *      res = await <api request>;
 *      setState(res);
 *   [deps])
 *
 * If the api request finishes after the component is unmounted, React raises
 * the error "Can't perform a React state update on an unmounted component".
 *
 * safeUseEffect replaces React.useEffect, and provides an object "ref" to
 * the function which contains the property "mounted". The value is false when
 * the component is unmounted.
 *
 * See: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
 */
import React from 'react';

export function safeUseEffect(callback, deps) {
  const ref = React.useRef({ mounted: true });

  React.useEffect(() => {
    ref.current.mounted = true;

    const ret = callback(ref.current);

    return () => {
      ref.current.mounted = false;

      // Call cleanup function
      if (typeof ret === 'function') {
        ret();
      }
    };
  }, deps);
}
