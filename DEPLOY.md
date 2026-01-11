# 🚀 GitHub Pages 部署指南

## 📋 快速部署步骤

### 1. 访问仓库设置
1. 打开GitHub仓库：https://github.com/jeeinn/web-clock
2. 点击页面顶部的 **⚙️ Settings** 选项卡
3. 在左侧边栏中滚动并找到 **🌐 Pages** 选项

### 2. 配置部署源
在 Pages 设置页面：

#### Build and deployment 部分：
- **Source**: 选择 **Deploy from a branch**
- **Branch**: 选择 `master` 分支
- **Folder**: 选择 `/ (root)`
- 点击 **💾 Save** 按钮

### 3. 等待部署
- GitHub 开始自动构建过程
- 页面顶部会显示：
  ```
  🟡 GitHub Pages is building your site from the master branch.
  ```
- 等待1-5分钟让部署完成

### 4. 获取访问地址
部署成功后，页面顶部会显示：
```
✅ Your site is published at https://jeeinn.github.io/web-clock/
```

## 📱 使用网络时钟

### 在iPhone上添加到主屏幕
1. **打开Safari**，访问：`https://jeeinn.github.io/web-clock/`
2. **点击分享按钮** (页面底部中央的分享图标)
3. **选择"添加到主屏幕"**
4. **自定义名称**：输入"时钟"或"网络时钟"
5. **点击"添加"**
6. **从主屏幕启动**：获得全屏无边框体验

### 优化设置建议
为了最佳的时钟体验，建议在iPhone上：

1. **显示与亮度设置**：
   - 设置 > 显示与亮度 > 自动锁定 > **永不**
   - 调整亮度到舒适水平
   - 开启"自动亮度调节"

2. **Safari设置**：
   - 设置 > Safari > 确保JavaScript已启用

3. **专注模式**（可选）：
   - 设置 > 专注模式 > 勿扰
   - 避免通知干扰时钟显示

## 🔧 自定义域名（可选）

如果你有自己的域名，可以配置自定义域名：

1. 在仓库根目录创建 `CNAME` 文件
2. 文件内容填写你的域名：`clock.yourdomain.com`
3. 在域名提供商处添加CNAME记录指向 `jeeinn.github.io`

## 📊 部署状态检查

### 检查部署状态
1. 访问仓库的 **Actions** 页面
2. 查看 **pages-build-deployment** 工作流状态
3. 绿色✅表示成功，红色❌表示失败

### 常见问题排查
- **404错误**: 检查GitHub Pages是否启用
- **样式丢失**: 确认CSS/JS文件路径正确
- **功能异常**: 检查浏览器控制台是否有JavaScript错误

## 🔄 自动部署

好消息！现在每次你推送代码到master分支：
```bash
git add .
git commit -m "更新功能"
git push
```

GitHub Pages会自动重新部署，无需手动操作！

## 🌐 分享你的网络时钟

部署完成后，你可以分享以下链接：
- **直接访问**: https://jeeinn.github.io/web-clock/
- **二维码**: 可生成二维码供他人扫描访问
- **社交媒体**: 分享给朋友和家人使用

## 🎯 下一步

1. ✅ 访问在线版本测试所有功能
2. ✅ 在iPhone SE上添加到主屏幕
3. ✅ 体验秒钟显示、主题切换、横屏模式
4. ✅ 享受你的专属网络时钟！