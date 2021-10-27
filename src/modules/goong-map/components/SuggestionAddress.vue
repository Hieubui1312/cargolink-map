<template>
  <div class="wrapper-suggestion-address">
    <p :key="`addr-${index}`"
         @click="() => chooseAddress(addr)"
         class="suggestion-address"
         v-for="(addr, index) in suggestAddress">
      {{ addr.formatted_address }}
    </p>
  </div>
</template>
<script>
import {debounce} from "../../../helpers/function";

export default {
  props: {
    value: {
      type: Object
    }
  },
  data: function() {
    return {
      suggestAddress: [],
      isDone: false
    }
  },
  computed: {
    address: {
      get: function (){
        return this.value.formatted_address;
      },
      set: function (value){
        this.$emit("input", value);
      }
    }
  },
  methods: {
    searchAddress: function (value){
      this.$cargoMap.forwardGeocoding(value).then(res => {
        return res.json();
      }).then(data => {
        this.suggestAddress = data.results;
      }).catch(() => {
        this.suggestAddress = [];
      })
    },
    chooseAddress: function (address){
      this.isDone = true;
      this.address = address;
      this.suggestAddress = [];
      this.$nextTick(() => {
        this.isDone = false;
      })
    }
  },
  watch: {
    address: function (value){
      if (!this.isDone) {
        debounce(this.searchAddress, 500)(this, value)
      }
    }
  }
}
</script>
<style scoped>
.suggestion-address{
  cursor: pointer;
  padding: 2px 5px;
  font-size: 14px;
}
.suggestion-address:hover{
  background: rgba(204, 204, 204, 0.31);
}
.wrapper-suggestion-address {
  background: white;
}
</style>