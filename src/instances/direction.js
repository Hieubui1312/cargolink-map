import Direction from "../modules/goong-map/instances/direction";
import {MAP_DRIVER_OPTIONS} from "../constants/config";

export default function (driver) {
    switch (driver) {
        case MAP_DRIVER_OPTIONS.GOONG_MAP:
            return Direction;
        default:
            break;
    }
}