<template>

  <div class="preparing-screen">
    <div class="row">
      <div class="col-md-4 col-md-push-4">
        <div class="user-avatar-preparing">
          <user-avatar-name
            :username="user.name"
            :truncate-number="19"></user-avatar-name>
        </div>
      </div>
    </div>
    <div class="area">
      <div class="row">
        <div class="col-md-3">
          <div class="game-stat">
            <div class="game-status-wrap">
              Waiting for opponent
            </div>
            <button
              class="button w100"
              @click="buildShip">Build ship</button>
            <button
              class="button w100 button-red"
              @click="clearArea">Clear area</button>
            <button
              class="button button-green w100"
              @click="startGame">Start game</button>
          </div>
        </div>
        <div class="col-md-6">
          <user-area
            :area="yourArea"
            :state="2"
            @select-deselect-field="selectDeselectField"></user-area>
        </div>
        <div class="col-md-3">
          <div class="left-ships-name-wrap">
            <div class="left-ships-name">Left ships</div>
          </div>
          <user-left-ships
            :is-left="true"
            :ship4="rules.ship_4 - yourStat.leftShip4"
            :ship3="rules.ship_3 - yourStat.leftShip3"
            :ship2="rules.ship_2 - yourStat.leftShip2"
            :ship1="rules.ship_1 - yourStat.leftShip1"></user-left-ships>
        </div>
      </div>
    </div>
  </div>

</template>


<script>
  import UserAvatarName from '../UserAvatarName.vue'
  import UserLeftShips from '../UserLeftShips.vue'
  import UserArea from '../UserArea.vue'

  export default {
    name: 'PreparingScreen',
    data () {
      return {

      }
    },
    props: ['user', 'yourStat', 'yourArea', 'rules'],
    components: {
      UserAvatarName, UserLeftShips, UserArea
    },
    methods: {
      buildShip() {
        this.$emit('build-ship');
      },
      startGame() {
        this.$emit('start-game');
      },
      clearArea() {
        this.$emit('clear-area');
      },
      selectDeselectField(data) {
        this.$emit('select-deselect-field', data);
      }
    }
  }

</script>


<style lang="scss" scoped>

  @import "../vars";

  .preparing-screen {
    padding-top: 20px;
  }

  .user-avatar-preparing {
    padding-left: 50px;
    padding-right: 50px;
  }

  .area {
    margin-top: 35px;
  }

  .game-stat {

  }

  .left-ships-name-wrap {
    .left-ships-name {
      background-color: $color-white;
      font-size: 1.5rem;
      border: 1px solid $color-black;
      box-shadow: $box-shadow;
      padding: 7px 30px;
      margin-bottom: 30px;
      display: inline-block;
    }
  }

</style>
