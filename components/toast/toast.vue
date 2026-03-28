<template>
  <view class="toast-container" v-if="visible" @click="hide">
    <view class="toast-mask"></view>
    <view class="toast-content" :class="type">
      <view class="toast-icon" v-if="showIcon">
        <text v-if="type === 'success'">✓</text>
        <text v-else-if="type === 'error'">✗</text>
        <text v-else-if="type === 'loading'" class="loading"></text>
        <text v-else>ℹ</text>
      </view>
      <text class="toast-text">{{ message }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomToast',
  data() {
    return {
      visible: false,
      message: '',
      type: 'none',
      duration: 2000,
      showIcon: true,
      timer: null
    }
  },
  methods: {
    show(options = {}) {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      
      this.message = options.title || options.message || ''
      this.type = options.icon || options.type || 'none'
      this.duration = options.duration || 2000
      this.showIcon = options.showIcon !== false
      this.visible = true
      
      if (this.type !== 'loading') {
        this.timer = setTimeout(() => {
          this.hide()
        }, this.duration)
      }
      
      return this
    },
    hide() {
      this.visible = false
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    },
    success(message, duration) {
      return this.show({ title: message, icon: 'success', duration })
    },
    error(message, duration) {
      return this.show({ title: message, icon: 'error', duration })
    },
    loading(message) {
      return this.show({ title: message, icon: 'loading', duration: 0 })
    },
    info(message, duration) {
      return this.show({ title: message, icon: 'none', duration })
    }
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.toast-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
}
.toast-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx 48rpx;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(201, 58, 90, 0.15);
  backdrop-filter: blur(20rpx);
  transform: scale(1);
  animation: toastIn 0.2s ease-out;
  border: 1rpx solid rgba(201, 58, 90, 0.1);
}
@keyframes toastIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.toast-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
  font-size: 40rpx;
}
.toast-content.success .toast-icon {
  background: linear-gradient(135deg, #c93a5a 0%, #e66584 100%);
  color: #fff;
}
.toast-content.error .toast-icon {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
  color: #fff;
}
.toast-content.loading .toast-icon {
  background: linear-gradient(135deg, #c93a5a 0%, #e66584 100%);
}
.toast-content.none .toast-icon {
  background: linear-gradient(135deg, #c93a5a 0%, #e66584 100%);
  color: #fff;
}
.loading {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.toast-text {
  color: #333;
  font-size: 28rpx;
  text-align: center;
  line-height: 1.5;
  max-width: 400rpx;
}
</style>
