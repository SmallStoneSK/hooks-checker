import test from "ava";
import Checker from "../src";

test("Referenced Hooks without second argument", async (t) => {
  const code = `
    import { useMemo, useCallback, useEffect, useLayoutEffect } from 'react';
    const Foo = () => {
      const v1 = useMemo(() => {});
      const v2 = useMemo(() => {}, []);
      const c1 = useCallback(() => {});
      const c2 = useCallback(() => {}, []);
      useEffect(() => {});
      useEffect(() => {}, []);
      useLayoutEffect(() => {});
      useLayoutEffect(() => {}, []);
      return null;
    };
    export default Foo;
  `;
  const checker = new Checker({
    code,
  });
  const dangers = await checker.check();
  t.deepEqual(dangers, [
    {
      line: 4,
      column: 17,
      message: "The second argument is not found in useMemo call.",
    },
    {
      line: 6,
      column: 17,
      message: "The second argument is not found in useCallback call.",
    },
    {
      line: 8,
      column: 6,
      message: "The second argument is not found in useEffect call.",
    },
    {
      line: 10,
      column: 6,
      message: "The second argument is not found in useLayoutEffect call.",
    },
  ]);
});

test("Namespaced Hooks without second argument", async (t) => {
  const code = `
    import * as React from 'react';
    const Foo = () => {
      const v1 = React.useMemo(() => {});
      const v2 = React.useMemo(() => {}, []);
      const c1 = React.useCallback(() => {});
      const c2 = React.useCallback(() => {}, []);
      React.useEffect(() => {});
      React.useEffect(() => {}, []);
      React.useLayoutEffect(() => {});
      React.useLayoutEffect(() => {}, []);
      return null;
    };
    export default Foo;
  `;
  const checker = new Checker({
    code,
  });
  const dangers = await checker.check();
  t.deepEqual(dangers, [
    {
      line: 4,
      column: 23,
      message: "The second argument is not found in useMemo call.",
    },
    {
      line: 6,
      column: 23,
      message: "The second argument is not found in useCallback call.",
    },
    {
      line: 8,
      column: 12,
      message: "The second argument is not found in useEffect call.",
    },
    {
      line: 10,
      column: 12,
      message: "The second argument is not found in useLayoutEffect call.",
    },
  ]);
});

test("Referenced Hooks without second argument (in rax)", async (t) => {
  const code = `
    import { useMemo, useCallback, useEffect, useLayoutEffect } from 'rax';
    const Foo = () => {
      const v1 = useMemo(() => {});
      const v2 = useMemo(() => {}, []);
      const c1 = useCallback(() => {});
      const c2 = useCallback(() => {}, []);
      useEffect(() => {});
      useEffect(() => {}, []);
      useLayoutEffect(() => {});
      useLayoutEffect(() => {}, []);
      return null;
    };
    export default Foo;
  `;
  const checker = new Checker({
    code,
    libs: ["rax"],
  });
  const dangers = await checker.check();
  t.deepEqual(dangers, [
    {
      line: 4,
      column: 17,
      message: "The second argument is not found in useMemo call.",
    },
    {
      line: 6,
      column: 17,
      message: "The second argument is not found in useCallback call.",
    },
    {
      line: 8,
      column: 6,
      message: "The second argument is not found in useEffect call.",
    },
    {
      line: 10,
      column: 6,
      message: "The second argument is not found in useLayoutEffect call.",
    },
  ]);
});

test("Namespaced Hooks without second argument (in rax)", async (t) => {
  const code = `
    import * as Rax from 'rax';
    const Foo = () => {
      const v1 = Rax.useMemo(() => {});
      const v2 = Rax.useMemo(() => {}, []);
      const c1 = Rax.useCallback(() => {});
      const c2 = Rax.useCallback(() => {}, []);
      Rax.useEffect(() => {});
      Rax.useEffect(() => {}, []);
      Rax.useLayoutEffect(() => {});
      Rax.useLayoutEffect(() => {}, []);
      return null;
    };
    export default Foo;
  `;
  const checker = new Checker({
    code,
    libs: ["rax"],
  });
  const dangers = await checker.check();
  t.deepEqual(dangers, [
    {
      line: 4,
      column: 21,
      message: "The second argument is not found in useMemo call.",
    },
    {
      line: 6,
      column: 21,
      message: "The second argument is not found in useCallback call.",
    },
    {
      line: 8,
      column: 10,
      message: "The second argument is not found in useEffect call.",
    },
    {
      line: 10,
      column: 10,
      message: "The second argument is not found in useLayoutEffect call.",
    },
  ]);
});
