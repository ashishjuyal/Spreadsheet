import PostfixSolver from '../PostfixSolver';

describe('Postfix to result', () => {
  test('postfix', () => {
    const postfixSolver = new PostfixSolver();
    expect(postfixSolver.evaluateRPN('71 2 + 3 +')).toBe('76');
    expect(postfixSolver.evaluateRPN('2 7 5 * +')).toBe('37');
    expect(postfixSolver.evaluateRPN('4 2 ^ 3 * 3 - 8 4 / 1 1 + / +')).toBe('46');
    expect(postfixSolver.evaluateRPN('1 2 3 + * 4 /')).toBe('1.25');
  });
});
