import {ErrorBus} from "./error-module/error-bus";

export default {
  checkBuildShip: function(selected, yourArea, yourStat, rules) {

    //проверяем кол-во палуб
    let curCount = selected.length;
    if ( curCount > 4 || curCount <= 0 ) {
      // this.$log.debug("Такого кол-ва палуб нет - ", curCount);
      ErrorBus.$emit('error', 11);
      return false;
    }

    // проверяем можно ли строить корабли данного типа или уже все такое построены?
    if ( yourStat['leftShip' + curCount] === rules['ship_' + curCount] ) {
      // this.$log.debug("Вы уже поставили все корабли данного типа");
      ErrorBus.$emit('error', 12);
      return false;
    }

    //горизонтальный/вертикальный
    let type = 'horiz'; // or 'vert'
    if (selected.length > 1) {
      // если выделено несколько полей
      let select1 = selected[0];
      let select2 = selected[1];

      if (select1.x === select2.x) {
        type = 'vert';
      } else if (select1.y === select2.y) {
        type = 'horiz';
      }
    }

    // в одну линии или нет?
    if (selected.length > 1) {
      // если несколько палуб
      if (type === 'horiz') {
        let y = selected[0].y;
        for (let select of selected) {
          if (select.y !== y) {
            ErrorBus.$emit('error', {
              code: 0,
              message: 'Выбранные поля не на одной линии'
            });
            return false;;
          }
        }
      } else if (type === 'vert') {
        let x = selected[0].x;
        for (let select of selected) {
          if (select.x !== x) {
            ErrorBus.$emit('error', {
              code: 0,
              message: 'Выбранные поля не на одной линии'
            });
            return false;;
          }
        }
      }
    }

    // все палубы рядом?
    if (selected.length > 1) {
      // если несколько палуб
      let curArray;
      if (type === 'horiz') {
        curArray = selected.map(function(item) {
          return item.x;
        });
      } else if (type === 'vert') {
        curArray = selected.map(function(item) {
          return item.y;
        });
      }
      curArray = curArray.sort();

      let prev = curArray[0];
      for (let i = 1; i < curArray.length; i++) {
        if (curArray[i]-1 !== prev) {
          ErrorBus.$emit('error', {
            code: 0,
            message: 'Палубы корабля не рядом'
          });
          return false;;
        }
        prev = curArray[i];
      }
    }

    // стоит ли на этих местах корабль?
    for ( let coord of selected ) {
      if ( yourArea[coord.y][coord.x] === 1  ) {
        // Там уже стоит корабль
        ErrorBus.$emit('error', 13);
        return false;
      }
    }

    // есть ли вокруг корабли(в окружности одной клетки)
    let left = 10, right = -1, top = 10, bottom = -1;
    for (let select of selected) {
      if (select.x > right) {
        right = select.x;
      }
      if (select.x < left) {
        left = select.x;
      }

      if (select.y > bottom) {
        bottom = select.y;
      }
      if (select.y < top) {
        top = select.y;
      }
    }
    left = left - 1 < 0 ? 0 : left - 1 ;
    right = right + 1 > 9 ? 9 : right + 1 ;
    bottom = bottom + 1 > 9 ? 9 : bottom + 1 ;
    top = top - 1 < 0 ? 0 : top - 1 ;

    for (let i = left; i <= right; i++) {
      for (let j = top; j <= bottom; j++) {
        if (yourArea[j][i] === 1) {
          ErrorBus.$emit('error', {
            code: 0,
            message: 'В окружности уже есть корабль'
          });
          return false;;
        }
      }
    }

    return true;
  },

  findShipsAround(x, y, ships) {
    let shipsAround = [];
    for (let ship of ships) {
      for (let coord of ship.coords) {
        if ( Math.abs(x - coord.x) <= 1 && Math.abs(y - coord.y) <= 1 ) {
          shipsAround.push({
            x: coord.x,
            y: coord.y
          });
        }
      }
    }

    return shipsAround;
  }
}
