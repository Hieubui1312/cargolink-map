<template>
  <component v-model="address" :is="dynamicComponent" v-bind="resetProps">
  </component>
</template>
<script>
import SuggestionAddressGoongMap from "../modules/goong-map/components/SuggestionAddress";
import {MAP_DRIVER_OPTIONS} from "../constants/config";

export default {
  props: {
    value: {
      type: Object
    }
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
      if (this.driverMap === MAP_DRIVER_OPTIONS.GOONG_MAP) {
        return SuggestionAddressGoongMap;
      } else {
        return "";
      }
    },
    resetProps() {
      return { ...this.$attrs };
    },
  },

}
</script>