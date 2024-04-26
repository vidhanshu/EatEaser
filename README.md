# Mono repo for Eat Easer

This is code repository for [this article](https://articles.wesionary.team/react-vite-with-shadcn-ui-for-ui-components-all-in-turborepo-8af3deafa58e).
All the details about folder structure and configurations are explained in the article.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `staff`: React app for staff
- `customer`: React app for customer
- `kitchen`: React app for kitchen
- `admin`: React app for admin
- `api`: express api for all above frontends
- `@repo/ui`: a stub React component library shared by all frontends
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Build

To build all apps and packages, run the following command:

```
cd eat-easer
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd eat-easer
pnpm dev
```

### How to install package for particular app in apps

```
pnpm i <package-name> --filter=<app_name>
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd eat-easer
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
