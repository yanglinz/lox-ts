# Lox-ts

`lox-ts` is my implementation of [Lox](https://craftinginterpreters.com/the-lox-language.html) from [Crafting Interpreters](https://craftinginterpreters.com/) in Typescript.

![build](https://github.com/yanglinz/lox-ts/actions/workflows/main.yml/badge.svg)

## Running Locally

The project should run on most versions of `node`, but it's tested specifically against the following combination:

- `node` - `18.15.0`
- `yarn` - `1.22.19`

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
