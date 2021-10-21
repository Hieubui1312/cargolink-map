import CargolinkMap from "./components/CargolinkMap";
import SearchAddressInput from "./components/SearchAddressInput";
import SuggestionAddress from "./components/SuggestionAddress";
import "./assets/goong-js.css";

export default function install(Vue, options) {
    Vue.prototype.driverMap = options.driver;
    if (options.driver == "goongmap") {
        if (options.apiToken)
            Vue.prototype.apiToken = options.apiToken;
        if (options.mapToken)
            Vue.prototype.mapToken = options.mapToken;
    } else {
        Vue.prototype.$cargolinkMap = "GoogleMap";
    }

    Vue.component("CargoMap", CargolinkMap);
    Vue.component("CargoMapSearchAddressInput", SearchAddressInput);
    Vue.component("CargoMapSuggestionAddress", SuggestionAddress);
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(install);
}

