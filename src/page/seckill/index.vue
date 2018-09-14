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
        { title: '小米AI音箱', icon: 'http://t3.market.xiaomi.com/download/AppStore/0738d47b85acbc89dd23f4dd29d0b49a6f2418d5c/a.jpg', class: 'ai' },
        { title: '小米无线鼠标', icon: 'http://t2.market.xiaomi.com/download/AppStore/00ea6c4ef195e45591c86ba0181ad05e310962bb9/a.jpg', class: 'shubiao' },
        { title: '自动折叠伞', icon: 'http://t5.market.xiaomi.com/download/AppStore/00f9d491c7b910b2f55d57aae7fe154894d4067c1/a.jpg', class: 'zhediesan' },
        { title: '8H标准乳胶Z1', icon: 'http://t2.market.xiaomi.com/download/AppStore/0295e0423e2694bf80717f699cb7c9488985c49e1/a.jpg', class: 'eh' },
        { title: '米家签字笔', icon: 'http://t4.market.mi-img.com/download/AppStore/00f9d491c7b910b2f55d55aaecfe1e4896d4067c1/a.jpg', class: 'qianzibi' }
      ],
      prizes1: [
        { title: '小米随身手电筒', icon: 'http://t4.market.xiaomi.com/download/AppStore/0e29b47d56b78889dd622e58ebd6b30ece540954e/a.jpg', class: 'shoudiantong' },
        { title: '小米随身手电筒', icon: 'http://t4.market.mi-img.com/download/AppStore/0e29b47d56b78889dd622e58ebd6b30ece540954e/a.jpg', class: 'shoudiantong' },

        { title: '尼龙偏光太阳镜', icon: 'http://t3.market.mi-img.com/download/AppStore/07c75485062248282f7e71f8c3560fa981d41a903/a.jpg', class: 'taiyangjing' },
        { title: '米家恒温电水壶', icon: 'http://t5.market.xiaomi.com/download/AppStore/0c6eed4787c644b583875f59e3777d433dd27ce57/a.jpg', class: 'dianshuihu' },
        { title: '90分旅行箱（20寸）', icon: 'http://t5.market.xiaomi.com/download/AppStore/0195e492362898bf5f717a699547cd4984e40ec90/a.jpg', class: 'nine-fen' },
        { title: '小米运动蓝牙耳机mini', icon: 'http://t5.market.xiaomi.com/download/AppStore/0177043446b8f9a12cebceb659db7c0c17142fce3/a.jpg', class: 'lanyaerji' }
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
