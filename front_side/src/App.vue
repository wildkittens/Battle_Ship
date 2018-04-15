<template>
  <div id="app">

    <!--<header-dev @state-change="stateChange"></header-dev>-->

    <error></error>

    <transition name="fade" mode="out-in">
      <connect-screen
        v-if="game.state == 'connect'"

        :gameId="game.id"
        :gameStatus="game.status"

        @create-game="createGame"
        @join-game="joinGame"></connect-screen>
      <join-screen
        v-if="game.state == 'join'"

        :gameId="game.id"

        @join-game="joinGame"></join-screen>
      <preparing-screen
        v-else-if="game.state == 'preparing'"
        :user="game.your"
        :your-stat="yourStat"
        :yourArea="yourArea"
        :rules="game.rules"

        @build-ship="buildShip"
        @start-game="startGame"
        @select-deselect-field="selectDeselectField"
        @clear-area="clearArea"></preparing-screen>
      <game-screen
        v-else-if="game.state == 'game'"

        :your="game.your"
        :your-area="yourArea"
        :enemy="game.enemy"
        :enemy-area="enemyArea"
        :your-stat="yourStat"
        :enemy-stat="enemyStat"

        :is-your-turn="game.isYourTurn"

        @game-fire="gameFire"></game-screen>
      <finish-screen
        v-else-if="game.state == 'finish'"

        :your="game.your"
        :your-area="yourArea"
        :enemy="game.enemy"
        :enemy-area="enemyArea"
        :id-winner="game.finish.winnerId"
        :all-enemy-ships="game.finish.enemyShips"
        :rules="game.rules"
        :server-stat="game.finish.stat"></finish-screen>

      <disconnect-screen
        v-else-if="game.state == 'disconnect'"

        :your="game.your"
        :your-area="yourArea"
        :enemy="game.enemy"
        :enemy-area="enemyArea"
        :id-winner="game.finish.winnerId"
        :all-enemy-ships="game.finish.enemyShips"
        :rules="game.rules"
        :server-stat="game.finish.stat"></disconnect-screen>
    </transition>



  </div>
</template>

<script>
import ConnectScreen from './screens/ConnectScreen.vue'
import JoinScreen from './screens/JoinScreen.vue'
import PreparingScreen from './screens/PreparingScreen.vue'
import GameScreen from './screens/GameScreen.vue'
import FinishScreen from './screens/FinishScreen.vue'
import DisconnectScreen from './screens/DisconnectScreen.vue'

// event Bus
import { ErrorBus } from './error-module/error-bus.js'

// core
import Core from './core'

import Error from './error-module/Error.vue'

// todo delete on production
import HeaderDev from './dev/HeaderDev.vue'

import key from 'keymaster'

import io from 'socket.io-client'

let socket = io.connect('http://battleshipnova.herokuapp.com');
//let socket = io.connect('http://192.168.1.29:5010');

function compareObjects(obj1, obj2) {
  return ( JSON.stringify(obj1) === JSON.stringify(obj2) );
}

