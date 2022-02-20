import * as t from "@babel/types";
import { code2ast } from "./utils";
import traverse from "@babel/traverse";

interface IOptions {
  ast?: t.File;
  code?: string;
  libs?: string[];
}

interface IHook {
  type: HookType;
  variableName: string;
}

interface IDanger {
  line: number;
  column: number;
  message: string;
}

enum HookType {
  namespaced = "namespaced",
  referenced = "referenced",
}

const ToCheckHookApis: string[] = [
  "useEffect",
  "useLayoutEffect",
  "useCallback",
  "useMemo",
];

const getImportedName = (imported: t.Identifier | t.StringLiteral): string => {
  if (t.isIdentifier(imported)) {
    return imported.name;
  } else {
    return imported.value;
  }
};

class Checker {
  private options: IOptions;

  constructor(options: IOptions) {
    this.options = options;
    this.init();
  }

  private init(): void {
    if (!this.options.ast) {
      if (!this.options.code) {
        throw new Error(
          `code and ast cannot be both empty in Checker's options.`
        );
      }
      this.options.ast = code2ast(this.options.code);
    }
    if (!this.options.libs) {
      this.options.libs = ["react"];
    }
  }

  private collectPossibleHooks(): IHook[] {
    const possibleHooks = [];
    traverse(this.options.ast, {
      ImportDeclaration: (path) => {
        const { source, specifiers } = path.node;
        if (this.options.libs.includes(source.value)) {
          specifiers.forEach((specifier) => {
            if (t.isImportNamespaceSpecifier(specifier)) {
              possibleHooks.push({
                type: HookType.namespaced,
                variableName: specifier.local.name,
              });
            } else if (t.isImportSpecifier(specifier)) {
              const importedName = getImportedName(specifier.imported);
              if (ToCheckHookApis.includes(importedName)) {
                possibleHooks.push({
                  type: HookType.referenced,
                  variableName: specifier.local.name,
                });
              }
            }
          });
        }
      },
    });
    return possibleHooks;
  }

  private checkHookUsages(possibleHooks: IHook[]): IDanger[] {
    const dangers: IDanger[] = [];
    const referencedHooks = [];
    const namespacedHooks = [];
    possibleHooks.forEach((hook) => {
      if (hook.type === HookType.referenced) {
        referencedHooks.push(hook);
      } else {
        namespacedHooks.push(hook);
      }
    });
    traverse(this.options.ast, {
      MemberExpression: (path) => {
        const { object, property } = path.node;
        if (
          namespacedHooks.some((hook) => hook.variableName === object.name) &&
          ToCheckHookApis.includes(property.name) &&
          t.isCallExpression(path.parent) &&
          path.parent.arguments.length === 1
        ) {
          dangers.push({
            line: property.loc.start.line,
            column: property.loc.start.column,
            message: `The second argument is not found in ${property.name} call.`,
          });
        }
      },
      CallExpression: (path) => {
        const { callee, loc } = path.node;
        if (
          t.isIdentifier(callee) &&
          referencedHooks.some((hook) => hook.variableName === callee.name) &&
          path.node.arguments.length === 1
        ) {
          dangers.push({
            line: loc.start.line,
            column: loc.start.column,
            message: `The second argument is not found in ${callee.name} call.`,
          });
        }
      },
    });
    return dangers;
  }

  check(): IDanger[] {
    const possibleHooks = this.collectPossibleHooks();
    const dangers = this.checkHookUsages(possibleHooks);
    return dangers;
  }
}

export default Checker;
