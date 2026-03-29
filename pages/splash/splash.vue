<template>
  <view class="splash-page">
    <view class="sheep">
      <!-- 羊毛 -->
      <view class="wool wool-1"></view>
      <view class="wool wool-2"></view>
      <view class="wool wool-3"></view>
      <view class="wool wool-4"></view>
      <view class="wool wool-5"></view>
      <view class="wool wool-6"></view>
      <view class="wool wool-7"></view>
      <!-- 脸 -->
      <view class="face">
        <view class="eye eye-left">
          <view class="pupil"></view>
          <view class="highlight"></view>
        </view>
        <view class="eye eye-right open">
          <view class="pupil"></view>
          <view class="highlight"></view>
        </view>
        <view class="eye eye-right closed"></view>
        <view class="cheek cheek-left"></view>
        <view class="cheek cheek-right"></view>
        <view class="nose"></view>
        <view class="mouth"></view>
      </view>
      <!-- 羊角 -->
      <view class="horn horn-left"></view>
      <view class="horn horn-right"></view>
    </view>
    <text class="app-name">赛博摸金</text>
    <text class="app-slogan">数字寻宝 · 价值发现</text>
    <text class="version">v{{ version }}</text>
  </view>
</template>

<script>
import { getLatestVersion } from '@/api/version.js'

export default {
  name: 'SplashPage',
  data() {
    return {
      version: '1.0.0',
      canNavigate: false,
      minShowTime: null
    }
  },
  async onLoad() {
    await this.loadVersion()
  },
  onReady() {
    // 页面准备就绪后，确保至少显示2秒splash，然后跳转
    this.minShowTime = setTimeout(() => {
      this.canNavigate = true
      this.tryNavigate()
    }, 2000)
  },
  onUnload() {
    if (this.minShowTime) {
      clearTimeout(this.minShowTime)
    }
  },
  methods: {
    async loadVersion() {
      try {
        const platform = uni.getSystemInfoSync().platform.toLowerCase()
        const res = await getLatestVersion({
          platform: platform === 'android' ? 'android' : 'ios'
        })
        if (res.code === 200 && res.data) {
          this.version = res.data.versionName || '1.0.0'
        }
      } catch (e) {
        console.log('获取版本失败', e)
      }
    },
    tryNavigate() {
      // 显示至少2秒后跳转
      if (this.canNavigate) {
        uni.redirectTo({ url: '/pages/index/index' })
      }
    }
  }
}
</script>

<style scoped>
.splash-page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #f8e8ea 0%, #f0d0d8 30%, #e8b8c8 70%, #d8a0b0 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.splash-page::before {
  content: '';
  position: absolute;
  width: 400rpx;
  height: 400rpx;
  background: rgba(255, 220, 230, 0.4);
  border-radius: 50%;
  filter: blur(60px);
  top: 10%;
  right: -100rpx;
  pointer-events: none;
}

.sheep {
  width: 280rpx;
  height: 280rpx;
  position: relative;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20rpx); }
}

/* 羊毛 - 用圆形堆叠 */
.wool {
  position: absolute;
  background: #fff5f0;
  border-radius: 50%;
}

.wool-1 { width: 220rpx; height: 220rpx; left: 30rpx; top: 50rpx; }
.wool-2 { width: 110rpx; height: 110rpx; left: 0; top: 40rpx; }
.wool-3 { width: 110rpx; height: 110rpx; right: 0; top: 40rpx; }
.wool-4 { width: 85rpx; height: 85rpx; left: 0; top: 95rpx; }
.wool-5 { width: 85rpx; height: 85rpx; right: 0; top: 95rpx; }
.wool-6 { width: 85rpx; height: 85rpx; left: 40rpx; top: 15rpx; }
.wool-7 { width: 85rpx; height: 85rpx; right: 40rpx; top: 15rpx; }

/* 脸 */
.face {
  position: absolute;
  width: 140rpx;
  height: 155rpx;
  background: #fff8f5;
  border-radius: 50%;
  left: 70rpx;
  top: 95rpx;
  z-index: 2;
}

/* 眼睛基础 */
.eye {
  position: absolute;
  width: 32rpx;
  height: 38rpx;
  background: #8b3850;
  border-radius: 50%;
  top: 50rpx;
}

.eye-left { left: 28rpx; }
.eye-right { right: 28rpx; }

/* 眼珠和高光 */
.pupil {
  position: absolute;
  width: 14rpx;
  height: 16rpx;
  background: #fff;
  border-radius: 50%;
  top: 6rpx;
  left: 5rpx;
}

.highlight {
  position: absolute;
  width: 8rpx;
  height: 8rpx;
  background: #fff;
  border-radius: 50%;
  top: 10rpx;
  right: 8rpx;
}

/* 眨眼动画 */
.eye-right.open {
  animation: blink-open 3s ease-in-out infinite;
}

.eye-right.closed {
  background: transparent;
  border: none;
  height: 8rpx;
  top: 65rpx;
  border-top: 8rpx solid #8b3850;
  border-radius: 0;
  animation: blink-closed 3s ease-in-out infinite;
}

.eye-right.closed .pupil,
.eye-right.closed .highlight {
  display: none;
}

@keyframes blink-open {
  0%, 40%, 60%, 100% { opacity: 1; }
  45%, 55% { opacity: 0; }
}

@keyframes blink-closed {
  0%, 40%, 60%, 100% { opacity: 0; }
  45%, 55% { opacity: 1; }
}

/* 腮红 */
.cheek {
  position: absolute;
  width: 38rpx;
  height: 22rpx;
  background: #e8b8a0;
  border-radius: 50%;
  top: 85rpx;
  opacity: 0.6;
}

.cheek-left { left: 14rpx; }
.cheek-right { right: 14rpx; }

/* 鼻子 */
.nose {
  position: absolute;
  width: 28rpx;
  height: 20rpx;
  background: #d4a090;
  border-radius: 50%;
  left: 50%;
  transform: translateX(-50%);
  top: 92rpx;
}

/* 嘴巴 */
.mouth {
  position: absolute;
  width: 55rpx;
  height: 28rpx;
  left: 50%;
  transform: translateX(-50%);
  top: 115rpx;
  border: 6rpx solid #d4a090;
  border-top: none;
  border-radius: 0 0 55rpx 55rpx;
  background: #ffb0b0;
}

/* 羊角 */
.horn {
  position: absolute;
  width: 42rpx;
  height: 85rpx;
  border: 10rpx solid #e8c0a8;
  border-radius: 50%;
  top: 0;
}

.horn-left {
  left: 28rpx;
  border-right: none;
  transform: rotate(-30deg);
}

.horn-right {
  right: 28rpx;
  border-left: none;
  transform: rotate(30deg);
}

/* 文字 */
.app-name {
  font-size: 64rpx;
  font-weight: 800;
  color: #8b3850;
  margin-top: 80rpx;
  letter-spacing: 0.1em;
  position: relative;
  z-index: 1;
}

.app-slogan {
  font-size: 28rpx;
  color: #a86078;
  margin-top: 20rpx;
  position: relative;
  z-index: 1;
}

.version {
  position: absolute;
  bottom: 80rpx;
  font-size: 24rpx;
  color: #c08090;
}
</style>