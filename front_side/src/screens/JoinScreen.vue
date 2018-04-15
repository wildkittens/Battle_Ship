<template>
  <div class="connect-screen">
    <h1>BattleShip game</h1>

    <div class="form-create">

      <h2>Connecting to the game with id - {{ gameId }}</h2>

      <input type="text"
             v-model="name"
             placeholder="Name"
             @keyup.enter="joinGame"> <br>
      <button class="button button-green" @click="joinGame">Join</button>

    </div>

  </div>
</template>


<script>
  import { ErrorBus } from '../error-module/error-bus'

  export default {
    name: 'ConnectScreen',
    data() {
      return {
        name: ''
      }
    },
    props: ['gameId'],
    methods: {
      joinGame() {
        this.errors = [];


        if (this.name.length === 0) {
          // this.errors.push('Вы не ввели имя');
          ErrorBus.$emit('error', {
            code: 1,
            message: 'Поле "имя" пустое'
          });
          return;
        }


        this.$emit('join-game', {
          username: this.name,
          id: this.gameId
        })
      }
    }
  }
</script>


<style lang="scss" scoped>
  @import "../vars";

  .connect-screen{
    margin-top: 20px;

    h1{
      font-size: 2rem;
    }
    background-color: $color-white;
    border: 1px solid $color-black;
    box-shadow: $box-shadow;

    padding: 20px 30px;
  }


  .errors {

    .error {
      display: inline-block;
      padding: 10px 18px;
      border: 1px solid $color-black;
      box-shadow: $box-shadow;
      background-color: $color-red;

      margin-bottom: 10px;
      max-width: 100%;
    }
  }

  h2{
    margin-top: 10px;
    margin-bottom: 15px;
  }
</style>
