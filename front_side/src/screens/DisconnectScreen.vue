<template>

  <div class="finish-screen-wrap">
    <div class="finish-screen">
      <div v-if="idWinner == your.id">
        You win because of enemy's disconnection
      </div>
      <div v-else>
        Your lose because of enemy's disconnection
      </div>

      <div class="stat">
        <div class="stat-item">
          <div class="label">You lose:</div>
          <div class="value">{{ yourCountKilledShips }} ships</div>
        </div>
        <div class="stat-item">
          <div class="label">Count hits:</div>
          <div class="value">{{ serverStat.hits }}</div>
        </div>
        <div class="stat-item">
          <div class="label">Count fires:</div>
          <div class="value">{{ serverStat.fires }}</div>
        </div>
        <div class="stat-item">
          <div class="label">You kill:</div>
          <div class="value">{{ enemyCountKilledShips }} of {{ rules.countShips }} ships</div>
        </div>
        <div class="stat-item">
          <div class="label">Your efficiency:</div>
          <div class="value">{{ efficiency }}</div>
        </div>
      </div>

    </div>
    <div class="enemy-area-name">Enemy area</div>
    <user-area
      :area="serverEnemyArea"
      :state="1"></user-area>
  </div>

</template>


<script>

  import UserArea from '../UserArea.vue'

  export default {
    name: 'DisconnectScreen',
    data () {
      return {
        efficiency: Math.round((this.serverStat.hits / this.serverStat.fires)*10000)/100
      }
    },
    props: ['your', 'enemy', 'yourArea', 'enemyArea',
      'idWinner', 'allEnemyShips', 'rules', 'serverStat'],
    components: {
      UserArea
    },
    computed: {
      serverEnemyArea() {
        let area = new Array(this.rules.areaHeight);
        for (let i = 0; i < area.length; area[i++] = new Array(this.rules.areaWidth).fill(0));

        // обрабатываем корабль
        for (let ship of this.allEnemyShips) {
          // обрабатываем корабль
          for (let coord of ship.coords) {
            if (coord.alive) {
              area[coord.y][coord.x] = 1;
            } else {
              area[coord.y][coord.x] = 3;
            }

          }

        }

        // missed поля
        for ( let miss of this.enemy.missed ) {
          area[miss.y][miss.x] = 2;
        }

        return area;
      },
      yourCountKilledShips() {
        let count = 0;
        for (let ship of this.your.ships) {
          if (ship.is_kill) {
            count++;
          }
        }
        return count;
      },
      enemyCountKilledShips() {
        let count = 0;
        for (let ship of this.enemy.ships) {
          if (ship.is_kill) {
            count++;
          }
        }
        return count;
      }
    }
  }

</script>


<style lang="scss" scoped>

  @import '../vars';

  .finish-screen {
    background-color: $color-white;
    border: 1px solid $color-black;
    box-shadow: $box-shadow;

    padding: 20px 30px;

    font-size: 1.5rem;
    margin-top: 20px;
  }

  .stat {
    .stat-item {
      font-size: 0;
      margin-top: 5px;
      .label {
        font-size: 1rem;
        display: inline-block;
        width: 50%;
        text-align: right;
        padding-right: 10px;
      }
      .value {
        font-size: 1rem;
        display: inline-block;
        width: 50%;
        text-align: left;
        padding-left: 10px;
      }
    }
  }

  .enemy-area-name {
    background-color: $color-white;
    border: 1px solid $color-black;
    box-shadow: $box-shadow;

    padding: 10px 20px;

    display: inline-block;
    font-size: 1.5rem;
    margin: 20px auto;
  }

</style>
