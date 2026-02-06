# 部署到 GitHub 与 Vercel

## 一、部署到 GitHub

### 1. 在 GitHub 上创建新仓库

1. 打开：https://github.com/mm1025048717-hash?tab=repositories  
2. 点击 **「New」** 创建新仓库  
3. 填写：
   - **Repository name**：例如 `chen-xuanren-story` 或 `dataagent-pm-guide`（英文）
   - **Description**：可选
   - 选择 **Public**
   - **不要**勾选 “Add a README file”
4. 点击 **「Create repository」**

### 2. 在本地用 Git 推送代码

在项目文件夹 **dataagentPM_story** 下打开终端（PowerShell 或 CMD），依次执行：

```bash
# 初始化 Git（如果还没初始化）
git init

# 添加所有文件
git add .

# 第一次提交
git commit -m "Initial commit: 陈宣任成长故事 / DataAgent PM Guide"

# 仓库若已存在可跳过下一行；否则把 YOUR_REPO_NAME 换成你的仓库名
# git remote add origin https://github.com/mm1025048717-hash/dataagentPM_story.git

# 推送到 GitHub（主分支名为 main）
git branch -M main
git push -u origin main
```

如果 GitHub 要求登录，请使用 **Personal Access Token** 作为密码，或按提示用 GitHub Desktop / GitHub CLI 登录。

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
8. 等待几十秒，部署完成后会得到一个地址，例如：  
   `https://your-project.vercel.app`

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

- **仓库名**：请把上面所有 `YOUR_REPO_NAME` 换成你实际创建的仓库名。  
- **分支**：Vercel 默认部署 `main` 分支，若你用 `master`，需在 Vercel 项目 **Settings → Git** 里改为对应分支。  
- **自定义域名**：在 Vercel 项目 **Settings → Domains** 里可绑定自己的域名。

完成以上步骤后，项目会同时存在于 **GitHub**（代码托管）和 **Vercel**（在线访问）。
