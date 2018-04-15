<template>

  <div class="user-area-wrap">
    <div class="table-wrap">
      <table>
        <tr>
          <td></td>
          <td v-for="letter in letters"><div class="letter">{{ letter.toUpperCase() }}</div></td>
        </tr>
        <tr v-for="(row, index) in area">
          <td><div class="number">{{ index+1 }}</div></td>
          <td v-for="field in row" class="cell-wrap"><div class="cell"></div></td>
        </tr>
      </table>
    </div>
  </div>

</template>


<script>

  export default {
    name: 'EnemyArea',
    data () {
      return {
        myMsg: 'UserArea',
        letters: 'abcdefghijklmnopqrstuvwxyz'.split('').splice(0, this.area[0].length)
      }
    },
    props: ['area']
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
}

</style>
