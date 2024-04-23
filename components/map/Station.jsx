/* eslint-disable new-cap */

import React from 'react';
import PropTypes from 'prop-types';

import StationIcon from '@/public/images/station.png';
import StationShadow from '@/public/images/shadow.png';

import {
  Marker,
  Polygon,
  Tooltip,
} from './MapComponents';

export default function Station({ station }) {
  const icon = {
    iconUrl: StationIcon.src,
    iconSize: [StationIcon.width / 2, StationIcon.height / 2],
    iconAnchor: [StationIcon.width / 4, StationIcon.height / 2],
    shadowUrl: StationShadow.src,
    shadowSize: [StationShadow.width / 4, StationShadow.height / 4],
    shadowAnchor: [0, StationShadow.height / 4],
  };
  const showPlaces = (places) => {
    if (!places) return '';
    if (places === 1) return <i>une place</i>;
    return <i>{places} places</i>;
  };

  if (station.geojson.type === 'Point') {
    const [lon, lat] = station.geojson.coordinates;
    return (
      <Marker
        position={[lat, lon]}
        icon={icon}
        style={{ zIndex: '1!important' }}
      >
        <Tooltip offset={[0, 20]} opacity={1}>
          <p>
            <strong>{station.name}</strong>
            <br />
            {showPlaces(station.places)}
          </p>
        </Tooltip>
      </Marker>
    );
  }

  return (
    <Polygon positions={station.geojson.coordinates}>
      <Tooltip offset={[0, 20]} opacity={1}>
        <p>
          <strong>{station.name}</strong>
          {station.places !== undefined && (
            <>
              <br />
              <i>{station.places}</i> places
            </>
          )}
          <br />
          {JSON.stringify(station.geojson)}
        </p>
      </Tooltip>
    </Polygon>
  );
}

Station.propTypes = {
  station: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    places: PropTypes.number,
    geojson: PropTypes.shape({
      type: PropTypes.string,
      coordinates: PropTypes.arrayOf(PropTypes.number),
    }),
  }).isRequired,
};
