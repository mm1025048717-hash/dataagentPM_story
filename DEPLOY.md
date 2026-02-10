# 部署到 GitHub 与 Vercel

- **GitHub 仓库**：<https://github.com/mm1025048717-hash/dataagentPM_story>
- **Vercel 在线站**：<https://dataagent-pm-story.vercel.app/#intro>

---

## 一、部署到 GitHub

### 1. 在本地用 Git 推送代码

在项目文件夹 **dataagentPM_story** 下打开终端（PowerShell），依次执行：

```powershell
# 进入项目目录
cd "c:\Users\陈宣任\Desktop\dataagent产品经理学习网站\dataagentPM_story"

# 若尚未初始化（首次）
# git init
# git remote add origin https://github.com/mm1025048717-hash/dataagentPM_story.git

# 添加并提交
git add .
git commit -m "你的提交说明"

# 推送到 GitHub（主分支 main）
git push -u origin main
```

若 GitHub 要求登录，请使用 **Personal Access Token** 作为密码，或使用 GitHub Desktop / GitHub CLI 登录。

---

## 二、部署到 Vercel

### 方式 A：用 Vercel 网站（推荐）

1. 打开：https://vercel.com  
2. 使用 **「Continue with GitHub」** 用你的 GitHub 账号登录  
3. 点击 **「Add New…」→「Project」**  
4. 在 **Import Git Repository** 里选择仓库：**mm1025048717-hash/dataagentPM_story**  
5. **Framework Preset** 保持 **Other** 或 **None**（静态站点无需构建）  
6. **Root Directory** 保持默认（不填）  
7. 点击 **「Deploy」**  
8. 部署完成后访问：**https://dataagent-pm-story.vercel.app**（首页锚点：`#intro`）

之后每次向该 GitHub 仓库的 `main` 分支 **push**，Vercel 会自动重新部署。

### 方式 B：用 Vercel CLI

```bash
# 安装 Vercel CLI（需先安装 Node.js）
npm i -g vercel

# 在项目目录下执行，按提示登录并选择或创建项目
vercel
```

---

## 三、常用命令速查

| 操作           | 命令 |
|----------------|------|
| 之后修改代码再部署 | `git add .` → `git commit -m "更新说明"` → `git push` |
| 查看远程仓库   | `git remote -v` |
| 更换远程地址   | `git remote set-url origin https://github.com/mm1025048717-hash/新仓库名.git` |

---

## 四、注意事项

- **分支**：Vercel 默认部署 `main` 分支；若使用 `master`，需在 Vercel 项目 **Settings → Git** 中修改。  
- **自定义域名**：在 Vercel 项目 **Settings → Domains** 中可绑定自己的域名。  
- **自动部署**：每次向 `main` 分支 `git push` 后，Vercel 会自动重新部署。

完成以上步骤后，项目会同时存在于 **GitHub**（代码托管）和 **Vercel**（在线访问）。
