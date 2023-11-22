import React from 'react';

import dynamic from 'next/dynamic';

import { Layout } from './index';

export default function DashboardMap() {
  const TaxisMap = dynamic(
    () => import('@/components/TaxisMap'),
    { ssr: false },
  );

  return (
    <Layout maxWidth="xl">
      <TaxisMap />
    </Layout>
  );
}
