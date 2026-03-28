<template>
  <view class="empty-container">
    <view class="empty-orb">{{ icon }}</view>
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
    icon: {
      type: String,
      default: '🪄'
    }
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

.empty-orb {
  width: 148rpx;
  height: 148rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56rpx;
  margin-bottom: 28rpx;
  background: linear-gradient(135deg, rgba(201, 58, 90, 0.07) 0%, rgba(244, 183, 196, 0.14) 100%);
  box-shadow: 0 20rpx 40rpx rgba(201, 58, 90, 0.08);
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








