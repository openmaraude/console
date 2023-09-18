import React from 'react';
import PropTypes from "prop-types";

import GpsFixedTwoTone from '@mui/icons-material/GpsFixedTwoTone';
import useSWR from 'swr';

import { reverseGeocode } from '@/src/utils';

export default function ReverseAddress({ lon, lat }) {
  const [address, setAddress] = React.useState("");

  useSWR(
    [lon, lat],
    () => lon && lat && reverseGeocode({ lon, lat }).then(setAddress),
    { refreshInterval: 0, revalidateOnFocus: false },
  );

  return (
    <>
      <GpsFixedTwoTone color="primary" sx={{ margin: '0 0.25em -0.5ex' }} />
      {address}
    </>
  );
}

ReverseAddress.propTypes = {
  lon: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
};
