import {MAP_DRIVER_OPTIONS} from "../constants/config";
import GeocodingGoongMap from "../modules/goong-map/instances/geocoding";

export default function (driver) {
    switch (driver) {
        case MAP_DRIVER_OPTIONS.GOONG_MAP:
            return GeocodingGoongMap;
        default:
            throw new Error("Driver option have been not supported by cargolink-map");
    }
}