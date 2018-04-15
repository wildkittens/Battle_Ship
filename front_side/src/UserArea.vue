<template>

  <div class="user-area-wrap">
    <div class="table-wrap">
      <table>
        <tr>
          <td></td>
          <td v-for="letter in letters">
            <div class="letter">{{ letter.toUpperCase() }}</div>
          </td>
        </tr>
        <tr v-for="(row, index) in area">
          <td>
            <div class="number">{{ index+1 }}</div>
          </td>
          <td
            v-for="(field, f_index) in row"
            class="cell-wrap">
            <div class="cell"
                 :class="{ 'ship': field == 1, 'select': field == 4, 'kill': field == 3, 'miss': field == 2 }"
                 @mousedown.prevent="mouseDown(f_index, index)"
                 @mouseup.prevent="mouseUp"
                 @mouseenter="mouseEnter(f_index, index)">
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>

</template>


<script>
  // import { EventBus } from './error-bus.js'

  export default {
    name: 'UserArea',
    data () {
      return {
        isClicked: false,
        letters: 'abcdefghijklmnopqrstuvwxyz'.split('').splice(0, this.area[0].length)
      }
    },
    props: ['area', 'state'],
    methods: {
      mouseDown(x, y) {
        if ( this.state == 2 ) {
          // можно редактировать
          this.isClicked = true;
          this.$emit('select-deselect-field', { x: x, y: y });
        } else if ( this.state == 3 ) {
          // можно бить по этому полю
          this.$emit('game-fire', { x: x, y: y });
        }
      },
      mouseUp() {
        this.isClicked = false;
      },
      mouseEnter(x, y) {
        if ( this.state == 2 && this.isClicked ) {
          this.$log.debug("drag add class");
          this.$emit('select-deselect-field', { x: x, y: y });
        }
      }
    }
  }

</script>


<style lang="scss" scoped>

@import "vars";




.table-wrap {

  display: inline-block;

  font-size: 1.3rem;

  table {
    position: relative;
    top: 1px;
    left: 1px;
    border-collapse: collapse;
    margin: 0;

    background-color: $color-white;
    border: 1px solid $color-black;
    box-shadow: $box-shadow;
  }
}



.cell-wrap {
  border: 1px solid $color-black
}

.number {
  margin-right: 3px;
  margin-left: 1px;
  padding-top: 4px;
  text-align: right;
}

.letter {
  padding-top: 4px;
  // background-color: $color-white;
}

.cell {
  width: 30px;
  height: 30px;
  cursor: pointer;
  background-color: $color-white;

  &:hover {
    background-color: $color-light-gray
  }
  &.ship {
    background-color: $color-black
  }
  &.select {
    background-color: $color-green;
  }
  &.kill {
    background-color: $color-red;
  }
  &.miss{
    position: relative;
    &:before {
      content: '';
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 1px;
      background-color: $color-black;
      left: 50%;
      top: 50%;
      margin-top: -2px;
      margin-left: -2px;
    }
  }
}


</style>
