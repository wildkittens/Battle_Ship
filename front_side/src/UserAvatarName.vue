<template>
  <div class="user-avatar-name">
    <div class="avatar">
      <img :src="avatarSrc" alt="User avatar">
    </div>
    <div class="name" v-if="username.length > 0">
      {{ username | truncate(truncateNumber) }}
    </div>
  </div>
</template>


<script>

  import jsSHA from 'jssha'
  import Identicon from 'identicon.js'



  export default {
    name: 'UserAvatarName',
    data() {
      return {

      }
    },
    computed: {
      avatarSrc() {
        let shaObj = new jsSHA("SHA-512", "TEXT");
        shaObj.update(this.username);
        let hash = shaObj.getHash("HEX");

        let src = new Identicon(hash, 320).toString();

        return 'data:image/png;base64,' + src;
      }
    },
    props: {
      username: {
        type: String
      },
      truncateNumber: {
        default: 17,
        type: Number
      }
    }
  }
</script>


<style lang="scss" scoped>
  @import "vars";

  .user-avatar-name{
    font-size: 1.5rem;
    .avatar{
      width: 55%;
      margin: 0 auto;
      background-color: $color-white;
      box-shadow: $box-shadow;
      border: 1px solid $color-black;

      img {
        width: 100%;
      }
    }

    .name {
      padding: 5px 15px;
      background-color: $color-white;
      box-shadow: $box-shadow;
      border: 1px solid $color-black;
      display: inline-block;
      margin-top: 15px;

      min-width: 80%;
      max-width: 100%;
      overflow: hidden;
    }
  }
</style>
