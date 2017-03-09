import _ from 'lodash';

class DivisionByZeroException {
  constructor(value, message) {
    this.value = value;
    this.message = message;
  }
  toString() {
    return this.value + this.message;
  }
}

export default class PostfixSolver {
  displayError(msg, data) {
    let message = '';
    if (msg === 'too_many_decimals') {
      message = ('You entered a number with too many decimals');
    } else if (msg === 'number_parse_problem') {
      message = ('We had trouble understanding the following term ' + data);
    } else if (msg === 'rpn_pop_pop') {
      message = ('This postifix syntax is invalid');
    } else if (msg === 'division_by_zero') {
      message = (' You are trying to divide by zero!');
    } else if (msg === 'could_not_parse') {
      message = ('We we were unable to process your expression');
    }
    // console.log(message);
    return 'Error';
  }

  calculate(augend, addend, operator) {
    if (operator === '+') {
      return augend + addend;
    } else if (operator === '-') {
      return augend - addend;
    } else if (operator === '*') {
      return augend * addend;
    } else if (operator === '^') {
      return Math.pow(augend, addend);
    } else if (operator === '/') {
      if (addend === 0) {
        return this.displayError('division_by_zero');
        // throw new DivisionByZeroException('division by zero');
      }
      return augend / addend;
    }
  }

  isOperand(elem, bAllowParenthesis) {
    // const element = elem.trim();
    const element = elem;
    if (bAllowParenthesis && (element === '(' || element === ')')) {
      return true;
    }
    return (element === '+' || element === '-' || element === '*' || element === '/' || element === '^');
  }

  evaluateRPN(postfixExpression) {
    const rpnArray = postfixExpression.split(' ');
    let index = 0;
    let iterationCount = 0;

    while (rpnArray.length > 1) {
      // const currentToken = rpnArray[index].trim();
      const currentToken = rpnArray[index];

      if (this.isOperand(currentToken)) { // console.log(' isOperand()  ' + op);
        const op = rpnArray.splice(index, 1);
        const insertAt = index - 2;
        index--;

        if (rpnArray.length < 2) {
          return this.displayError('rpn_pop_pop');
          // return;
        }
        const n1Was = rpnArray.splice(index, 1);
        index--;
        const n2Was = rpnArray.splice(index, 1);

        const n1 = parseFloat(n1Was);
        const n2 = parseFloat(n2Was);
        if (isNaN(+n1)) {
          alert('n1 , ' + n1Was + ', is not a number. Parsing exiting now');
          return;
        }
        if (isNaN(+n2)) {
          alert('n2 , ' + n2Was + ', is not a number. Parsing exiting now ');
          return;
        }

        const pushMe = this.calculate(n2, n1, op[0]);
        rpnArray.splice(insertAt, 0, pushMe);
      } else {
        index++;
      }
      if (iterationCount++ > 500) {
        // console.log('get me outta here, there is something wrong');
        return this.displayError('could_not_parse');
        // return;
      }
    }

    if (rpnArray.length !== 1) {
      this.displayError('could_not_parse');
      console.log('unable to parse postfix expression : ' + rpnArray.toString().substring(1, rpnArray.toString().length - 1));
    }
    return _.toString(rpnArray.pop());
  }
}
