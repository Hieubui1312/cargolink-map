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
      directionManager: [],
      popupDirectionManager: [],
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
      return  new this.goong.Map(options)
    },
  },
  mounted() {
    const map = this.initialMap;
    map.on("load",  () => {
      if (this.direction && this.direction.origin && this.direction.destination) {
        this.resetDirection();
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
    addMarkers: function (markers) {
      const map = this.initialMap;
      markers.forEach(marker => {
        if (!marker.options || !marker.longLat) throw new Error("Format of marker is not correct. It's must contain [{options?, longLat?}]");
        const markerInstance = new this.goong.Marker(marker.options);
        this.markersManager.push(markerInstance);
        markerInstance.setLngLat(marker.longLat)

        if (marker.options.draggable) {
          markerInstance.on('dragend', async () => {
            const lngLat = markerInstance.getLngLat();
            marker.dragend && marker.dragend(await this.$cargoMap.reverseGeoCoding(lngLat.lng, lngLat.lat).then(res => res.json()));
          })
          markerInstance.on('dragstart', async () => {
            const lngLat = markerInstance.getLngLat();
            marker?.dragstart && marker.dragstart(await this.$cargoMap.reverseGeoCoding(lngLat.lng, lngLat.lat).then(res => res.json()));
          })
          markerInstance.on('drag', async () => {
            const lngLat = markerInstance.getLngLat();
            marker.drag && marker.drag(await this.$cargoMap.reverseGeoCoding(lngLat.lng, lngLat.lat).then(res => res.json()));
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
      const directionResult = [];
      if(destination && destination.length > 0) {
        directionResult.push(this.findDirection(origin,destination[0]))
        if(destination.length > 1) {
          for( let i = 0; i < destination.length-1; i++) {
            directionResult.push(this.findDirection(destination[i],destination[i+1]));
          }
        }
      }
      Promise.all(directionResult).then(value => {
        this.$emit("distanceDuration", value)
      }).catch((error) => {
        window.console.error(error.message);
        this.$emit("distanceDuration", [])
      })
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
      const boundingBox = [];
      if (direction.origin) {
        boundingBox.push(direction.origin.split(","));
      }
      if (direction.destination && direction.destination.length) {
        direction.destination.forEach(item => {
          if (item) boundingBox.push(item.split(","));
        })
      }
      if (boundingBox.length >= 2) {
        let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
        boundingBox.forEach(item => {
          if (+item[1] < minLat) {
            minLat = +item[1];
          }
          if (+item[1] > maxLat) {
            maxLat = +item[1];
          }
          if (+item[0] < minLng) {
            minLng = +item[0];
          }
          if (+item[0] > maxLng) {
            maxLng = +item[0];
          }
        })

        map.fitBounds([
            [minLng, minLat],
            [maxLng, maxLat]
        ], {
          padding: 30
        });
      } else if (boundingBox.length === 1) {
        map.setCenter(boundingBox[0]);
      }
    },
    resetDirection: function () {
      this.findBoundingBox();
      this.removePopupDirection();
      this.removeSourceAndLayer();
      this.findManyDirections();
    },
    findDirection: function (origin, destination) {
      const map = this.initialMap;
      const layers = map.getStyle().layers;
      if (!origin || !destination || !destination.length) return;
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
      let distance = "", duration = "";

      return directionService.getDirections({
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

            // Add popup distance and duration direction
            const legs = route.legs;
            if (legs && legs.length > 0) {
              const leg = legs[0];
              const pointsDirection = polyline.decode(geometry_string);
              if (pointsDirection && pointsDirection.length) {
                const halfPoint = pointsDirection[Math.floor(pointsDirection.length / 2)];
                distance = leg.distance.text;
                duration = leg.duration.text;
                this.addPopupDirection(halfPoint.reverse(), distance, duration);
              }
            }

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
            return {
              distance,
              duration
            }
          });
    },
    removePopupDirection: function () {
      while (this.popupDirectionManager.length) {
        const popup = this.popupDirectionManager.pop();
        popup.remove();
      }
    },
    addPopupDirection: function (halfPoint, distance, duration) {
      const map = this.initialMap;
      const popup = new this.goong.Popup({ closeOnClick: false })
        .setLngLat(halfPoint)
        .setHTML(`
            <p style="font-size: 12px; margin: 0">${distance}</p>
            <p style="font-size: 12px; margin: 0">${duration}</p>`)
      this.popupDirectionManager.push(popup);
      popup.addTo(map);
    }
  },
  watch: {
    markers: function (newMarkers, oldMarkers) {
      if (JSON.stringify(newMarkers) !== JSON.stringify(oldMarkers)) {
        debounce(this.removeAndAddMarker, 500)(this, newMarkers);
      }
    },
    direction: function (newDirection, oldDirections) {
      if (JSON.stringify(newDirection) !== JSON.stringify(oldDirections)) {
        debounce(this.resetDirection, 500)(this);
      }
    },
  }
}
</script>