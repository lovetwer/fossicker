<template>
  <view class="custom-tabbar">
    <view class="tabbar-bg">
      <view class="tabbar-left">
        <view class="tab-item" :class="{ active: current === 0 }" @click="switchTab(0)">
          <image 
            class="tab-icon-img" 
            :src="current === 0 ? '/static/tab-home-active.png' : '/static/tab-home.png'"
            mode="aspectFit"
          />
          <text class="tab-text">首页</text>
        </view>
      </view>
      
      <view class="tabbar-center">
        <view class="center-btn" :class="{ active: current === 1, pressing: isPressing }" @click="switchTab(1)" @touchstart="onPressStart" @touchend="onPressEnd">
          <text class="center-icon">+</text>
        </view>
      </view>
      
      <view class="tabbar-right">
        <view class="tab-item" :class="{ active: current === 2 }" @click="switchTab(2)">
          <image 
            class="tab-icon-img" 
            :src="current === 2 ? '/static/tab-mine-active.png' : '/static/tab-mine.png'"
            mode="aspectFit"
          />
          <text class="tab-text">我的</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomTabbar',
  props: {
    current: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isPressing: false
    }
  },
  methods: {
    onPressStart() {
      this.isPressing = true
    },
    onPressEnd() {
      setTimeout(() => {
        this.isPressing = false
      }, 150)
    },
    switchTab(index) {
      if (index === this.current) return
      
      const pages = ['/pages/index/index', '/pages/publish/publish', '/pages/mine/mine']
      
      // 发布页使用 navigateTo，其他页面使用 redirectTo 避免页面栈过深
      if (index === 1) {
        // 发布页
        uni.navigateTo({
          url: pages[index]
        })
      } else {
        // 首页和我的页面
        uni.redirectTo({
          url: pages[index]
        })
      }
    }
  }
}
</script>

<style scoped>
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  z-index: 999;
}

.tabbar-bg {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100rpx;
  background: #fff;

  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
  padding: 0 60rpx;
  position: relative;
}

.tabbar-left,
.tabbar-right {
  flex: 1;
  display: flex;
  justify-content: center;
}

.tabbar-center {
  position: relative;
  width: 140rpx;
  height: 140rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -50rpx;
}

.center-btn {
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(145deg, #ffb3c9 0%, #ff8fab 25%, #ff6b9d 60%, #c93a5a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(201, 58, 90, 0.4);
  border: 6rpx solid #fff;
  position: relative;
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.center-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 40%, transparent 60%);
  border-radius: 50%;
}

.center-icon {
  font-size: 60rpx;
  color: #fff;
  font-weight: 300;
  transition: transform 0.1s ease;
}

.center-btn.pressing .center-icon {
  transform: translateY(2rpx);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10rpx 40rpx;
}

.tab-icon-img {
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 6rpx;
}

.tab-text {
  font-size: 22rpx;
  color: #8A94A6;
}

.tab-item.active .tab-text {
  color: #c93a5a;
}

.center-btn.active {
  background: linear-gradient(135deg, #a82e4a 0%, #c93a5a 100%);
}

.center-btn.pressing {
  transform: scale(0.88);
  box-shadow: 0 4rpx 12rpx rgba(201, 58, 90, 0.3);
}
</style>
