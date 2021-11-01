import {BASE_URL} from "../../../constants/config";

export default class Geocoding {
    constructor(apiToken) {
        this.apiToken = apiToken;
    }

    reverseGeoCoding(lng, lat){
        const latLng = `${lat},${lng}`;
        return fetch(`${BASE_URL.GOONG_MAP}/Geocode?latlng=${latLng}&api_key=${this.apiToken}`)
    }

    forwardGeocoding = (address) => {
        return fetch(`${BASE_URL.GOONG_MAP}/geocode?address=${address}&api_key=${this.apiToken}`)
    }
}