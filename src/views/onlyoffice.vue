<template>
  <div id="app">
    <div class='qualityManual-container'>
      <div class='qualityManual-container-office'>
        <only-office :option="option"/>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'VaOnlyOffice',
  components: {},
  data() {
    return {
      //参考vabOnlyOffice组件参数配置
      option: {
        url: "http://kdiibr.natappfree.cc/client/onlyoffice/doc/download",
        editUrl: "http://kdiibr.natappfree.cc/client/onlyoffice/doc/save",
        isEdit: true,
        fileType: 'xlsx',
        title: '121',
        lang: 'zh-CN',
        isPrint: true,
        user: {id: 12, name: '张三'}
      }
    }
  },
  created() {
  },
  methods: {},
}
</script>

<style>
html, body {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;

}

.qualityManual-container {
  padding: 0 !important;
  height: 100%;
}

.qualityManual-container-office {
  width: 100%;
  height: calc(100% - 55px);
}
</style>

