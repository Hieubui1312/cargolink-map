import CargolinkMap from "./components/CargolinkMap";
import SearchAddressInput from "./components/SearchAddressInput";
import SuggestionAddress from "./components/SuggestionAddress";
import "./assets/goong-js.css";
import Direction from "./modules/goong-map/instances/direction";
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

    Vue.prototype.$cargoMap = {
        findDirection: (origin, destination, ...args) => {
            const instance = new Direction(options.apiToken);
            return instance.getDirection(origin, destination, ...args);
        }
    }
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(install);
}

