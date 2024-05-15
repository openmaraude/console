// https://placekit.io/blog/articles/making-react-leaflet-work-with-nextjs-493i
import dynamic from 'next/dynamic';
import { forwardRef } from 'react';

const LazyMapContainer = dynamic(
  () => import('./MapLazyComponents').then((m) => m.MapContainer),
  {
    ssr: false,
    loading: () => (<div style={{ height: '700px' }} />),
  },
);
// eslint-disable-next-line react/display-name
export const MapContainer = forwardRef((props, ref) => (
  <LazyMapContainer {...props} forwardedRef={ref} />
));

const LazyMarker = dynamic(
  () => import('./MapLazyComponents').then((m) => m.Marker),
  { ssr: false },
);
// eslint-disable-next-line react/display-name
export const Marker = forwardRef((props, ref) => (
  <LazyMarker {...props} forwardedRef={ref} />
));

export const MapConsumer = dynamic(
  () => import('./MapLazyComponents').then((m) => m.MapConsumer),
  { ssr: false },
);

// direct import from 'react-leaflet'
export const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false },
);
export const ZoomControl = dynamic(
  () => import('react-leaflet').then((m) => m.ZoomControl),
  { ssr: false },
);
export const LayersControl = dynamic(
  () => import('react-leaflet').then((m) => m.LayersControl),
  { ssr: false },
);
export const BaseLayer = dynamic(
  () => import('react-leaflet').then((m) => m.LayersControl.BaseLayer),
  { ssr: false },
);
export const Overlay = dynamic(
  () => import('react-leaflet').then((m) => m.LayersControl.Overlay),
  { ssr: false },
);
export const Circle = dynamic(
  () => import('react-leaflet').then((m) => m.Circle),
  { ssr: false },
);
export const Popup = dynamic(
  () => import('react-leaflet').then((m) => m.Popup),
  { ssr: false },
);
export const Polygon = dynamic(
  () => import('react-leaflet').then((m) => m.Polygon),
  { ssr: false },
);
export const Tooltip = dynamic(
  () => import('react-leaflet').then((m) => m.Tooltip),
  { ssr: false },
);
export const CircleMarker = dynamic(
  () => import('react-leaflet').then((m) => m.CircleMarker),
  { ssr: false },
);
export const FeatureGroup = dynamic(
  () => import('react-leaflet').then((m) => m.FeatureGroup),
  { ssr: false },
);
export const GeoJSON = dynamic(
  () => import('react-leaflet').then((m) => m.GeoJSON),
  { ssr: false },
);
