<template>
  <div id="app">
    <span>{{ demo() }}</span>
    <CargolinkMap
        :style-map="{width: '500px', height: '500px'}"
        :marker="[105.79449389547807, 21.023262952893536]"
        :direction="{origin: '20.981971,105.864323', destination: '21.031011,105.783206'}"
    />
    <SearchAddressInput v-model="address"  />
  </div>
</template>

<script>
import SearchAddressInput from "./components/SearchAddressInput";
import CargolinkMap from "./components/CargolinkMap";

export default {
  name: 'App',
  components: {
    CargolinkMap,
    SearchAddressInput
  },
  data: () => {
    return {
      address: {
        formatted_address: ""
      }
    }
  },
  methods: {
    demo: function (){
      return this.$cargolinkMap;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
