import React from 'react';
import PropTypes from 'prop-types';
import useSWR from 'swr';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import "leaflet.heat"

import { requestList } from '@/src/api';
import { UserContext } from '@/src/auth';

export default function TaxisHeatmap({ minOpacity, intensity = 1.0, radius = 10 }) {
  const userContext = React.useContext(UserContext);
  const map = useMap();
  const { data } = useSWR(
    { url: '/stats/heatmap_taxis', token: userContext.user.apikey },
    ({ url, token }) => requestList(url, null, { token }),
  );

  React.useEffect(() => {
    if (data) {
      const points =  data.data[0].points.map((p) => [p[0], p[1], intensity]);
      const heatmapLayer = L.heatLayer(
        points,
        {
          minOpacity,
          radius,
          gradient: { 0.0: 'pink', 1.0: 'purple' }
        }
      ).addTo(map);

      return () => {
        map.removeLayer(heatmapLayer);
      }
    }
  }, [data]);
}

TaxisHeatmap.propTypes = {
  minOpacity: PropTypes.number.isRequired,
};