export default {
  name: 'App',
  data () {
    return {
      msg: 'Hello',

      errors: '',
      currentRoute: window.location.hash,

      game: {
        id: -1,

        finish: {
          winnerId: -1,
          enemyShips: [],
          stat: {
            hits: 0, // число попаданий (сколько палуб убито)
            fires: 0 // общее число атак (сколько ходов сделано)
          }
        },

        status: 1,
        state: 'connect', // connect | join | preparing | game | finish | disconnect

        isYourTurn: false,
        canStartNotWithAllShips: false,

        rules: {
          areaWidth: 10,
          areaHeight: 10,

          ship_4: 1,
          ship_3: 2,
          ship_2: 3,
          ship_1: 4,

          countShips: 10
        },

        your: {
          id: null,
          name: '',
          ships: [
            /*{
              coords: [
                { x: 0, y: 0, is_kill: false },
                { x: 0, y: 1, is_kill: true },
                { x: 0, y: 2, is_kill: false }
              ],
              is_kill: false
            }*/
          ],
          selected: [
             /*{ x: 5, y: 5 }*/
          ],
          missed: [
            /*{x: 6, y: 6}*/
          ],

          isBuildAllShips: false
        },
        enemy: {
          id: null,
          name: '',
          ships: [],
          missed: [
            /* {x: <int 0..9>, y: <int 0..9>} */
          ]
        }
      }

    }
  },
  computed: {
    yourArea() {
      let area = this.initEmptyArea();

      // где стоят корабли
      for (let ship of this.game.your.ships) {
        // обрабатываем корабль
        for (let coord of ship.coords) {
          if (coord.is_kill) {
            area[coord.y][coord.x] = 3;
          } else {
            area[coord.y][coord.x] = 1;
          }
        }

      }

      // selected поля
      for (let select of this.game.your.selected) {
        area[select.y][select.x] = 4;
      }

      // missed поля
      for (let miss of this.game.your.missed) {
        area[miss.y][miss.x] = 2;
      }

      return area;
    },
    yourStat() {

      let leftShip4 = 0;
      let leftShip3 = 0;
      let leftShip2 = 0;
      let leftShip1 = 0;

      for (let ship of this.game.your.ships) {
        if (ship.is_kill) {
          continue;
        }

        if ( ship.coords.length === 4 ) {
          leftShip4++;
        } else if ( ship.coords.length === 3 ) {
          leftShip3++;
        } else if ( ship.coords.length === 2 ) {
          leftShip2++;
        } else if ( ship.coords.length === 1 ) {
          leftShip1++;
        }
      }

      return {
        leftShip4: leftShip4,
        leftShip3: leftShip3,
        leftShip2: leftShip2,
        leftShip1: leftShip1,

        countShips: leftShip4 + leftShip3 + leftShip2 + leftShip1
      }
    },
    enemyArea() {
      let area = this.initEmptyArea();

      // обрабатываем корабль
      for (let ship of this.game.enemy.ships) {
        // обрабатываем корабль
        for (let coord of ship.coords) {
          area[coord.y][coord.x] = 1;
        }

      }

      // missed поля
      for ( let miss of this.game.enemy.missed ) {
        area[miss.y][miss.x] = 2;
      }

      return area;
    },
    enemyStat() {
      let leftShip4 = this.game.rules.ship_4;
      let leftShip3 = this.game.rules.ship_3;
      let leftShip2 = this.game.rules.ship_2;
      let leftShip1 = this.game.rules.ship_1;

      for (let ship of this.game.enemy.ships) {
        if (!ship.is_kill) {
          continue;
        }

        if ( ship.coords.length === 4 ) {
          leftShip4--;
        } else if ( ship.coords.length === 3 ) {
          leftShip3--;
        } else if ( ship.coords.length === 2 ) {
          leftShip2--;
        } else if ( ship.coords.length === 1 ) {
          leftShip1--;
        }
      }

      return {
        leftShip4: leftShip4,
        leftShip3: leftShip3,
        leftShip2: leftShip2,
        leftShip1: leftShip1
      }
    }
  },
  methods: {
    initEmptyArea() {
      let array = new Array(this.game.rules.areaHeight);
      for (let i = 0; i < array.length; array[i++] = new Array(this.game.rules.areaWidth).fill(0));

      return array;
    },

    // working with ships
    getShip(x ,y, array) {
      for ( let ship of array ) {
        let findShip = false;
        for ( let coord of ship.coords ) {
          if ( coord.x === x && coord.y === y ) {
            findShip = true;
          }
        }
        if ( findShip ) {
          return ship;
        }
      }
      return null;
    },
    findShipAround(x, y) {
      for (let ship of this.game.enemy.ships) {
        for (let coord of ship.coords) {
          if ( Math.abs(x - coord.x) <= 1 && Math.abs(y - coord.y) <= 1 ) {
            return {
              x: coord.x,
              y: coord.y
            };
          }
        }
      }

      return null;
    },
    getShipIndex(ship, ships) {
      for (let i = 0; i < ships.length; i++) {
        if (compareObjects(ships[i], ship)) {
          return i;
        }
      }
      return -1;
    },

    // change state -> change Screen vue
    stateChange(data) {
      // this.msg = data;
      this.game.state = data.newState;
    },

    // fire methods
    fireToYourArea(x, y, isHit, isShip) {
      if (isHit) {
        // тут есть палуба

        // ищем корабль и меняем статус его координаты
        let ship = this.getShip(x, y, this.game.your.ships);

        if (ship) { // если такой корабль найден
          // обрабатываем найденный корабль
          for ( let coord of ship.coords ) {
            if (coord.x === x && coord.y === y) {
              // нужная координата
              coord.is_kill = true;
              break;
            }
          }

        } else { // если такой корабль не найден, значит писос
          ErrorBus.$emit('error', {
            code: 0,
            message: 'Такого корабля нет на поле !!!!! Все плохо((('
          });
        }

        // убит ли весь корабль? (мб проверить самому!)
        if (isShip) {
          // весь корабль убит
          ship.is_kill = true;
        }

      } else {
        // на этой позиции нет корабля(палубы)
        this.game.your.missed.push({
          x: x,
          y: y
        });
      }
    },
    fireToEnemyArea(x, y, isHit, isShip) {
      if (isHit) {
        // тут есть палуба

        // ищем корабль и меняем статус его координаты
        // ищем вокруг по полю корабли
        // let hasAround = this.findShipAround(x, y);

        let shipsAround = Core.findShipsAround(x, y, this.game.enemy.ships);

        // let ship;
        // ищем по найденным координатам корабль и меняем кго нужные значения
        if (shipsAround.length > 0) {
          // вокруг есть корабли
          // ship = this.getShip(hasAround.x, hasAround.y, this.game.enemy.ships);
          // ship.coords.push({ x: x, y: y, is_kill: true });

          // новый корабль - это первый найденный
          let newShip = this.getShip(shipsAround[0].x, shipsAround[0].y, this.game.enemy.ships);
          for (let i = 1; i < shipsAround.length; i++) {
            let curShip = this.getShip(shipsAround[i].x, shipsAround[i].y, this.game.enemy.ships);

            for (let coord of curShip.coords) {
              newShip.coords.push({
                x: coord.x,
                y: coord.y,
                is_kill: true
              });
            }

            // удаляем этот корабль
            this.game.enemy.ships.splice(this.getShipIndex(curShip, this.game.enemy.ships), 1);
          }
          newShip.coords.push({
            x: x,
            y: y,
            is_kill: true
          });



        } else {
          // вокруг нет кораблей

          // добавляем корабль(реактивно)
          let curShip = Object.assign({}, {}, {
            is_kill: false,
            coords: []
          });
          curShip.coords.push(Object.assign({}, {}, { x: x, y: y, is_kill: true }));
          this.game.enemy.ships.push(curShip);
        }

        // убит ли весь корабль?
        if ( isShip ) {
          // весь корабль убит

          // this.$log.debug("убит весь корабль");
          let ship = this.getShip(x, y, this.game.enemy.ships);
          ship.is_kill = true;

          // проходимся по сеседним полям и делаем их missed
          let left = 10, right = -1, top = 10, bottom = -1;
          for (let coord of ship.coords) {
            if (coord.x > right) {
              right = coord.x;
            }
            if (coord.x < left) {
              left = coord.x;
            }

            if (coord.y > bottom) {
              bottom = coord.y;
            }
            if (coord.y < top) {
              top = coord.y;
            }
          }

          left = left - 1 < 0 ? 0 : left - 1 ;
          right = right + 1 > 9 ? 9 : right + 1 ;
          bottom = bottom + 1 > 9 ? 9 : bottom + 1 ;
          top = top - 1 < 0 ? 0 : top - 1 ;
          let enemyArea = this.enemyArea;
          // this.$log.debug('top/bottom/left/right', top, bottom, left, right);
          for (let i = left; i <= right; i++) {
            for (let j = top; j <= bottom; j++) {
              if (enemyArea[j][i] === 0) {
                this.game.enemy.missed.push({
                  x: i,
                  y: j
                });
              }
            }
          }
        }

      } else {
        // на этой позиции нет корабля(палубы)
        this.game.enemy.missed.push({
          x: x,
          y: y
        });
      }
    },

    // ConnectScreen events
    createGame(data) {
      socket.emit('create', {
        name: data.username
      });
    },
    joinGame(data) {
      socket.emit('join', {
        name: data.username,
        game_id: data.id
      });
    },

    // PreparingScreen
    startGame() {
      if (this.game.canStartNotWithAllShips) {
        socket.emit('setup-ships', {
          game_id: this.game.id,
          user_id: this.game.your.id,
          ships: this.game.your.ships
        });
      } else {
        if ((this.yourStat.leftShip4 !== this.game.rules.ship_4 ||
            this.yourStat.leftShip3 !== this.game.rules.ship_3 ||
            this.yourStat.leftShip2 !== this.game.rules.ship_2 ||
            this.yourStat.leftShip1 !== this.game.rules.ship_1)) {
          ErrorBus.$emit('error', {
            code: 0,
            message: 'Вы выставили не все корабли'
          });
          return;
        }

        socket.emit('setup-ships', {
          game_id: this.game.id,
          user_id: this.game.your.id,
          ships: this.game.your.ships
        });
      }
    },
    buildShip() {

      // проверяем можно ли строить такой корабль
      if (!Core.checkBuildShip(this.game.your.selected,
          this.yourArea,
          this.yourStat,
          this.game.rules)) {
        return;
      }

      // добавляем корабль(реактивно)
      let curShip = Object.assign({}, {}, {
        is_kill: false,
        coords: []
      });
      for (let coord of this.game.your.selected.slice()) {
        curShip.coords.push(Object.assign({}, {}, {
          x: coord.x,
          y: coord.y,
          is_kill: false
        }));
      }
      this.game.your.ships.push(curShip);

      // удаляем выделенные клетки
      this.game.your.selected.splice(0, this.game.your.selected.length);

      // проверяем все ли корабли построены
      if ( this.yourStat.countShips === this.game.rules.countShips ) {
        this.$log.debug("Вы все расставили");
        this.game.your.isBuildAllShips = true;
      }
    },
    selectDeselectField(data) {
      // если идет фаза расстановки кораблей
      if (this.game.status === 10) {
        // this.$log.debug('select field handler', data);

        // если здесь уже есть корабль
        let yourArea = this.yourArea;
        if ( yourArea[data.y][data.x] === 1 ) {
          this.$log.debug('Здесь стоит корабль');
          ErrorBus.$emit('error', 13);
          return;
        }

        // есть ли такое поле выделенное?
        let isSelected = false;
        for ( let select of this.game.your.selected ) {
          if ( compareObjects(select, data) ) {
            isSelected = true;
          }
        }

        // если нет -> вставляем : иначе -> удаляем из этого массива
        if ( !isSelected ) {
          this.game.your.selected.push(data);
        } else {
          //удалить из выделенных
          for (let i = 0; i < this.game.your.selected.length; i++) {
            if ( compareObjects(this.game.your.selected[i], data) ) {
              this.game.your.selected.splice(i, 1);
              break;
            }
          }
        }
      }
    },
    clearArea() {
      this.game.your.ships = [];
      this.game.your.selected = [];
    },

    // GameScreen
    gameFire(data) {
      if (this.game.status !== 30) {
        this.$log.debug('игра не идет game.status = ',this.game.status);
        return;
      }

      if (this.game.isYourTurn) {
        // проверяем ходил ли сюда пользователь?
        if (this.enemyArea[data.y][data.x] !== 0) {
          // this.$log.debug('Вы уже били в это поле');
          ErrorBus.$emit('error', 21);
          return;
        }

        socket.emit('fire', {
          game_id: this.game.id,
          user_id: this.game.your.id,
          coord: {
            x: data.x,
            y: data.y
          }
        });
      } else {
        // this.$log.debug('Не твой ход сейчас');
        ErrorBus.$emit('error', 22);
      }
    }

  },
  created() {

    // если path равен join и есть id
    // в любом другом пути - переходим на корневую страницу
    let route = this.currentRoute.split('-');
    if (route[0] === '#join' && Number.isInteger(Number(route[1]))) {
      // то игрок присоединяется к игре с id = route[1]
      this.$log.debug('joining to the game with id = ', route[1]);

      this.game.id = Number(route[1]);
      this.game.state = 'join';

      history.pushState({}, '', '#');
    } else if (this.currentRoute.length > 1) {
      history.pushState({}, '', '#');
    }

    socket.on('connect', function(data) {
      // defailt connection
    }.bind(this));
    socket.on('connected', function(data) {
      // connection from server
      console.log("connection established");
    }.bind(this));

    socket.on('error', function(data) {
      if (data.code === 519 && this.game.status < 10) {
        this.game.status = 4;
      }
      if (data.code === 520 && this.game.status < 10) {
        this.game.status = 5;
      }

      // this.$log.debug('error from server', data);
      ErrorBus.$emit('error', {
        code: data.code,
        message: data.message
      });
    }.bind(this));
    // ConnectScreen
    socket.on('created', function(data) {
      // this.isConnected = true
      // this.$log.debug('game created', data);

      this.game.id = data.game_id;
      this.game.your.name = data.user_name;
      this.game.your.id = data.user_id;

      this.game.status = 3;
    }.bind(this));
    socket.on('joined', function(data) {
      // this.isConnected = true
      // this.$log.debug('game joined', data);

      // если ты - создатель игры
      if ( this.game.your.name.length ) {
        this.game.enemy.name = data.user.name;
        this.game.enemy.id = data.user.id;
      } else {
        // иначе - ты подключился к игре
        this.game.your.name = data.user.name;
        this.game.your.id = data.user.id;

        this.game.enemy.name = data.enemy.name;
        this.game.enemy.id = data.enemy.id;

        this.game.id = data.game_id;
      }

      this.game.status = 10;
      this.game.state = 'preparing';
    }.bind(this));

    // PreparingScreen
    socket.on('game-started', function(data) {
      // кто следующий ходит
      if ( data.next_player_id == this.game.your.id ) {
        this.game.isYourTurn = true;
      } else {
        this.game.isYourTurn = false;
      }

      this.game.state = 'game';
      this.game.status = 30;
    }.bind(this));

    // GameScreen
    socket.on('fired', function(data) {
      /*
      {
        game_id: <int>,
        enemy_id: <int>, // на чье поле ведется атака
        next_player_id: <int>, // указывает на пользователя, который ходит следующий
        coord: {
          x: <int 0..9>,
          y: <int 0..9>
        },
        is_hit: <True|False> // попал ли игрок в ячейку или нет
        is_ship: <True|False> // убит ли целый корабль
      }
      */
      // this.$log.debug('fired: ', data);

      if ( data.enemy_id === this.game.your.id ) {
        // --- если атака на ваше поле ---
        this.fireToYourArea(data.coord.x, data.coord.y, data.is_hit, data.is_ship);
      } else {
        // --- атака на чужое поле ---
        this.fireToEnemyArea(data.coord.x, data.coord.y, data.is_hit, data.is_ship);
      }

      // передача хода если нужно
      this.game.isYourTurn = (data.next_player_id === this.game.your.id);

    }.bind(this));

    // FinishGame
    socket.on('game-finished', function(data) {

      this.$log.debug('game-finished', data);

      this.game.finish.winnerId = data.winner_id;
      if (data.users[0].user_id === this.game.enemy.id) {
        // противник на 0м месте - вы на 1м
        this.game.finish.enemyShips = data.users[0].ships;

        this.game.finish.stat.hits = data.users[1].hits;
        this.game.finish.stat.fires = data.users[1].fires;
      } else {
        // противник на 1м месте - вы на 0м
        this.game.finish.enemyShips = data.users[1].ships;

        this.game.finish.stat.hits = data.users[0].hits;
        this.game.finish.stat.fires = data.users[0].fires;
      }

      this.game.state = 'finish';



    }.bind(this));

    // DisconnectScreen
    socket.on('game-extra-finished', function(data) {

      /*
      {
      game_id: <int>,
      winner_id: <int> // победитель,
      user:
      {
             user_id: <int>,
             hits: <int>,     - число попадений
             fires: <int>,    - общее число атак
             ships: [
             {
            'alive': <bool>,
            'coords': [
            {
                 'x': <int>,
                 'y': <int>,
                 'alive': <bool>
            }, ...
                    ] //list of coords
             }, ...
             ] //list of ships
      }
      enemy_ships: [
             {
            'alive': <bool>,
            'coords': [
            {
                 'x': <int>,
                 'y': <int>,
                 'alive': <bool>
            }, ...
                    ] //list of coords
             }, ...
             ] //list of ships
    }
      */

      this.$log.debug('game-extra-finished');

      this.game.finish.winnerId = data.winner_id;

      this.game.finish.enemyShips = data.enemy_ships;



      this.game.finish.stat.hits = data.user.hits;
      this.game.finish.stat.fires = data.user.fires;

      this.game.state = 'disconnect';



    }.bind(this));

    // ping-pong
    socket.on('pinger', function(data) {
      socket.emit('ponger', {
        game_id: this.game.id,
        user_id: this.game.your.id,
        enemy_id: this.game.enemy.id
      });
    }.bind(this));

    // quick build on `ctrl + g`
    let self = this;
    window.addEventListener('keydown', function(event) {
       // только на определенном экране
      if (self.game.state === 'preparing') {
        let isCtrl;
        if(event.ctrlKey) isCtrl=true;
        if (event.which === 71 && isCtrl) {
          // event.preventDefault();
          // self.spacePressed();
          self.buildShip();
        }
      }
    });


    // key('⌘+shift+a, ctrl+shift+a', function(){ alert('(⌘ or ctrl)+shift+a!') });


  },
  components: {
    ConnectScreen, JoinScreen, PreparingScreen, GameScreen, FinishScreen,
    HeaderDev, Error, DisconnectScreen
  }
}


