# lox-ts

![build](https://github.com/yanglinz/lox-ts/actions/workflows/main.yml/badge.svg)

---

`lox-ts` is my implementation of [Lox](https://craftinginterpreters.com/the-lox-language.html) from [Crafting Interpreters](https://craftinginterpreters.com/) in Typescript.

## Running locally

The project should run on most versions of `node`, but it's tested specifically against the following combination:

- `node v18.15.0`
- `yarn v1.22.19`

To run the interpreter locally:

```
yarn install
yarn interpreter path/to/some/file.lox
```

To run the playground locally:

```
yarn playground
```

Once booted up, the playground should be accessible at `localhost:5173`.
