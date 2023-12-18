import React from 'react';
import PropTypes from "prop-types";

import useSWR from 'swr';

import { reverseGeocode } from '@/src/utils';

export default function ReverseAddress({ lon, lat }) {
  const { data, error, isLoading } = useSWR(
    [lon, lat],
    () => lon && lat && reverseGeocode({ lon, lat }),
    { refreshInterval: 0, revalidateOnFocus: false },
  );

  if (error) return <span>{JSON.stringify(error)}</span>;
  if (isLoading) return <span>...</span>;
  return <span>{data}</span>;
}

ReverseAddress.propTypes = {
  lon: PropTypes.number,
  lat: PropTypes.number,
};

ReverseAddress.defaultProps = {
  lon: undefined,
  lat: undefined,
};
