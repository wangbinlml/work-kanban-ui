<template>
  <span>{{ content }}</span>
</template>

<script>
export default {
  data() {
    return {
      content: '',
    }
  },
  props: {
    date: {
      type: String,
      default: new Date().toString()
    },
    time: {
      type: Number,
      default: 0,
      dateTimeStamp: ''
    }
  },
  mounted() {
    this.diffTime()
  },
  methods: {
    diffTime() {
      this.dateTimeStamp = this.time
      if (!this.dateTimeStamp) {
        if (!this.date) {
          return '刚刚'
        }
        this.dateTimeStamp = new Date(this.date).getTime()
      }
      let minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
      let hour = minute * 60;
      let day = hour * 24;
      let week = day * 7;
      let month = day * 30;
      let year = month * 12;
      let now = new Date().getTime();   //获取当前时间毫秒
      let diffValue = now - this.dateTimeStamp;//时间差
      if (diffValue < 0) {
        this.content = "" + "未来";
      }
      let minC = diffValue / minute;  //计算时间差的分，时，天，周，月
      let hourC = diffValue / hour;
      let dayC = diffValue / day;
      let weekC = diffValue / week;
      let monthC = diffValue / month;
      let yearC = diffValue / year;

      if (yearC >= 1) {
        this.content = " " + parseInt(yearC) + "年前"
      } else if (monthC >= 1 && monthC < 12) {
        this.content = " " + parseInt(monthC) + "月前"
      } else if (weekC >= 1 && weekC < 5 && dayC > 6 && monthC < 1) {
        this.content = " " + parseInt(weekC) + "周前"
      } else if (dayC >= 1 && dayC <= 6) {
        this.content = " " + parseInt(dayC) + "天前"
      } else if (hourC >= 1 && hourC <= 23) {
        this.content = " " + parseInt(hourC) + "小时前"
      } else if (minC >= 1 && minC <= 59) {
        this.content = " " + parseInt(minC) + "分钟前"
      } else if (diffValue >= 0 && diffValue <= minute) {
        this.content = "刚刚"
      }
    }
  }
}
</script>

<style>

</style>

