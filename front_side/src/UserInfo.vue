<template>

  <div class="user-area-wrap">
    <div class="row">
      <div class="col-md-5" :class="{ 'col-md-push-7': isLeft }">
        <user-left-ships
          :is-left="isLeft"
          :ship4="userStat.leftShip4"
          :ship3="userStat.leftShip3"
          :ship2="userStat.leftShip2"
          :ship1="userStat.leftShip1"></user-left-ships>
      </div>
      <div class="col-md-7" :class="{ 'col-md-pull-5': isLeft }">
        <user-avatar-name :username="username"></user-avatar-name>
      </div>
    </div>
  </div>

</template>


<script>
  import UserAvatarName from './UserAvatarName.vue'
  import UserLeftShips from './UserLeftShips.vue'

  export default {
    name: 'app3',
    data () {
      return {

      }
    },
    props: ['username', 'isLeft', 'userStat'],
    components: {
      UserAvatarName, UserLeftShips
    }
  }

</script>


<style lang="scss" scoped>

  @import "vars";

  .text{
    counter-reset: none;
  }

  .user-area-wrap{
    font-size: 1.5rem;
  }

</style>
