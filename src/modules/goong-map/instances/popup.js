import goongjs from "@goongmaps/goong-js";


export default class Popup {
    constructor(options, extraOptions) {
        const popup = new goongjs.Popup(options);
        if (extraOptions.html) {
            popup.setHTML(extraOptions.html)
        }
        if (extraOptions.lngLat){
            popup.setLngLat(extraOptions.lngLat);
        }
        if (extraOptions.text) {
            popup.setText(extraOptions.text);
        }
        if (extraOptions.offset) {
            popup.setOffset(extraOptions.offset);
        }
        return popup;
    }
}