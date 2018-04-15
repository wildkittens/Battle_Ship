<template>

  <div class="errors">

  <transition-group name="list" >
      <div class="error-wrap list-item"
          v-for="error in errors"
          :key="error.id">
        <span class="error">
          {{ error.message }} <span v-if="error.code != 0">({{ error.code }})</span>
          <button
            class="button-close"
            @click="removeErrorById(error.id)">&times;</button>
        </span>
      </div>
    </transition-group>

  </div>

</template>


<script>

  // event Bus
  import { ErrorBus } from './error-bus.js'
  import errorsJSON from './errors.json'

  export default {
    data() {
      return {
        allErrors: errorsJSON,
        errors: [
          /*{
            code: 1,
            message: 'message'
          }*/
        ]
      }
    },
    methods: {
      removeErrorByCode(code) {

        let errorIndex = this.getErrorIndexByCode(code);

        // если такая ошибка есть
        if (errorIndex > -1) {
          this.errors.splice(errorIndex, 1);
        }

      },
      getErrorIndexByCode(code) {
        for (let i = 0; i < this.errors.length; i++) {
          if (code === this.errors[i].code) {
            return i;
          }
        }
        return -1;
      },
      getErrorJsonByCode(code) {
        for (let i = 0; i < this.allErrors.length; i++) {
          if (code === this.allErrors[i].code) {
            return this.allErrors[i];
          }
        }
        return null;
      },

      // with id
      getErrorIndexById(id) {
        for (let i = 0; i < this.errors.length; i++) {
          if (id === this.errors[i].id) {
            return i;
          }
        }
        return -1;
      },
      removeErrorById(id) {
        let errorIndex = this.getErrorIndexById(id);

        // если такая ошибка есть
        if (errorIndex > -1) {
          this.errors.splice(errorIndex, 1);
        }
      },
      getNewId() {
        if (this.errors.length === 0) {
          return 0;
        }

        return (this.errors[this.errors.length-1].id + 1);
      }
    },
    created() {

      let self = this;
      ErrorBus.$on('error', function(code) {

        let curCode, curMessage, curId = self.getNewId();

        self.$log.debug(typeof code, code);
        if (typeof code === "object") {
          curCode = code.code;
          if ('message' in code) {
            curMessage = code.message;
          } else {
            let curJsonError = self.getErrorJsonByCode(curCode);
            if (curJsonError) {
              curMessage = curJsonError.message;
            } else {
              curMessage = 'Error'
            }
          }

        } else {
          curCode = code;
          let curJsonError = self.getErrorJsonByCode(code);
          if (curJsonError) {
            curMessage = curJsonError.message;
          } else {
            curMessage = 'Error';
          }
        }

        self.errors.push({
          code: curCode,
          message: curMessage,
          id: curId
        });

        setTimeout(function() {
          self.removeErrorById(curId);
        }, 4000);



      });

    }
  }

</script>


<style lang="scss" scoped>

  @import "../vars";

  .errors {
    position: fixed;
    top: 0;
    width: 500px;
    left: 50%;
    margin-left: -250px;
    z-index: 999;

    .error-wrap {

      .error {


        display: inline-block;
        background-color: $color-red;
        padding: 5px 10px;
        border: 1px solid $color-black;
        box-shadow: $box-shadow;
        margin-top: 10px;

        position: relative;
        padding-right: 45px;
        .button-close{
          position: absolute;
          right: 0;
          top: 0;

          width: 34px;
          height: 30px;
          border: none;
          background: none;

          font-family: sans-serif;
          font-size: 1.5rem;

          color: rgba($color-black, .2);
          transition: color .5s ease;
          &:hover {
            color: rgba($color-black, .7);
          }
        }
      }
    }
  }

  .list-item {
    transition: all 1s;
    width: 100%;
  }
  .list-enter, .list-leave-to {
    opacity: 0;
    transform: translateY(-50px);
  }
  .list-leave-active {
    position: absolute;
  }

</style>
