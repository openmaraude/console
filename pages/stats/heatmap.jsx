import dynamic from 'next/dynamic';
import React from 'react';

import { LYON } from '@/src/utils';
import { Layout } from './index';

export default function StatsHeatMap() {
  const HeatMaps = dynamic(
    () => import('@/components/HeatMaps'),
    { ssr: false },
  );

  return (
    <Layout maxWidth="xl">
      <p>
        Cette carte affiche les points chauds de demandes prise en charge 🌈
        (abouties ou non) et des taxis en ligne 🟣.
      </p>
      <HeatMaps center={LYON} zoom={12} />
    </Layout>
  );
}
