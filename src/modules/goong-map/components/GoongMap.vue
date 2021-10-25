<template>
  <div :style="styleMap" :id="randomIdMap">
  </div>
</template>
<script>
import {randomStr} from "../../../helpers/function";
import goongjs from "@goongmaps/goong-js";
import polyline from "@mapbox/polyline";
import gmsDirection from "@goongmaps/goong-sdk/services/directions";
import Popup from "../instances/popup";
import {debounce} from "../../../helpers/function";

export default {
  props: {
    mode: {
      type: String,
      default: "https://tiles.goong.io/assets/goong_map_web.json"
    },
    zoom: {
      type: Number,
      default: 9
    },
    styleMap: {
      type: Object,
      default: () => {}
    },
    center: {
      type: Array,
      default: () => [105.83991, 21.02800]
    },
    marker: {
      type: Array
    },
    markers: {
      type: Array
    },
    direction: {
      type: Object
    }
  },
  data: function (){
    return {
      markersManager: [],
      directionManager: []
    }
  },
  computed: {
    randomIdMap: function (){
      return `map` + randomStr(10);
    },
    goong: function (){
      if (!this.mapToken) throw new Error("Please define map token of GoongMap into plugin option")
      goongjs.accessToken = this.mapToken;
      return goongjs;
    },
    initialMap: function (){
      const options = {
        container: this.randomIdMap,
        style: this.mode,
        zoom: this.zoom,
        center: this.center,
      };
      const map = new this.goong.Map(options)

      return map;
    },
  },
  mounted() {
    const map = this.initialMap;
    map.on("load",  () => {
      if (this.direction && this.direction.origin && this.direction.destination) {
        this.findManyDirections();
      }
      if (this.marker) {
        this.addMarkerIntoMap(map, this.marker);
      }
      if (this.markers) {
        this.addMarkers(this.markers);
      }

    })
  },
  methods: {
    addMarkerIntoMap: function (map, longlat){
      new this.goong.Marker().setLngLat(longlat).addTo(map)
    },

    // Reference option into https://docs.goong.io/javascript/markers/#marker
    // Long lat of marker ex: [30.5, 50.5]]
    addMarkers: function (markers) {
      const map = this.initialMap;
      markers.forEach(marker => {
        if (!marker.options || !marker.longLat) throw new Error("Format of marker is not correct. It's must contain [{options?, longLat?}]");
        const markerInstance = new this.goong.Marker(marker.options);
        this.markersManager.push(markerInstance);
        markerInstance.setLngLat(marker.longLat)

        if (marker.options.draggable) {
          markerInstance.on('dragend', () => {
            marker.dragend && marker.dragend(markerInstance.getLngLat());
          })
          markerInstance.on('dragstart', () => {
            marker?.dragstart && marker.dragstart(markerInstance.getLngLat());
          })
          markerInstance.on('drag', () => {
            marker.drag && marker.drag(markerInstance.getLngLat());
          })
        }

        if (marker.popup) {
          const popup = new Popup(marker.popup.options, marker.popup.extraOptions)
          markerInstance.setPopup(popup);
        }
        markerInstance.addTo(map);
      })
    },

    removeAllMarker: function () {
      while (this.markersManager.length) {
        const marker = this.markersManager.pop();
        marker.remove();
      }
    },
    removeAndAddMarker: function (newMarkers) {
      this.removeAllMarker();
      this.addMarkers(newMarkers);
    },
    findManyDirections: function () {
      const {origin, destination} = this.direction;
      for (let add of destination) {
        this.findDirection(origin, add);
      }
    },
    removeSourceAndLayer: function () {
      const map = this.initialMap;
      while (this.directionManager.length) {
        const key = this.directionManager.pop();
        if (map.getLayer(key)) map.removeLayer(key);
        if (map.getSource(key)) map.removeSource(key);
      }
    },
    findBoundingBox: function () {
      const map = this.initialMap;
      const direction = this.direction;
      const boundingBox = [
        direction.origin.split(","),
        ...direction.destination.map(item => item.split(','))
      ]
      map.fitBounds(boundingBox, {
        padding: 30
      });
    },
    resetDirection: function () {
      this.findBoundingBox();
      this.removeSourceAndLayer();
      this.findManyDirections();
    },
    findDirection: function (origin, destination) {
      const map = this.initialMap;
      const layers = map.getStyle().layers;
      const newOrigin = origin.split(",").reverse().join(",");
      const newDestination = destination.split(",").reverse().join(",");
      // Find the index of the first symbol layer in the map style
      let firstSymbolId;
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol') {
          firstSymbolId = layers[i].id;
          break;
        }
      }
      if (!this.apiToken) throw new Error("Please define api token of GoongMap into plugin option")

      // Get Directions
      const directionService = gmsDirection({ accessToken: this.apiToken });
      directionService.getDirections({
            origin: newOrigin,
            destination: newDestination,
            vehicle: 'car'
          })
          .send()
          .then((response) => {
            let directions = response.body;
            let route = directions.routes[0];

            let geometry_string = route.overview_polyline.points;
            let geoJSON = polyline.toGeoJSON(geometry_string);

            const randomRoute = randomStr(5);
            this.directionManager.push(randomRoute);
            map.addSource(randomRoute, {
              'type': 'geojson',
              'data': geoJSON
            });
            // Add route layer below symbol layers
            map.addLayer(
                {
                  'id': randomRoute,
                  'type': 'line',
                  'source': randomRoute,
                  'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                  },
                  'paint': {
                    'line-color': '#1e88e5',
                    'line-width': 8
                  }
                },
                firstSymbolId
            );
          });
    }
  },
  watch: {
    markers: function (newMarkers) {
      debounce(this.removeAndAddMarker, 500)(this, newMarkers);
    },
    direction: function () {
      debounce(this.resetDirection, 500)(this);
    }
  }
}
</script>