/*
 *
 * This module can't be imported during SSR: https://github.com/PaulLeCam/react-leaflet/issues/45
 * Import with next/dynamic:
 *
 *    dynamic(() => 'components/Map', { ssr: false })
 *
 */

/* eslint-disable new-cap */

import React from 'react';
import PropTypes from 'prop-types';

import L from 'leaflet';
import {
  Marker,
  Polygon,
  Tooltip,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import BaseMap from '@/components/BaseMap';
import MarkerClusterGroup from '@/components/ReactLeafletCluster';

import StationIcon from '@/public/images/station.png';
import StationShadow from '@/public/images/shadow.png';

function Station({ station }) {
  const stationIcon = new L.Icon({
    iconUrl: StationIcon.src,
    iconSize: [StationIcon.width / 2, StationIcon.height / 2],
    iconAnchor: [StationIcon.width / 4, StationIcon.height / 2],
    shadowUrl: StationShadow.src,
    shadowSize: [StationShadow.width / 4, StationShadow.height / 4],
    shadowAnchor: [0, StationShadow.height / 4],
  });

  const showPlaces = (places) => {
    if (!places) return '';
    if (places === 1) return <i>une place</i>;
    return <i>{places} places</i>;
  };

  if (station.geojson.type === 'Point') {
    const [lon, lat] = station.geojson.coordinates;
    return (
      <Marker key={station.id} position={[lat, lon]} icon={stationIcon}>
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

export default function StationsMap({ stations }) {
  return (
    <BaseMap>
      <MarkerClusterGroup chunkedLoading removeOutsideVisibleBounds disableClusteringAtZoom={12}>
        {stations.map((station) => <Station key={station.id} station={station} />)}
      </MarkerClusterGroup>
    </BaseMap>
  );
}

StationsMap.propTypes = {
  stations: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
