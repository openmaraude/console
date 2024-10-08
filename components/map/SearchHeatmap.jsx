import React from 'react';
import PropTypes from 'prop-types';
import useSWR from 'swr';

import { requestList } from '@/src/api';
import { UserContext } from '@/src/auth';
import HeatmapLayer from './HeatmapLayer.ts';

export default function SearchHeatmap({ minOpacity }) {
  const userContext = React.useContext(UserContext);
  const { data } = useSWR(
    ['/stats/heatmap_searches', userContext.user.apikey],
    (url, token) => requestList(url, null, { token }),
  );
  const [layer, setLayer] = React.useState();

  React.useEffect(() => {
    if (layer) {
      layer.options.minOpacity = minOpacity;
    }
  }, [layer, minOpacity]);

  if (data) {
    return (
      <HeatmapLayer
        points={data.data[0].points}
        latitudeExtractor={(m) => m[0]}
        longitudeExtractor={(m) => m[1]}
        intensityExtractor={() => 3}
        minOpacity={minOpacity}
        radius={10}
        gradient={{ 0.0: 'pink', 1.0: 'red' }}
        ref={setLayer}
      />
    );
  }
}

SearchHeatmap.propTypes = {
  minOpacity: PropTypes.number.isRequired,
};
