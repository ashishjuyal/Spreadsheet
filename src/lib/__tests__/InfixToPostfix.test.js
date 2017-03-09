import InfixToPostfix from '../InfixPostfix';

describe('Infix to postfix conversion', () => {
  test('infix to postfix', () => {
    const infixToPostfix = new InfixToPostfix();
    expect(infixToPostfix.toPostfix('71+2+3')).toBe('71 2 + 3 +');
    expect(infixToPostfix.toPostfix('2+7*5')).toBe('2 7 5 * +');
    expect(infixToPostfix.toPostfix('4^2*3-3+8/4/(1+1)')).toBe('4 2 ^ 3 * 3 - 8 4 / 1 1 + / +');
    expect(infixToPostfix.toPostfix('((1*(2+3))/4)')).toBe('1 2 3 + * 4 /');
    // expect(infixToPostfix.toPostfix('A*(A-B)+B/3')).toBe('1 2 3 + * 4 /');
  });
});