</script>

<style lang="scss">

@import "./assets/bootstrap-grid.css";

@font-face {
  font-family: 'Chicago';
  src: url('./assets/Chicago/ChicagoFLF.eot'); /* IE9 Compat Modes */
  src: url('./assets/Chicago/ChicagoFLF.woff') format('woff'), /* Pretty Modern Browsers */
  url('./assets/Chicago/ChicagoFLF.ttf')  format('truetype'); /* Safari, Android, iOS */
}

@import "vars";
@import "buttons";

* {
  margin: 0;
  padding: 0;
  outline: none;
}
html {
  font-size: 16px;
}
body {
  opacity: 0;
  overflow-x: hidden;
}


body {
  opacity: 1;
  overflow-x: hidden;

  background-image: url('./assets/back.jpg');
  background-repeat: repeat;
  background-size: 5px;

  min-height: 100vh;

  min-width: 300px;
  font-size: 1rem;
  line-height: 1.5rem;

  font-family: $default-font;
}

textarea,
input[type="text"],
input[type="number"],
input[type="button"],
input[type="submit"] {
  -webkit-appearance: none;
  border-radius: 0;
}

input {
  border: 1px solid $color-black;
  background-color: $color-white;

  box-shadow: $box-shadow;

  padding: 6px 15px 3px 15px;

  font-size: 1.1rem;

  margin: 10px;

  max-width: 100%;

  &.error {
    box-shadow: $box-shadow-error;
    border-color: $color-red;
  }
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $color-black;

  // background-color: $color-white;
  // box-shadow: $box-shadow;
}


.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
