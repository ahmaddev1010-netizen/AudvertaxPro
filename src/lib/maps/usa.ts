import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import states from "us-atlas/states-10m.json";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Topology } from "topojson-specification";

type StateProperties = { name?: string };
export type UsaStateFeature = Feature<Geometry, StateProperties>;
type UsaStateFeatureCollection = FeatureCollection<Geometry, StateProperties>;
type UsaStatesTopology = Topology<any>;

export const USA_MAP_WIDTH = 1000;
export const USA_MAP_HEIGHT = 560;
export const USA_MAP_PADDING = { x: 34, y: 30 };

export function toStateSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type UsaMapState = {
  feature: UsaStateFeature;
  slug: string;
  path: string;
};

function createUsaMapGeometry() {
  const topology = states as unknown as UsaStatesTopology;
  const stateFeatures = feature(
    topology,
    topology.objects.states,
  ) as unknown as UsaStateFeatureCollection;
  const nationFeature = feature(topology, topology.objects.nation) as unknown as Feature<Geometry>;
  const stateBoundaries = mesh(topology, topology.objects.states, (a, b) => a !== b);

  const projection = geoAlbersUsa().fitExtent(
    [
      [USA_MAP_PADDING.x, USA_MAP_PADDING.y],
      [USA_MAP_WIDTH - USA_MAP_PADDING.x, USA_MAP_HEIGHT - USA_MAP_PADDING.y],
    ],
    stateFeatures,
  );
  const path = geoPath(projection);

  return {
    states: stateFeatures.features
      .map((state): UsaMapState => ({
        feature: state,
        slug: toStateSlug(state.properties?.name ?? ""),
        path: path(state) ?? "",
      }))
      .filter((state) => state.path && state.slug),
    boundaries: path(stateBoundaries) ?? "",
    nation: path(nationFeature) ?? "",
    centroid: (state: UsaStateFeature) => path.centroid(state),
  };
}

export const usaMapGeometry = createUsaMapGeometry();

export function getUsaMapState(slug: string) {
  return usaMapGeometry.states.find((state) => state.slug === slug.trim().toLowerCase());
}
