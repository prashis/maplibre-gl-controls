import mapboxgl, {
  LngLat,
  Map,
  MapLayerMouseEvent,
  MapMouseEvent,
} from 'maplibre-gl';
import { Cursor, ImagePosition, Visibility } from './types';
import { contourLayer, shadowLayer } from './layers';
import IImage from './IImage';

interface Options {
  map: Map;
  image: IImage;
  cursorPosition: LngLat;
  onUpdate: (position: ImagePosition) => void;
}

export default function moveable({
  map,
  image,
  cursorPosition,
  onUpdate,
}: Options): () => void {
  const mapCanvas = map.getCanvas();
  const imageBounds = new mapboxgl.LngLatBounds(
    image.position[3],
    image.position[1],
  );
  let startPosition: LngLat = null;

  map.addLayer({ ...contourLayer, source: image.polygonSource.id });
  map.addLayer({ ...shadowLayer, source: image.polygonSource.id });
  if (imageBounds.contains(cursorPosition)) {
    mapCanvas.style.cursor = Cursor.Move;
  }

  function onPointerMove(event: MapMouseEvent) {
    const currentPosition = event.lngLat;
    const deltaLng = startPosition.lng - currentPosition.lng;
    const deltaLat = startPosition.lat - currentPosition.lat;
    onUpdate(
      image.position.map(
        (p) => new LngLat(p.lng - deltaLng, p.lat - deltaLat),
      ) as ImagePosition,
    );
    startPosition = currentPosition;
  }

  function onPointerUp() {
    mapCanvas.style.cursor = Cursor.Move;
    map.off('mousemove', onPointerMove);
    map.setLayoutProperty(contourLayer.id, 'visibility', Visibility.Visible);
  }

  function onPointerDown(event: MapLayerMouseEvent) {
    event.preventDefault();
    startPosition = event.lngLat;
    mapCanvas.style.cursor = Cursor.Grabbing;
    map.on('mousemove', onPointerMove);
    map.setLayoutProperty(contourLayer.id, 'visibility', Visibility.None);
    document.addEventListener('pointerup', onPointerUp, { once: true });
  }

  function onPointerEnter() {
    mapCanvas.style.cursor = Cursor.Move;
  }

  function onPointerLeave() {
    mapCanvas.style.cursor = '';
  }

  map.on('mouseenter', shadowLayer.id, onPointerEnter);
  map.on('mouseleave', shadowLayer.id, onPointerLeave);
  map.on('mousedown', shadowLayer.id, onPointerDown);

  return () => {
    mapCanvas.style.cursor = '';
    map.off('mousemove', onPointerMove);
    map.off('mouseenter', shadowLayer.id, onPointerEnter);
    map.off('mouseleave', shadowLayer.id, onPointerLeave);
    map.off('mousedown', shadowLayer.id, onPointerDown);
    document.removeEventListener('pointerup', onPointerUp);

    if (map.getLayer(shadowLayer.id)) map.removeLayer(shadowLayer.id);
    if (map.getLayer(contourLayer.id)) map.removeLayer(contourLayer.id);
  };
}
