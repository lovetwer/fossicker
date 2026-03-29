<template>
  <view class="privacy-page">
    <view class="header">
      <text class="title">隐私政策</text>
    </view>
    
    <view class="content card">
      <view class="section">
        <text class="section-title">一、引言</text>
        <text class="section-text">
          "赛博摸金"（以下简称"我们"）非常重视用户的隐私保护。本隐私政策说明我们如何收集、使用、存储和保护您的个人信息。
          
          请您在使用本应用前仔细阅读本政策。如您不同意本政策的任何内容，请停止使用本应用。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">二、信息收集</text>
        <text class="section-text">
          我们可能会收集以下信息：
          
          1. 注册信息：用户名、密码、手机号等
          2. 设备信息：设备型号、操作系统版本、唯一设备标识符等
          3. 使用信息：浏览记录、发布内容、操作日志等
          4. 位置信息：经您授权后获取的位置信息
          5. 其他信息：您主动提供的其他信息
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">三、信息使用</text>
        <text class="section-text">
          我们使用您的信息用于：
          
          1. 提供、维护和改进我们的服务
          2. 验证您的身份，防止欺诈
          3. 向您发送服务通知和更新
          4. 进行数据分析和研究，改善用户体验
          5. 遵守法律法规要求
          
          我们不会将您的个人信息出售给第三方。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">四、信息共享</text>
        <text class="section-text">
          我们在以下情况下可能共享您的信息：
          
          1. 经您明确同意
          2. 为提供服务的需要（如第三方服务提供商）
          3. 遵守法律法规或政府部门要求
          4. 保护我们的合法权益
          5. 在合并、收购等情况下转移信息
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">五、信息存储与安全</text>
        <text class="section-text">
          1. 我们采取合理的技术和管理措施保护您的信息安全。
          
          2. 您的信息存储在安全的服务器上。
          
          3. 我们使用加密技术保护敏感数据传输。
          
          4. 尽管我们努力保护信息安全，但互联网传输无法保证绝对安全。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">六、您的权利</text>
        <text class="section-text">
          您对您的个人信息享有以下权利：
          
          1. 访问权：查看我们持有的您的信息
          2. 更正权：更正不准确的信息
          3. 删除权：要求删除您的信息
          4. 限制处理权：限制我们对您信息的处理
          5. 数据可携带权：获取您的信息副本
          6. 撤回同意权：撤回之前的授权
          
          如需行使上述权利，请通过应用内反馈功能联系我们。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">七、Cookie 和类似技术</text>
        <text class="section-text">
          我们可能使用 Cookie 和类似技术来：
          
          1. 记住您的登录状态
          2. 了解您的使用习惯
          3. 改善用户体验
          
          您可以通过浏览器设置管理 Cookie。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">八、未成年人保护</text>
        <text class="section-text">
          1. 本应用不向未满14周岁的未成年人提供服务。
          
          2. 如您是未成年人，请在监护人指导下使用本应用。
          
          3. 如发现未成年人未经同意提供个人信息，请联系我们删除。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">九、政策更新</text>
        <text class="section-text">
          我们可能适时更新本隐私政策。更新后的政策将在应用内公布，重大变更会通知您。继续使用本应用即表示您接受更新后的政策。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">十、联系我们</text>
        <text class="section-text">
          如您对本隐私政策有任何疑问，请通过应用内反馈功能联系我们。
        </text>
      </view>
    </view>
    
    <view class="footer">
      <text class="footer-text">最后更新：2026年3月</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PrivacyPage'
}
</script>

<style scoped>
.privacy-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #fdf8f9 0%, #f8f0f2 100%);
  padding: 24rpx;
}

.header {
  text-align: center;
  padding: 40rpx 0;
}

.title {
  font-size: 40rpx;
  font-weight: 700;
  color: #1f2937;
}

.content {
  padding: 32rpx;
}

.section {
  margin-bottom: 48rpx;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #c93a5a;
  margin-bottom: 20rpx;
}

.section-text {
  display: block;
  font-size: 28rpx;
  color: #4b5563;
  line-height: 1.8;
  white-space: pre-wrap;
}

.footer {
  text-align: center;
  padding: 40rpx 0;
}

.footer-text {
  font-size: 24rpx;
  color: #9ca3af;
}
</style>
