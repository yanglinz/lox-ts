# lox-ts

![build](https://github.com/yanglinz/lox-ts/actions/workflows/main.yml/badge.svg)

---

`lox-ts` is an implementation of the _Lox_ programming language from the book [Crafting Interpreters](https://craftinginterpreters.com/), written in Typescript.

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
