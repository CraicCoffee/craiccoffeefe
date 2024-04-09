# Craic Coffee Community [![deploy](https://github.com/InsightMon/InsightMon/actions/workflows/pull_release_deploy.yml/badge.svg)](https://github.com/InsightMon/InsightMon/actions/workflows/pull_release_deploy.yml)

This project is initialized with [UmiJS](https://umijs.org/). Follow is the quick guide for how to use.

## Environment Prepare

```
$ node -v
v16.17.0
```

Install `pnpm`:

```bash
npm install -g pnpm
```

> [Installation | pnpm](https://pnpm.io/installation)

Install `node_modules`:

```bash
pnpm install
```

## 代码提交规范

参考这个 [约定式提交](https://www.conventionalcommits.org/zh-hans/v1.0.0/)

### Start project

dev 环境

```bash
pnpm start
```

mock 环境

```bash
pnpm run mock
```

### Build project

```bash
pnpm run build
```

### Check code style

```bash
pnpm run lint
```

You can also use script to auto fix some lint error:

```bash
pnpm run lint:fix
```

### Test code

```bash
pnpm test
```

## NOTE

项目启动失败时，可以尝试删除`.umi/`

## 文档

[如何更新接口](./docs/%E5%A6%82%E4%BD%95%E6%9B%B4%E6%96%B0%E6%8E%A5%E5%8F%A3.md)
