import React from 'react';
import PropTypes from 'prop-types';
import useSWR from 'swr';

import HeatmapLayer from '@/components/HeatmapLayer.ts';
import { requestList } from '@/src/api';
import { UserContext } from '@/src/auth';

export default function HailsHeatmap({ minOpacity }) {
  const userContext = React.useContext(UserContext);
  const { data } = useSWR(
    ['/stats/heatmap_hails', userContext.user.apikey],
    (url, token) => requestList(url, null, { token }),
  );
  const [layer, setLayer] = React.useState();

  React.useEffect(() => {
    if (layer) {
      layer.options.minOpacity = minOpacity;
    }
  }, [minOpacity]);

  if (data) {
    return (
      <HeatmapLayer
        points={data.data[0].points}
        latitudeExtractor={(m) => m[0]}
        longitudeExtractor={(m) => m[1]}
        intensityExtractor={() => 3}
        minOpacity={minOpacity}
        radius={10}
        ref={setLayer}
      />
    );
  }
}

HailsHeatmap.propTypes = {
  minOpacity: PropTypes.number.isRequired,
};
