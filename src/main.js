import Vue from 'vue'
import App from './App.vue'
import CargolinkMap from "./install";
import "./assets/goong-js.css";

Vue.config.productionTip = false;
Vue.use(CargolinkMap, {
  driver: "goongmap",
  mapToken: "qw9p1ha4HKmmF0k9RysiascXn7wCNuKQiQHl01dr",
  apiToken: "VP4shKH08b0efjQoDPRraAW0nMafCdzCqUP8WtdA"
});

new Vue({
  render: h => h(App),
}).$mount('#app')

