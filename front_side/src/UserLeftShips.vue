<template>

  <div class="user-left-ships">
    <div class="ships" :class="{ 'left': isLeft, 'right': !isLeft }">
      <div class="ship-wrap">
        <div class="ship ship-4">{{ ship4 }}</div>
      </div>
      <div class="ship-wrap">
        <div class="ship ship-3">{{ ship3 }}</div>
      </div>
      <div class="ship-wrap">
        <div class="ship ship-2">{{ ship2 }}</div>
      </div>
      <div class="ship-wrap">
        <div class="ship ship-1">{{ ship1 }}</div>
      </div>
    </div>
  </div>

</template>


<script>

  export default {
    name: 'UserLeftShips',
    data() {
      return {

      }
    },
    props: ['ship1', 'ship2', 'ship3', 'ship4', 'isLeft']
  }

</script>


<style lang="scss" scoped>

  @import "_vars.sass";

  .ships {
    min-height: 100px;
    vertical-align: top;

    &.left{
      text-align: left;
    }
    &.right{
      text-align: right;
    }

    .ship {
      width: 100%;
      background-color: $color-white;
      box-shadow: $box-shadow;
      margin-bottom: 18px;
      border: 1px solid $color-black;
      font-size: 1.3rem;
      padding-top: 3px;
      display: inline-block;
      text-align: center;

      &.ship-1 {
        width: 25%;
      }
      &.ship-2 {
        width: 50%;
      }
      &.ship-3 {
        width: 75%;
      }
    }
  }

</style>
