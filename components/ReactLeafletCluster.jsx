/*
react-leaflet-cluster
Upstream: https://github.com/akursat/react-leaflet-cluster
License: MIT

Copied here because it would be incompatible with next.js,
because of importing CSS and me being tired of this javascript bullshit.
*/

import { createPathComponent } from '@react-leaflet/core';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useEffect } from 'react';

import MarkerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import MarkerIcon from 'leaflet/dist/images/marker-icon.png';
import MarkerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: MarkerIcon2x,
  iconUrl: MarkerIcon,
  shadowUrl: MarkerShadow,
});

function getPropsAndEvents(props) {
  let clusterProps = {};
  let clusterEvents = {};
  const { children, ...rest } = props;
  // Splitting props and events to different objects
  Object.entries(rest).forEach(([propName, prop]) => {
    if (propName.startsWith('on')) {
      clusterEvents = { ...clusterEvents, [propName]: prop };
    } else {
      clusterProps = { ...clusterProps, [propName]: prop };
    }
  });
  return [clusterProps, clusterEvents];
}

function createMarkerCluster(props, context) {
  const [clusterProps, clusterEvents] = getPropsAndEvents(props);
  const clusterGroup = new L.MarkerClusterGroup(clusterProps);

  useEffect(() => {
    Object.entries(clusterEvents).forEach(([eventAsProp, callback]) => {
      const clusterEvent = `cluster${eventAsProp.substring(2).toLowerCase()}`;
      clusterGroup.on(clusterEvent, callback);
    });
    return () => {
      Object.entries(clusterEvents).forEach(([eventAsProp]) => {
        const clusterEvent = `cluster${eventAsProp.substring(2).toLowerCase()}`;
        clusterGroup.removeEventListener(clusterEvent);
      });
    };
  }, [clusterEvents, clusterGroup]);

  return {
    instance: clusterGroup,
    context: { ...context, layerContainer: clusterGroup },
  };
}

const updateMarkerCluster = () => {};

const MarkerClusterGroup = createPathComponent(
  createMarkerCluster,
  updateMarkerCluster,
);

export default MarkerClusterGroup;
