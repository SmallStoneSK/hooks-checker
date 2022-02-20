import * as t from '@babel/types';
import * as parser from '@babel/parser';

export const code2ast = (code: string, options?: { filePath: string }): t.File => {
  const ast = parser.parse(code, {
    sourceType: 'module',
    sourceFilename: options?.filePath,
    plugins: ['jsx', 'classProperties', 'decorators-legacy', 'exportDefaultFrom'],
  });
  return ast;
};
