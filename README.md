## hooks-checker

现如今 react hooks 的使用已经非常普遍，但在使用过程中还是时常会犯一些低级错误。

就比如在使用 `useEffect` 的时候未传第二个 dependency 参数，从而造成意想不到的结果（排查半天最后才发现是这个疏忽而导致的）。本工具就是用来检查 `useEffect`, `useLayoutEffect`, `useMemo` 和 `useCallback` 在使用的时候是否传了第二个参数。

## 安装

```bash
$ npm install hooks-checker
```

## 使用

**demo**

```js
const Checker = require('hooks-checker');

const code = `
  import { useEffect } from 'react';
  const Foo = () => {
    useEffect(() => {});
    return null;
  };
  export default Foo;
`;

const main = () => {
  const checker = new Checker({ code });
  const dangers = checker.check();
  // warn or error with dangers by yourself
};

main();
```

**output of dangers**

```json
[
  {
    "line": 4,
    "column": 4,
    "message": "The second argument is not found in useEffect call.",
  }
]
```

## Checker 参数选项


|字段|类型|是否必须|默认值|描述|
|---|----|------|-----|----|
|code|string|否|''|待检查的代码|
|ast|t.File|否|null|待检查代码对应的 ast|
|libs|string\[\]|否|['react']|引入 hooks 的包，也可以是 rax|

注意：`code` 和 `ast` 不能同时为空。


## License

[MIT License](./LICENSE)