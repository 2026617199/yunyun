# 发布指南

## 自动构建与发布

本项目配置了 GitHub Actions，可以自动为 Windows、macOS 和 Linux 构建安装包并发布到 GitHub Releases。

### 发布步骤

1. **更新版本号**

   在 `package.json` 中更新版本号：
   ```json
   {
     "version": "1.0.0"
   }
   ```

2. **创建并推送 Git 标签**

   ```bash
   git add .
   git commit -m "release: v1.0.0"
   git tag v1.0.0
   git push origin main
   git push origin v1.0.0
   ```

3. **等待构建完成**

   推送标签后，GitHub Actions 会自动：
   - 在 Windows、macOS、Linux 三个平台上构建应用
   - 生成对应的安装包
   - 创建 GitHub Release 并上传安装包

4. **查看 Release**

   构建完成后，访问仓库的 Releases 页面即可看到：
   - Windows: `.exe` 安装包
   - macOS: `.dmg` 安装包
   - Linux: `.AppImage`、`.deb`、`.snap` 安装包

### 手动触发构建

你也可以在 GitHub 仓库的 Actions 页面手动触发构建：

1. 进入仓库的 Actions 页面
2. 选择 "Build and Release" 工作流
3. 点击 "Run workflow"

### 构建产物

| 平台 | 文件格式 | 说明 |
|------|----------|------|
| Windows | `.exe` | NSIS 安装程序 |
| macOS | `.dmg` | macOS 磁盘映像 |
| Linux | `.AppImage` | 便携式应用 |
| Linux | `.deb` | Debian/Ubuntu 包 |
| Linux | `.snap` | Snap 包 |

### 注意事项

- 首次发布前，请确保在 GitHub 仓库设置中启用了 Actions
- 标签格式必须是 `v*` 开头（如 `v1.0.0`、`v2.1.3`）
- macOS 构建目前未启用签名和公证，用户首次运行时需要在系统偏好设置中允许
- 如果构建失败，请检查 Actions 日志获取详细错误信息
