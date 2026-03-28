<template>
  <view class="modal-container" v-if="visible" @click="handleMaskClick">
    <view class="modal-mask"></view>
    <view class="modal-content" @click.stop>
      <view class="modal-header" v-if="title">
        <text class="modal-title">{{ title }}</text>
      </view>
      <view class="modal-body">
        <text class="modal-message">{{ content }}</text>
      </view>
      <view class="modal-footer" :class="{ 'single-btn': !showCancel }">
        <button 
          v-if="showCancel" 
          class="modal-btn cancel" 
          @click="handleCancel"
          :style="cancelStyle"
        >
          {{ cancelText }}
        </button>
        <button 
          class="modal-btn confirm" 
          @click="handleConfirm"
          :style="confirmStyle"
        >
          {{ confirmText }}
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomModal',
  data() {
    return {
      visible: false,
      title: '',
      content: '',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      cancelColor: '',
      confirmColor: '',
      resolve: null,
      reject: null
    }
  },
  computed: {
    cancelStyle() {
      return this.cancelColor ? { color: this.cancelColor } : {}
    },
    confirmStyle() {
      return this.confirmColor ? { color: this.confirmColor } : {}
    }
  },
  methods: {
    show(options = {}) {
      this.title = options.title || ''
      this.content = options.content || ''
      this.showCancel = options.showCancel !== false
      this.cancelText = options.cancelText || '取消'
      this.confirmText = options.confirmText || '确定'
      this.cancelColor = options.cancelColor || ''
      this.confirmColor = options.confirmColor || ''
      this.visible = true
      
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    hide() {
      this.visible = false
      this.resolve = null
      this.reject = null
    },
    handleMaskClick() {
      if (this.showCancel) {
        this.handleCancel()
      }
    },
    handleCancel() {
      this.visible = false
      if (this.resolve) {
        this.resolve({ confirm: false, cancel: true })
      }
    },
    handleConfirm() {
      this.visible = false
      if (this.resolve) {
        this.resolve({ confirm: true, cancel: false })
      }
    }
  }
}
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  width: 560rpx;
  background: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  animation: modal-in 0.2s ease-out;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  padding: 40rpx 40rpx 20rpx;
  text-align: center;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
}

.modal-body {
  padding: 20rpx 40rpx 40rpx;
  text-align: center;
}

.modal-message {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  border-top: 1rpx solid #f0f0f0;
}

.modal-footer.single-btn .modal-btn {
  width: 100%;
}

.modal-btn {
  flex: 1;
  height: 96rpx;
  line-height: 96rpx;
  text-align: center;
  font-size: 30rpx;
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  margin: 0;
}

.modal-btn::after {
  border: none;
}

.modal-btn.cancel {
  color: #666666;
  border-right: 1rpx solid #f0f0f0;
}

.modal-btn.confirm {
  color: #007aff;
  font-weight: 500;
}

.modal-btn:active {
  background: #f5f5f5;
}
</style>
