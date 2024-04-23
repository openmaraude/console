import React from 'react';
import PropTypes from 'prop-types';

import { useMap } from 'react-leaflet';

const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
};

export default function MapControl({ position, children }) {
  const map = useMap();

  // Disable most mouse events while we hover the map control,
  // so we can interact with UI widgets appropriately
  const onMouseEnter = React.useCallback(() => {
    map.dragging.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
  }, [map]);
  const onMouseLeave = React.useCallback(() => {
    map.dragging.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
  }, [map]);

  return (
    <div className={POSITION_CLASSES[position]}>
      <div
        className="leaflet-control-layers leaflet-control"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>
    </div>
  );
}

MapControl.propTypes = {
  position: PropTypes.oneOf(Object.keys(POSITION_CLASSES)),
  children: PropTypes.node.isRequired,
};

MapControl.defaultProps = {
  position: 'bottomleft',
};
