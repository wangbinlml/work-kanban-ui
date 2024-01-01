<template>
  <div id="app" :style="appStyle">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data(){
      return {
        appStyle:{
          //backgroundColor: '#1E28ED',
          //width: 'max-content'
        },
      }
    },
    metaInfo() {
      return {
        title: this.$store.state.settings.title,
        titleTemplate: title => {
          return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
#app {
  height: 100%;
  /*background-image: url("./assets/images/bg.svg");
  background-repeat: repeat;
  background-position: center;
  background-size: 100%;*/
  background: linear-gradient(135deg,#003459,#00a8e8 90%)!important;
  display: flex;
  flex-direction: column;
}
</style>
