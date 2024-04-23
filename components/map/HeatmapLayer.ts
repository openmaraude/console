/*
 * This component exists for the sole purpose of JSX not liking the generic factory syntax
 */
import { HeatmapLayerFactory } from '@vgrid/react-leaflet-heatmap-layer';

const HeatmapLayer = HeatmapLayerFactory<[number, number]>();

export default HeatmapLayer;
