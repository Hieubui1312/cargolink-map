import DirectionGoongMap from "../modules/goong-map/instances/direction";
import {MAP_DRIVER_OPTIONS} from "../constants/config";

export default function (driver) {
    switch (driver) {
        case MAP_DRIVER_OPTIONS.GOONG_MAP:
            return DirectionGoongMap;
        default:
            throw new Error("Driver option have been not supported by cargolink-map");
    }
}