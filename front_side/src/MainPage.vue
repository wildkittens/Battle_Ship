<template>

  <div id="main-page">
    {{ myMsg }}
  </div>

</template>


<script>

  export default {
    name: 'mainpage2',
    data () {
      return {
        myMsg: 'MainPage'

      }
    }
  }

</script>


<style lang="scss" scoped>

  #main-page {
    background-color: #f00;
  }

</style>
