<template>

  <div class="header-dev-wrap">
    <div class="header-dev"
         :class="{ 'hide': !showHeader }">
      <button @click="stateChange('connect')"
              class="button">Page connect</button>
      <button @click="stateChange('preparing')"
              class="button">Page preparing</button>
      <button @click="stateChange('game')"
              class="button">Page game</button>
      <button @click="stateChange('finish')"
              class="button">Page finish</button>
      <button @click="stateChange('disconnect')"
              class="button">Page disconnect</button>
    </div>
    <button class="show-dev"
            @click="showHeader = !showHeader">x</button>
  </div>

</template>


<script>

  export default {
    name: 'HeaderDev',
    data() {
      return {
        showHeader: true,
      }
    },
    methods: {
      stateChange(newState) {
        this.$emit('state-change', { newState: newState });
      }
    },
    created() {
      let self = this;
      window.addEventListener('keydown', function(event) {
        if (event.keyCode == 32) {
          event.preventDefault();
          // self.spacePressed();
          self.showHeader = ! self.showHeader;
        }
      });
    }
  }

</script>


<style lang="scss" scoped>

  @import "../vars";

  .header-dev {
    // position: relative;
    height: auto;
    transitions: height .5s ease;

    &.hide {
      height: 0;
    }
  }

  button.show-dev{
    background: $color-white;
    border: 1px solid $color-black;
    box-shadow: $box-shadow;
    width: 30px;
    height: 30px;
    border-radius: 50%;

    position: fixed;
    right: 10px;
    top: 10px;

    &:hover {
      top: 12px;
      right: 8px;
      box-shadow: $box-shadow-hover;
    }
  }


</style>
