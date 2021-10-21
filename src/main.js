import Vue from 'vue'
import App from './App.vue'
import CargolinkMap from "./install";
import "./assets/goong-js.css";

Vue.config.productionTip = false;
Vue.use(CargolinkMap, {
  driver: "goongmap",
  mapToken: "YOUR_MAP_TOKEN",
  apiToken: "YOUR_API_TOKEN"
});

new Vue({
  render: h => h(App),
}).$mount('#app')

