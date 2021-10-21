# cargolink-map

## References
Goong Documents: https://docs.goong.io/javascript/

## Install package
```javascript
npm i cargolink-map
```

## Import package

```javascript
import CargolinkMap from "cargolink-map";
Vue.use(CargolinkMap, {
    driver: "goongmap",
    apiToken: "YOUR_API_TOKEN", // Using when call API ex: get direction...
    mapToken: "YOUR_MAP_TOKEN" // Using when load map
})
```

## Component
* CargolinkMap
    * Props:
```javascript
  /// Mode map  
  mode: {
    type: String,
    default: "https://tiles.goong.io/assets/goong_map_web.json"
  },
  /// Zoom of map  
  zoom: {
    type: Number,
    default: 9
  },
  ///Stype of map
  styleMap: {
    type: Object,
    default: () => {}
  },
  /// Center of map
  center: {
    type: Array,
    default: () => [105.83991, 21.02800]
  },
  /// Marker of map, ex: [105.79449389547807, 21.023262952893536]
  marker: {
    type: Array
  },
  /// Direction of map, ex: {origin: '20.981971,105.864323', destination: '21.031011,105.783206'}
  direction: {
    type: Object
  }
 ```

* SearchAddressInput
  * Props
  
```javascript
  value: {
    type: Object
  },
  /// Style input
  classInput: {
    type: Array,
  default: () => []
  },
  /// Style suggest address
  classSuggestAddress: {
    type: Array,
  default: () => []
  },
  /// Style not found address
  classNotFoundResult: {
    type: Array,
  default: () => []
  }
```
* v-model: object 
  * slot:
    * not-found-address: Show when not found address
    * suggest-address: Show list of suggest address