<template>
  <view class="feedback-page">
    <view class="form-card">
      <view class="form-item">
        <text class="label">反馈类型</text>
        <view class="type-options">
          <view
            v-for="item in typeOptions"
            :key="item.value"
            class="type-item"
            :class="{ active: form.type === item.value }"
            @click="form.type = item.value"
          >
            {{ item.label }}
          </view>
        </view>
      </view>

      <view class="form-item">
        <text class="label">反馈内容</text>
        <textarea
          v-model="form.content"
          class="content-input"
          placeholder="请详细描述您的问题或建议，我们会尽快处理..."
          maxlength="500"
        />
        <text class="word-count">{{ form.content.length }}/500</text>
      </view>

      <view class="form-item">
        <text class="label">联系方式（选填）</text>
        <input
          v-model="form.contact"
          class="contact-input"
          placeholder="手机号或邮箱，方便我们联系您"
        />
      </view>

      <view class="form-item">
        <text class="label">相关截图（选填）</text>
        <view class="image-list">
          <view
            v-for="(img, index) in imageList"
            :key="index"
            class="image-item"
          >
            <image :src="img" mode="aspectFill" />
            <text class="delete-btn" @click="removeImage(index)">×</text>
          </view>
          <view v-if="imageList.length < 3" class="upload-btn" @click="chooseImage">
            <text class="plus">+</text>
            <text class="tip">上传图片</text>
          </view>
        </view>
        <text class="image-tip">最多上传3张图片</text>
      </view>
    </view>

    <button
      class="submit-btn"
      :class="{ disabled: !canSubmit }"
      :disabled="!canSubmit || submitting"
      @click="handleSubmit"
    >
      {{ submitting ? '提交中...' : '提交反馈' }}
    </button>

    <view class="history-link" @click="goMyFeedback">
      <text>查看我的反馈记录</text>
      <text class="arrow">›</text>
    </view>

    <!-- 自定义 Toast -->
    <toast ref="toast"></toast>
  </view>
</template>

<script>
import { submitFeedback } from '@/api/feedback.js'
import { uploadImage } from '@/api/upload.js'
import { sendNotification } from '@/api/user.js'
import Toast from '@/components/toast/toast.vue'
import toastMixin from '@/mixins/toast.js'

export default {
  components: { Toast },
  mixins: [toastMixin],
  data() {
    return {
      form: {
        type: 'suggestion',
        content: '',
        contact: ''
      },
      imageList: [],
      submitting: false,
      typeOptions: [
        { label: '功能建议', value: 'suggestion' },
        { label: '问题反馈', value: 'bug' },
        { label: '其他', value: 'other' }
      ]
    }
  },
  computed: {
    canSubmit() {
      return this.form.content.trim().length > 0
    }
  },
  methods: {
    chooseImage() {
      uni.chooseImage({
        count: 3 - this.imageList.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: async res => {
          uni.showLoading({ title: '上传中...' })
          try {
            const uploadPromises = res.tempFilePaths.map(path => uploadImage(path))
            const results = await Promise.all(uploadPromises)
            const imageUrls = results.map(r => {
              if (r.code === 200 && r.data) {
                return r.data
              }
              return null
            }).filter(url => url)
            this.imageList = [...this.imageList, ...imageUrls]
          } catch (e) {
            this.$toastError('上传失败')
          } finally {
            uni.hideLoading()
          }
        }
      })
    },
    removeImage(index) {
      this.imageList.splice(index, 1)
    },
    async handleSubmit() {
      if (!this.canSubmit) return

      const token = uni.getStorageSync('token')
      if (!token) {
        this.$toastInfo('请先登录')
        uni.navigateTo({ url: '/pages/login/login' })
        return
      }

      this.submitting = true
      try {
        const data = {
          ...this.form,
          images: this.imageList.join(',')
        }
        await submitFeedback(data)
        
        // 给管理员发送通知
        try {
          const typeMap = {
            suggestion: '功能建议',
            bug: '问题反馈',
            other: '其他'
          }
          const typeLabel = typeMap[this.form.type] || '反馈'
          await sendNotification({
            title: `收到新的${typeLabel}`,
            content: this.form.content.trim().substring(0, 100) + (this.form.content.length > 100 ? '...' : '')
          })
        } catch (e) {
          // 发送通知失败
        }
        
        this.$toastSuccess('反馈提交成功')
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } catch (e) {
        this.$toastError('提交失败，请重试')
      } finally {
        this.submitting = false
      }
    },
    goMyFeedback() {
      uni.navigateTo({ url: '/pages/my-feedback/my-feedback' })
    }
  }
}
</script>

<style scoped>
.feedback-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 16rpx;
}

.form-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.label {
  font-size: 28rpx;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16rpx;
  display: block;
}

.type-options {
  display: flex;
  gap: 20rpx;
}

.type-item {
  padding: 12rpx 24rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #666;
}

.type-item.active {
  background: #c93a5a;
  color: #fff;
}

.content-input {
  width: 100%;
  height: 200rpx;
  background: #fafafa;
  border: 1rpx solid #eee;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
  line-height: 1.6;
  box-sizing: border-box;
}

.word-count {
  text-align: right;
  font-size: 24rpx;
  color: #9ca3af;
  margin-top: 8rpx;
  display: block;
}

.contact-input {
  width: 100%;
  height: 80rpx;
  background: #fafafa;
  border: 1rpx solid #eee;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.image-list {
  display: flex;
  gap: 20rpx;
  flex-wrap: wrap;
}

.image-item {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  overflow: hidden;
  position: relative;
}

.image-item image {
  width: 100%;
  height: 100%;
}

.delete-btn {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 40rpx;
  height: 40rpx;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.upload-btn {
  width: 160rpx;
  height: 160rpx;
  border: 1rpx dashed #ccc;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.plus {
  font-size: 48rpx;
  color: #9ca3af;
  line-height: 1;
}

.tip {
  font-size: 24rpx;
  color: #9ca3af;
  margin-top: 8rpx;
}

.image-tip {
  font-size: 24rpx;
  color: #9ca3af;
  margin-top: 16rpx;
  display: block;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  background: #c93a5a;
  color: #fff;
  font-size: 30rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
}

.submit-btn.disabled {
  background: #ddd;
  color: #999;
}

.history-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  font-size: 28rpx;
  color: #6b7280;
}

.arrow {
  font-size: 32rpx;
}
</style>
