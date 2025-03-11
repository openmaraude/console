// https://placekit.io/blog/articles/making-react-leaflet-work-with-nextjs-493i
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
  MapContainer as LMapContainer,
  Marker as LMarker,
} from 'react-leaflet';
import { useMapEvents } from 'react-leaflet/hooks';

export function MapContainer({ forwardedRef = null, ...props }) {
  return <LMapContainer {...props} ref={forwardedRef} />;
}

MapContainer.propTypes = {
  forwardedRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape(),
  ]),
};

export function Marker({ forwardedRef = null, icon: iconProps = null, ...props }) {
  const [icon, setIcon] = useState();

  useEffect(
    () => {
      // loading 'leaflet' dynamically when the component mounts
      const loadIcon = async () => {
        const L = await import('leaflet');
        const instance = iconProps.html ? L.divIcon(iconProps) : L.icon(iconProps);
        setIcon(instance);
      };
      loadIcon();
    },
    [iconProps],
  );

  // waiting for icon to be loaded before rendering
  return (!!iconProps && !icon) ? null : (
    <LMarker
      {...props}
      icon={icon}
      ref={forwardedRef}
    />
  );
}

Marker.propTypes = {
  forwardedRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape(),
  ]),
  icon: PropTypes.shape(),
};

export function MapConsumer({ eventsHandler }) {
  useMapEvents(eventsHandler);
  return null;
}

MapConsumer.propTypes = {
  eventsHandler: PropTypes.shape().isRequired,
};
