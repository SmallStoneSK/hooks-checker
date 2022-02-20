import * as t from '@babel/types';
import * as parser from '@babel/parser';

export const code2ast = (code: string): t.File => {
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'classProperties', 'decorators-legacy', 'exportDefaultFrom'],
  });
  return ast;
};
