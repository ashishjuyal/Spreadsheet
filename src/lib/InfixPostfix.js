// import _ from 'lodash';

class UnknownOperatorException {
  constructor(value, message) {
    this.value = value;
    this.message = message;
  }
  toString() {
    return this.value + this.message;
  }
}

export default class InfixPostfix {
  isOperand(elem, bAllowParenthesis) {
    // const element = elem.trim();
    const element = elem;
    if (bAllowParenthesis && (element === '(' || element === ')')) {
      return true;
    }
    return (element === '+' || element === '-' || element === '*' || element === '/' || element === '^');
  }

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
    console.log(message);
  }

  getFullNumber(str) {
    let bFoundDot = false;
    let out = '';
    for (let index = 0; index < str.length; index++) {
      const currLett = str.substring(index, index + 1);
      if ('0123456789'.indexOf(currLett) !== -1) {
        out += currLett;
      } else if (currLett === '.' && bFoundDot) {
        this.displayError('too_many_decimals');
        break;
      } else if (currLett === '.' && bFoundDot === false) {
        out += currLett;
        bFoundDot = true;
      } else {
        break;
      }
    }
    return out;
  }

  operatorToPrecedence(operator) {
    if (operator === '+' || operator === '-') {
      return 1;
    } else if (operator === '*' || operator === '/') {
      return 2;
    } else if (operator === '^') {
      return 3;
    } else if (operator === '(' || operator === ')') {
      return 4;
    }
    throw new UnknownOperatorException('Unknown operator =' + operator + ',at  operatorToPrecedence()');
  }

  toArr(data) {
    const bAllowParenthesis = true;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      const currLett = data.substring(index, index + 1);
      if (currLett === ' ') continue;
      // is a dot or is a digit
      const bisNumeric = currLett === '.' || '0123456789'.indexOf(currLett) !== -1;
      if (bisNumeric) { // get the full number which could be several characters long
        const fullNum = this.getFullNumber(data.substring(index));
        const isOk = isNaN(+fullNum) === false; // one last check that it actually is a number
        if (isOk) {
          arr.push(parseFloat(fullNum) + '');
        } else {
          this.displayError('number_parse_problem', fullNum);
        }
        index += fullNum.length - 1; // -1 because index is index++ in loop
      } else if (this.isOperand(currLett, bAllowParenthesis)) {
        arr.push(currLett);
      }
    }

    // there's got be a better way to do this..but it works ;)
    // support unary negative signs by finding them and putting them with numbers they preceed
    for (let index = arr.length - 1; index >= 0; index--) {
      // look for negatives
      if (arr[index] === '-') {
        if (index === 0 && arr.length > 0) {
          arr[0] = '-' + arr[1];
          arr.splice(1, 1);
        } else if (index + 1 < data.length && index > 0 && this.isOperand(arr[index - 1], bAllowParenthesis) && '0123456789.'.indexOf(arr[index + 1])) { // negative preceded by an operand and  is a unary
          arr[index] = '-' + arr[index + 1];
          arr.splice(index + 1, 1);
        }
      }
    }
    return arr;
  }

  debug = false
  print(str) {
    if (this.debug) console.log(str);
  }

  toPostfix(infix) {
    const array = this.toArr(infix);
    let index;
    const operandStack = [];
    const output = [];

    const bAllowParenthesis = true;
    for (index = 0; index < array.length; index++) {
      const currentToken = array[index].trim();
      if (this.isOperand(currentToken, bAllowParenthesis)) {
        this.print('I is operand ' + currentToken + ', output : ' + output + ', operandStack: ' + operandStack);
        if (operandStack.length === 0) {
          operandStack.push(currentToken);
        } else if (operandStack.length > 0 && currentToken === ')') {
          while (operandStack.length > 0 && operandStack[operandStack.length - 1] !== '(') {
            output.push(operandStack.pop());
          }
          this.print('\t B now, pop off ' + operandStack[operandStack.length - 1] + ' SHOULD BE CLOSING PARENTHESIS!');
          operandStack.pop(); // remove parenthesis
        } else if (operandStack.length > 0) {
          this.print('II is operand ' + currentToken + ', output : ' + output);
          if ((operandStack[operandStack.length - 1] === '(' && currentToken === '(' || (currentToken !== '(') && this.operatorToPrecedence(operandStack[operandStack.length - 1]) >= this.operatorToPrecedence(currentToken))) {
            this.print(' C  , operandStack : ' + operandStack);
            while (operandStack.length > 0 && operandStack[operandStack.length - 1] !== '(' &&
              this.operatorToPrecedence(operandStack[operandStack.length - 1]) >= this.operatorToPrecedence(currentToken)) {
              output.push(operandStack.pop());
            }
            this.print('\t D now, pop off ' + operandStack[operandStack.length - 1]);
            operandStack.push(currentToken);
          } else if (this.operatorToPrecedence(operandStack[operandStack.length - 1]) < this.operatorToPrecedence(currentToken)) {
            this.print('\t III operandStack[operandStack.length-1] ,' + operandStack[operandStack.length - 1] + '< ' + currentToken);
            operandStack.push(currentToken);
          }
        }
      } else if (isNaN(+currentToken) === false) { // ELSE IT IS  ANUMBER
        this.print('IV isNumber() currentToken = ' + currentToken);
        output.push(currentToken);
      }
    }
    while (operandStack.length > 0) {
      output.push(operandStack.pop());
    }
    return output.join(' ');
  }

}
