<template>
  <component :is="dynamicComponent" v-bind="resetProps">
  </component>
</template>
<script>
import {MAP_DRIVER_OPTIONS} from "../constants/config";
import GoongMap from "../modules/goong-map/components/GoongMap";

export default {
  name: "CargolinkMap",
  components: {GoongMap},
  computed: {
    dynamicComponent(){
      if (this.driverMap == MAP_DRIVER_OPTIONS.GOONG_MAP) {
        return 'goong-map';
      } else {
        return '';
      }
    },
    resetProps() {
      return { ...this.$attrs };
    },
  }
}
</script>