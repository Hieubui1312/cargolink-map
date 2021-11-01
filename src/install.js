import CargolinkMap from "./components/CargolinkMap";
import SearchAddressInput from "./components/SearchAddressInput";
import SuggestionAddress from "./components/SuggestionAddress";
import "./assets/goong-js.css";
import Direction from "./instances/direction";
import Geocoding from "./instances/geocoding";
import {MAP_DRIVER_OPTIONS} from "./constants/config";

export default function install(Vue, options) {
    Vue.prototype.driverMap = options.driver;
    if (options.driver == MAP_DRIVER_OPTIONS.GOONG_MAP) {
        if (options.apiToken)
            Vue.prototype.apiToken = options.apiToken;
        if (options.mapToken)
            Vue.prototype.mapToken = options.mapToken;
    }

    Vue.component("CargoMap", CargolinkMap);
    Vue.component("CargoMapSearchAddressInput", SearchAddressInput);
    Vue.component("CargoMapSuggestionAddress", SuggestionAddress);

    // const direction = new Direction(options.driver)(options.apiToken);
    const direction = new (Direction(options.driver))(options.apiToken);
    const geocoding = new (Geocoding(options.driver))(options.apiToken)
    Vue.prototype.$cargoMap = {
        findDirection: (origin, destination, ...args) => {
            return direction.getDirection(origin, destination, ...args);
        },

        reverseGeoCoding: (lng, lat) => {
            return geocoding.reverseGeoCoding(lng, lat);
        },

        forwardGeocoding: (add) => {
            return geocoding.forwardGeocoding(add);
        }
    }
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(install);
}

