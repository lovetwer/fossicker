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
        <view class="center-btn-wrapper">
          <view class="animal-bg">
            <view class="animal-ears-out">
              <view class="ae-out left"></view>
              <view class="ae-out right"></view>
            </view>
          </view>
          <view class="center-btn" :class="{ active: current === 1, pressing: isPressing }" @click="switchTab(1)" @touchstart="onPressStart" @touchend="onPressEnd">
            <view class="animal-face-inner">
              <view class="af-eyes">
                <view class="af-eye"></view>
                <view class="af-eye"></view>
              </view>
              <view class="af-mouth"></view>
            </view>
          </view>
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
  align-items: center;
}

.tabbar-center {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-top: -20rpx;
}

.center-btn-wrapper {
  position: relative;
  width: 84rpx;
  height: 84rpx;
}

.animal-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 84rpx;
  height: 84rpx;
  border-radius: 50%;
  background: linear-gradient(145deg, #ffc8d6 0%, #ff8fab 100%);
  box-shadow: 0 4rpx 16rpx rgba(201, 58, 90, 0.3);
  overflow: hidden;
}

.animal-ears-out {
  position: absolute;
  top: 8rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 30rpx;
}

.ae-out {
  position: absolute;
  width: 22rpx;
  height: 28rpx;
  background: #fff;
  border-radius: 50% 50% 40% 40%;
  top: 0;
}

.ae-out.left {
  left: 2rpx;
  transform: rotate(-20deg);
}

.ae-out.right {
  right: 2rpx;
  transform: rotate(20deg);
}

.center-btn {
  position: absolute;
  top: 8rpx;
  left: 8rpx;
  width: 68rpx;
  height: 68rpx;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.animal-face-inner {
  position: relative;
  width: 36rpx;
  height: 30rpx;
  transition: transform 0.1s ease;
}

.center-btn.pressing .animal-face-inner {
  transform: translateY(2rpx);
}

.af-eyes {
  position: absolute;
  top: 10rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10rpx;
}

.af-eye {
  width: 4rpx;
  height: 4rpx;
  background: #333;
  border-radius: 50%;
}

.af-mouth {
  position: absolute;
  bottom: 6rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 8rpx;
  height: 4rpx;
  border: 2rpx solid #333;
  border-top: none;
  border-radius: 0 0 8rpx 8rpx;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10rpx 40rpx;
}

.tab-icon-img {
  width: 40rpx;
  height: 40rpx;
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
