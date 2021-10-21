<template>
  <div :style="styleMap" :id="randomIdMap">
  </div>
</template>
<script>
import {randomStr} from "../../../helpers/function";
import goongjs from "@goongmaps/goong-js";
import polyline from "@mapbox/polyline";
import gmsDirection from "@goongmaps/goong-sdk/services/directions";

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
    direction: {
      type: Object
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
    }
  },
  mounted() {
    const map = this.initialMap();
    if (this.marker) {
      this.addMarkerIntoMap(map, this.marker)
    }
    map.on("load",  () => {
      if (this.direction && this.direction.origin && this.direction.destination) {
        this.findDirection(this.direction.origin, this.direction.destination, map);
      }
    })
  },
  methods: {
    initialMap: function (){
      const options = {
        container: this.randomIdMap,
        style: this.mode,
        zoom: this.zoom
      };
      if (this.center) {
        options.center = this.center
      }
      const map = new this.goong.Map(options)
      return map;
    },
    addMarkerIntoMap: function (map, longlat){
      new this.goong.Marker().setLngLat(longlat).addTo(map)
    },

    findDirection: function (origin, destination, map) {
      const layers = map.getStyle().layers;
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
            origin,
            destination,
            vehicle: 'car'
          })
          .send()
          .then(function (response) {
            let directions = response.body;
            let route = directions.routes[0];

            let geometry_string = route.overview_polyline.points;
            let geoJSON = polyline.toGeoJSON(geometry_string);
            map.addSource('route', {
              'type': 'geojson',
              'data': geoJSON
            });
// Add route layer below symbol layers
            map.addLayer(
                {
                  'id': 'route',
                  'type': 'line',
                  'source': 'route',
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
  }
}
</script>