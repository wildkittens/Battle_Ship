<template>

  <div class="game-screen">
    <div class="row">
      <div class="col-md-5">
        <user-info
          :username="your.name"
          :is-left="true"
          :user-stat="yourStat"></user-info>
      </div>
      <div class="col-md-2">

      </div>
      <div class="col-md-5">
        <user-info
          :username="enemy.name"
          :is-left="false"
          :user-stat="enemyStat"></user-info>
      </div>
    </div>
    <div class="row">
      <div class="areas">
        <div class="col-md-4">
          <user-area
            :area="yourArea"
            :state="1"></user-area>
        </div>
        <div class="col-md-4">
          <div class="game-status">
            <div v-if="isYourTurn">Your turn</div>
            <div v-else>Enemy turn</div>
          </div>
        </div>
        <div class="col-md-4">
          <user-area
            :area="enemyArea"
            :state="3"
            @game-fire="gameFire"></user-area>
        </div>
      </div>
    </div>
  </div>

</template>


<script>
  import UserInfo from '../UserInfo.vue'
  import UserArea from '../UserArea.vue'

  export default {
    name: 'GameScreen',
    data () {
      return {

      }
    },
    components: {
      UserInfo, UserArea
    },
    props: ['your', 'yourArea', 'yourStat', 'enemy', 'enemyArea', 'enemyStat', 'isYourTurn'],
    methods: {
      gameFire(data) {
        this.$emit('game-fire', data);
      }
    }
  }

</script>


<style lang="scss" scoped>

  @import "../vars";

  .game-screen {
    // background-color: #f00;
    padding-top: 20px;
  }

  .areas {
    margin-top: 40px;
  }

  .game-status {
    background-color: $color-white;
    border: 1px solid $color-black;
    box-shadow: $box-shadow;
    padding: 10px 20px;
    font-size: 1.5em;
  }

</style>
