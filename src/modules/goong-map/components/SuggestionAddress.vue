<template>
  <div>
    <div :key="`addr-${index}`" class="suggestion-address" v-for="(addr, index) in suggestAddress">
      <p class="address" @click="() => chooseAddress(addr)">
        {{ addr.formatted_address }}
      </p>
    </div>
  </div>
</template>
<script>
import {forwardGeocoding} from "../functions/functions";
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
      forwardGeocoding(this.apiToken, value).then(res => {
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
<style>
.address{
  cursor: pointer;
}
.address:hover{
  background: #ccc;
}
</style>