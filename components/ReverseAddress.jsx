import React from 'react';
import PropTypes from "prop-types";

import useSWR from 'swr';

import { reverseGeocode } from '@/src/utils';

export default function ReverseAddress({ lon, lat }) {
  const [address, setAddress] = React.useState('""');

  useSWR(
    [lon, lat],
    () => lon && lat && reverseGeocode({ lon, lat }).then(setAddress).catch(setAddress),
    { refreshInterval: 0, revalidateOnFocus: false },
  );

  return <span>{address}</span>;
}

ReverseAddress.propTypes = {
  lon: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
};
