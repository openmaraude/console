import React from 'react';

import dynamic from 'next/dynamic';

import { Layout } from './index';

export default function DashboardMap() {
  const Map = dynamic(
    () => import('@/components/TaxisMap'),
    { ssr: false },
  );

  return (
    <Layout>
      <Map />
    </Layout>
  );
}
