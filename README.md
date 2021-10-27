# cargolink-map

## References
Goong Documents: https://docs.goong.io/javascript/

## Install package
```javascript
npm i cargolink-map
```

## Import style
```javascript
import 'cargolink-map/dist/cargolink-map.css'
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
* CargoMap

| Props | Description |
| --- | ----------- |
| mode | type: string <br/> description: Set mode of map <br/> default: ""https://tiles.goong.io/assets/goong_map_web.json"" <br/> References: "https://docs.goong.io/style-spec/" |
| zoom | type: number <br/> description: Set zoom of map <br/> default: 9 |
| styleMap | type: object <br/> description: Style of map <br/> Example: {width: '500px', height: '500px'} |
| markers | type: Array <br/> description: Array of marker <br/> Example: <br/>```{options, longlat: [105.83991, 21.02800], dragend: (data) => {console.log('DATA', data);}, drag: (data) => {console.log('DATA', data);}, dragstart: (data) => {console.log('DATA', data);}} ``` <br/> References: <br/> options: https://docs.goong.io/javascript/markers/ |
| direction | type: Object <br/> description: Find direction into map <br/> Ex: ``` {origin: '127,27', destination: ['127,27']} ```|
* SearchAddressInput

  * v-model: Object 

| Props | Description |
| --- | ----------- |
| classInput | type: Array <br/> description: Style input |
| classSuggestAddress | type Array<br> description: Style suggest address |
| classNotFoundResult | type Array<br> description: Style not found component |

| Slot | Description |
| --- | ----------- |
| suggest-address | description: Suggest address component |
| not-found-address | description: Not found address component |

* SuggestionAddress

  * v-model: object