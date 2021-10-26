<template>
  <div>
    <input :class="classInput" v-model="address" @blur="onBlur" />
    <div :class="classSuggestAddress" id="suggest-address">
      <slot name="suggest-address" v-if="suggestAddress && suggestAddress.length">
        <template v-for="(add, key) in suggestAddress">
          <div @click="() => selectAddress(add)" :key="`address-${key}`">{{ add.formatted_address }}</div>
        </template>
      </slot>
    </div>
    <slot name="not-found-address" v-if="isNotFoundAddress">
      <div :class="classNotFoundResult" >Not found address</div>
    </slot>
  </div>
</template>
<script>

export default {
  props: {
    value: {
      type: Object
    },
    classInput: {
      type: Array,
      default: () => []
    },
    classSuggestAddress: {
      type: Array,
      default: () => []
    },
    classNotFoundResult: {
      type: Array,
      default: () => []
    }
  },
  data: function (){
    return {
      suggestAddress: [],
      isNotFoundAddress: false
    }
  },
  computed: {
    address: {
      get: function (){
        return this.value.formatted_address;
      },
      set: function (newValue) {
        this.$emit("input", {formatted_address: newValue});
        this.debounce(this.searchAddress, 100)(newValue)
      }
    },
  },
  methods: {
    searchAddress: function (value){
      this.$cargoMap.forwardGeocoding(value).then(res => {
        return res.json()
      }).then(data => {
        this.suggestAddress = data.results;
        if ((!this.suggestAddress || this.suggestAddress.length == 0) && this.address) {
          this.isNotFoundAddress = true;
        } else {
          this.isNotFoundAddress = false;
        }
      }).catch(err => {
        console.log("ERROR", err.message);
      })
    },
    debounce: function (fn, delay) {
      return args => {
        clearTimeout(fn.id)

        fn.id = setTimeout(() => {
          fn.call(this, args)
        }, delay)
      }
    },
    selectAddress: function (address){
      this.$emit("input", address);
      this.suggestAddress = [];
    },
    onBlur: function (){
      this.$emit("input", {
        formatted_address: ""
      })
      this.isNotFoundAddress = false;
      setTimeout(() => {
        this.suggestAddress = [];
      }, 500)
    }
  },
}
</script>