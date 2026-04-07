'use strict';

import { Map } from 'maplibre-gl';

import points from './cities-point.json';
import polygons from './cities.json';
// console.log(polygons, points);

document.getElementById('count').innerText = polygons.features.length.toString() ?? '??';

const map = new Map({
  container: 'map',
  style: 'https://tiles.openfreemap.org/styles/bright',
  center: [0, 0],
  zoom: 2
});

map.on('load', () => {
  map.addSource('polygons', {
    type: 'geojson',
    data: polygons
  });

  map.addLayer({
    'id': 'polygons',
    'type': 'fill',
    'source': 'polygons',
    'paint': {
      'fill-color': '#FFFFFF',
      'fill-opacity': 0.4
    },
  });
  map.addLayer({
    'id': 'polygons-border',
    'type': 'line',
    'source': 'polygons',
    'paint': {
      'line-color': '#3399CC',
      'line-width': 2
    },
  });

  map.addSource('points', {
    type: 'geojson',
    data: points
  });

  map.addLayer({
    'id': 'points',
    'type': 'circle',
    'source': 'points',
    'paint': {
      'circle-color': '#3399CC',
      'circle-radius': 8,
      'circle-stroke-width': 3,
      'circle-stroke-color': '#FFFFFF'
    }
  });
});


/**
(function () {
  document.getElementById('count').innerText = polygons.features.length.toString();

  const baselayer = new TileLayer({
    source: new OSM()
  });

  const map = new Map({
    layers: [baselayer],
    target: 'map',
    view: new View({
      center: [0, 0],
      zoom: 2
    })
  });

  const layerPolygons = new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON({ featureProjection: map.getView().getProjection() }).readFeatures(polygons)
    }),
    minZoom: 8,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255,255,255,0.4)'
      }),
      stroke: new Stroke({
        color: '#3399CC',
        width: 2
      })
    })
  });
  map.addLayer(layerPolygons);

  const layerPoints = new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON({ featureProjection: map.getView().getProjection() }).readFeatures(points)
    }),
    maxZoom: 8,
    style: new Style({
      image: new Circle({
        fill: new Fill({
          color: '#3399CC'
        }),
        stroke: new Stroke({
          color: '#FFFFFF',
          width: 3
        }),
        radius: 8
      })
    })
  });
  map.addLayer(layerPoints);

  map.getView().fit(layerPolygons.getSource().getExtent(), { padding: [100, 100, 100, 100] });

  const overlay = new Overlay({
    element: document.getElementById('popup'),
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    }
  });
  map.addOverlay(overlay);

  map.on('singleclick', (event) => {
    const features = map.getFeaturesAtPixel(event.pixel);

    if (features.length > 0) {
      const { name, url, statistics } = features[0].getProperties();

      const total = Object.values(statistics).reduce((a, b) => a + b, 0);
      const totalPerson = total - statistics['-'];

      let html = `${name}<br><a target="_blank" href="${url}">${url}</a>`;
      html += '<hr>';
      html += '<div style="font-size: small;">' +
        `Out of ${total} streetnames,<br>${totalPerson} have been found to be named after a person :<br>` +
        (statistics.F > 0 ? `${statistics.F} after a cisgender female,<br>` : '') +
        (statistics.FX > 0 ? `${statistics.FX} after a transgender female,<br>` : '') +
        (statistics.MX > 0 ? `${statistics.MX} after a transgender male,<br>` : '') +
        (statistics.M > 0 ? `${statistics.M} after a cisgender male,<br>` : '') +
        '</div>';

      overlay.getElement().innerHTML = html;

      overlay.setPosition(event.coordinate);
    } else {
      overlay.setPosition(undefined);
    }
  });

  map.updateSize();
})();
*/