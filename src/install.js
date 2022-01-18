import CargolinkMap from "./components/CargolinkMap";
import SearchAddressInput from "./components/SearchAddressInput";
import SuggestionAddress from "./components/SuggestionAddress";
import "./assets/goong-js.css";
import Direction from "./instances/direction";
import Geocoding from "./instances/geocoding";
import {KEY_TYPE, MAP_DRIVER_OPTIONS} from "./constants/config";
import {tracking} from "./modules/goong-map/functions/functions";

export default function install(Vue, options) {
    Vue.prototype.driverMap = options.driver;
    if (options.driver === MAP_DRIVER_OPTIONS.GOONG_MAP) {
        if (options.apiToken)
            Vue.prototype.apiToken = options.apiToken;
        if (options.mapToken)
            Vue.prototype.mapToken = options.mapToken;
    }
    if (options.trackingUrl) {
        Vue.prototype.trackingUrl = options.trackingUrl;
        Vue.prototype.authUserName = options.authUserName;
        Vue.prototype.authPassword = options.authPassword;
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
            if (options.trackingUrl) {
                tracking(options.trackingUrl, options.authUserName, options.authPassword, {
                    key: options.mapToken,
                    type: KEY_TYPE.API_KEY
                })
            }
            return geocoding.reverseGeoCoding(lng, lat);
        },

        forwardGeocoding: (add) => {
            if (options.trackingUrl) {
                tracking(options.trackingUrl, options.authUserName, options.authPassword, {
                    key: options.mapToken,
                    type: KEY_TYPE.API_KEY
                })
            }
            return geocoding.forwardGeocoding(add);
        }
    }
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(install);
}

