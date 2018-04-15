<template>
  <div class="connect-screen">
    <h1>BattleShip game</h1>

    <div v-if="state == ''" class="row">
      <div class="col-md-6">
        <button class="button w100 button-green"
                @click="stateChange('create')">Create game</button>
      </div>
      <div class="col-md-6">
        <button class="button w100 button-ligh-gray"
                @click="stateChange('join')">Join game</button>
      </div>
    </div>

    <div class="form-create" v-if="state == 'create'">

      <input type="text"
             v-model="name"
             placeholder="Name"
             @keyup.enter="createGame"> <br>
      <button class="button button-red"
              @click="stateChange('')">Back</button>
      <button class="button button-green"
              @click="createGame">Create</button>

      <div v-if="gameStatus == 3">
        id игры - {{ gameId }} <br>
        Ожидание подключения другого игрока

        <div class="game-url-wrap">
          <label class="label" for="join-url-input">Share this link to your friend</label>
          <input
            id="join-url-input"
            type="text"
            class="game-url"
            :value="gameURL"
            @focus="$event.target.select()">
        </div>
      </div>

    </div>

    <div class="form-join" v-if="state == 'join'">

      <input
        type="text"
        v-model="name"
        placeholder="Name"
        @keyup.enter="joinGame"> <br>
      <input
        type="number"
        pattern="\d*"
        v-model="joinGameId"
        placeholder="Game id"
        @keyup.enter="joinGame"> <br>
      <button class="button button-red"
              @click="stateChange('')">Back</button>
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
        state: '',
        name: '',
        joinGameId: '',


      }
    },
    computed: {
      gameURL(){
        return window.location.hostname + '/#join-' + this.gameId
      }
    },
    props: ['gameStatus', 'gameId'],
    methods: {
      selectText() {
        if (document.selection) {
          var range = document.body.createTextRange();
          range.moveToElementText(document.getElementById(containerid));
          range.select();
        } else if (window.getSelection()) {
          var range = document.createRange();
          range.selectNode(document.getElementById(containerid));
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
        }
      },
      createGame() {
        this.errors = [];

        if (this.name.length === 0) {
          ErrorBus.$emit('error', {
            code: 1,
            message: 'Поле "имя" пустое'
          });
          return;
        }
        if (this.gameId !== -1) {
          let self = this;
          ErrorBus.$emit('error', {
            code: 0,
            message: 'Вы уже в игре с id = ' + self.gameId
          });
          return;
        }

        this.$emit('create-game', {
          username: this.name
        })
      },
      joinGame() {
        this.errors = [];


        if (this.name.length === 0) {
          ErrorBus.$emit('error', {
            code: 1,
            message: 'Поле "имя" пустое'
          });
          return;
        }
        if (this.joinGameId.length === 0) {
          ErrorBus.$emit('error', {
            code: 1,
            message: 'Поле "id" пустое'
          });
          return;
        }


        this.$emit('join-game', {
          username: this.name,
          id: this.joinGameId
        })
      },

      stateChange(newState) {
        this.errors = '';
        this.state = newState;
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


  .game-url {
    padding: 3px 6px;
    // background-color: $color-green;
    // background-color: $color-green;
    box-shadow: $box-shadow;
    border: 1px solid $color-black;
    display: inline-block;
    max-width: 100%;
    min-width: 400px;

    text-align: center;
  }

  .label {
    display: block;
    margin-top: 40px;
  }
</style>
