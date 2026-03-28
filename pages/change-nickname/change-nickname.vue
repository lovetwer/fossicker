<template>
  <view class="change-page">
    <view class="form-section card">
      <view class="form-item">
        <text class="form-label">新昵称</text>
        <input
          v-model="nickname"
          placeholder="请输入新昵称"
          class="form-input"
          maxlength="20"
        />
      </view>
      <view class="form-tip">昵称仅支持英文、数字，2-20个字符</view>
    </view>

    <view class="submit-section">
      <button class="submit-btn" @click="handleChangeNickname" :disabled="submitting">
        {{ submitting ? '修改中...' : '确认修改' }}
      </button>
    </view>
    
    <!-- 自定义 Toast -->
    <toast ref="toast"></toast>
  </view>
</template>

<script>
import { updateUserInfo } from '@/api/user.js'
import Toast from '@/components/toast/toast.vue'
import toastMixin from '@/mixins/toast.js'

export default {
  components: { Toast },
  mixins: [toastMixin],
  data() {
    return {
      nickname: '',
      submitting: false
    }
  },
  onLoad() {
    const currentUser = uni.getStorageSync('currentUser')
    if (currentUser && currentUser.nickname) {
      this.nickname = currentUser.nickname
    }
  },
  methods: {
    validateNickname(name) {
      const regex = /^[a-zA-Z0-9]{2,20}$/
      return regex.test(name)
    },
    async handleChangeNickname() {
      if (!this.nickname.trim()) {
        this.$toastInfo('请输入昵称')
        return
      }
      if (!this.validateNickname(this.nickname)) {
        this.$toastInfo('昵称仅支持英文和数字，2-20位')
        return
      }

      this.submitting = true
      try {
        const res = await updateUserInfo({ nickname: this.nickname })

        if (res.code === 200) {
          const users = uni.getStorageSync('users') || []
          const token = uni.getStorageSync('token')
          const userIndex = users.findIndex(u => u.token === token)
          if (userIndex !== -1) {
            users[userIndex].nickname = this.nickname
            uni.setStorageSync('users', users)
          }
          const currentUser = uni.getStorageSync('currentUser')
          if (currentUser) {
            currentUser.nickname = this.nickname
            uni.setStorageSync('currentUser', currentUser)
          }
          this.$toastSuccess('昵称修改成功')
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        } else {
          this.$toastError(res.message || '修改失败')
        }
      } catch (e) {
        this.$toastError('修改失败')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.change-page {
  min-height: 100vh;
  padding: 24rpx;
  background: #f5f5f5;
}

.form-section {
  padding: 24rpx;
}

.form-item {
  margin-bottom: 20rpx;
}

.form-label {
  display: block;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.form-input {
  height: 88rpx;
  padding: 0 24rpx;
  background: #f8f8f8;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.form-tip {
  font-size: 24rpx;
  color: #999;
  margin-top: 12rpx;
}

.submit-section {
  margin-top: 48rpx;
  padding: 0 24rpx;
}

.submit-btn {
  height: 88rpx;
  border-radius: 12rpx;
  background: #c93a5a;
  color: #fff;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn[disabled] {
  opacity: 0.7;
}
</style>
