<template lang="html">
  <div class="main">
    <section class="header"></section>
    <div class="content">
      <div class="label-item">
        <span class="label">活动时间：</span>
        <span class="label-text">每天三场</span>
      </div>
      <div class="time-tags">
        <div class="time-item" v-for="(time, i) in times" :key="i">
          {{ time }}
        </div>
      </div>
      <div class="label-item">
        <span class="label">活动奖品：</span>
        <span class="label-text">具体商品种类以活动公布为准</span>
      </div>
      <div class="prize-tags">
        <div class="prize-item" v-for="(item, index) in prizes0" :key="index">
          <div class="prize-icon" :class="{ [item.class]: true }"></div>
          <div class="prize-title">
            {{ item.title }}
          </div>
        </div>
      </div>
      <div class="prize-tags">
        <div class="prize-item" v-for="(item, index) in prizes1" :key="index">
          <div class="prize-icon" :class="{ [item.class]: true }"></div>
          <div class="prize-title">
            {{ item.title }}
          </div>
        </div>
      </div>
      <div class="label-item">
        <span class="label">活动入口：</span>
      </div>
      <div class="miaosha-tags">
        <div class="miaosha-item"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      times: ['10:30-10:50', '14:00-14:20', '21:00-21:20 '],
      prizes0: [
        { title: '小米AI音箱', icon: './images/xiaoai.png', class: 'ai' },
        { title: '小米无线鼠标', icon: './images/shubiao.png', class: 'shubiao' },
        { title: '自动折叠伞', icon: './images/zhediesan.png', class: 'zhediesan' },
        { title: '8H标准乳胶Z1', icon: './images/8h.png', class: 'eh' },
        { title: '米家签字笔', icon: './images/qianzibi.png', class: 'qianzibi' }
      ],
      prizes1: [
        { title: '小米随身手电筒', icon: './images/shoudiantong.png', class: 'shoudiantong' },
        { title: '尼龙偏光太阳镜', icon: './images/taiyangjing.png', class: 'taiyangjing' },
        { title: '米家恒温电水壶', icon: './images/dianshuihu.png', class: 'dianshuihu' },
        { title: '90分旅行箱（20寸）', icon: './images/90fen.png', class: 'nine-fen' },
        { title: '小米运动蓝牙耳机mini', icon: './images/lanyaerji.png', class: 'lanyaerji' }
      ]
    }
  },
  mounted () {
    $('body').addClass('seckill-bg')
  },
  beforeDestroy () {
    $('body').removeClass('seckill-bg')
  }
}
</script>

<style>
body.seckill-bg {
  background-color: #01c3f8;
}
</style>
<style lang="css" scoped>
  @import "./index.css";
</style>
