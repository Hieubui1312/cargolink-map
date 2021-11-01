import gmsDirection from "@goongmaps/goong-sdk/services/directions";

export default class Direction {
    constructor(accessToken) {
        this.directionService = gmsDirection({accessToken});
    }

    getDirection(origin, destination, ...args){
        return this.directionService.getDirections({
            origin,
            destination,
            ...args
        }).send()
    }
}