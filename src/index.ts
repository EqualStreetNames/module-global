'use strict';

import { LngLatLike, Map, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import points from './cities-point.json';
import polygons from './cities.json';

const countElement = document.getElementById('count');
if (typeof countElement !== 'undefined' && countElement !== null) {
  countElement.innerText = polygons.features.length.toString() ?? '??';
}

const map = new Map({
  container: 'map',
  style: 'https://tiles.openfreemap.org/styles/bright',
});

map.on('load', () => {
  // Add polygons.
  map.addSource('polygons', {
    type: 'geojson',
    data: polygons as GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>,
  });
  map.addLayer({
    id: 'polygons',
    type: 'fill',
    source: 'polygons',
    paint: {
      'fill-color': '#FFFFFF',
      'fill-opacity': 0.4
    },
    minzoom: 8,
  });
  map.addLayer({
    id: 'polygons-border',
    type: 'line',
    source: 'polygons',
    paint: {
      'line-color': '#3399CC',
      'line-width': 2
    },
    minzoom: 8,
  });

  // Add points.
  map.addSource('points', {
    type: 'geojson',
    data: points as GeoJSON.FeatureCollection<GeoJSON.Point | GeoJSON.MultiPoint>,
  });
  map.addLayer({
    id: 'points',
    type: 'circle',
    source: 'points',
    paint: {
      'circle-color': '#3399CC',
      'circle-radius': 8,
      'circle-stroke-width': 3,
      'circle-stroke-color': '#FFFFFF'
    },
    maxzoom: 8,
  });

  // Change the cursor to a pointer when the mouse is over the layer.
  map.on('mouseenter', ['polygons', 'points'], () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', ['polygons', 'points'], () => {
    map.getCanvas().style.cursor = '';
  });

  // When a click event occurs on a feature in the layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on('click', ['polygons', 'points'], (event) => {
    if (event.features === undefined || event.features.length === 0) {
      return;
    }

    let coordinates = event.lngLat as LngLatLike;

    // If the feature is a point, use its coordinates for the popup.
    if (event.features[0].geometry.type === 'Point') {
      coordinates = event.features[0].geometry.coordinates.slice() as [number, number];

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
      }
    }

    const { name, url, statistics } = event.features[0].properties as { name: string; url: string; statistics: string };
    const stats = JSON.parse(statistics) as Record<string, number>;

    const total = Object.values(stats).reduce((a, b) => a + b, 0);
    const totalPerson = total - stats['-'];

    const html = `${name}<br><a target="_blank" href="${url}">${url}</a>` +
      '<div style="border-top: 1px solid #000; font-size: small; padding-top: 5px; margin-top: 5px; white-space: nowrap;">' +
      `Out of ${total} streetnames,<br>${totalPerson} have been found to be named after a person :` +
      '<ul style="margin: 0; padding-left: 15px;">' +
      (stats.F > 0 ? `<li>${stats.F} after a cisgender female</li>` : '') +
      (stats.FX > 0 ? `<li>${stats.FX} after a transgender female</li>` : '') +
      (stats.MX > 0 ? `<li>${stats.MX} after a transgender male</li>` : '') +
      (stats.M > 0 ? `<li>${stats.M} after a cisgender male</li>` : '') +
      '</ul>' +
      '</div>';

    new Popup({ maxWidth: 'none' })
      .setLngLat(coordinates)
      .setHTML(html)
      .addTo(map);
  });
});
