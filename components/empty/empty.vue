<template>
  <view class="empty-container">
    <text class="empty-text">{{ text }}</text>
    <text class="empty-subtext" v-if="subText">{{ subText }}</text>
  </view>
</template>

<script>
export default {
  name: 'Empty',
  props: {
    text: {
      type: String,
      default: '暂时还没有内容'
    },
    subText: {
      type: String,
      default: ''
    },

  }
}
</script>

<style scoped>
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 48rpx;
  text-align: center;
}

.empty-text {
  font-size: 32rpx;
  color: #2f3948;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.empty-subtext {
  font-size: 26rpx;
  color: #8a94a6;
  line-height: 1.7;
}
</style>








