<template>
  <component v-model="address" :is="dynamicComponent" v-bind="resetProps">
  </component>
</template>
<script>
import SearchAddressInputGoongMap from "../modules/goong-map/components/SearchAddressInput";
import {MAP_DRIVER_OPTIONS} from "../constants/config";
export default {
  name: "SearchAddressInput",
  components: {
    SearchAddressInputGoongMap
  },
  props: {
    value: Object
  },
  computed: {
    address: {
      get: function (){
        return this.value;
      },
      set: function (value){
        this.$emit("input", value)
      }
    },
    dynamicComponent() {
      if (this.driverMap == MAP_DRIVER_OPTIONS.GOONG_MAP) {
        return SearchAddressInputGoongMap;
      } else {
        return "";
      }
    },
    resetProps() {
      return { ...this.$attrs };
    },
  }
}
</script>