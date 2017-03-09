import _ from 'lodash';
import InfixToPostfix from './InfixPostfix';
import PostfixSolver from './PostfixSolver';

const EMPTY = '';

export default class Sheet {
  data = {}

  get(cell) {
    return this._isContentDefined(cell) ? this._getContentOf(cell) : EMPTY;
  }

  getLiteral(cell) {
    return this.data[cell];
  }

  put(cell, cellValue) {
    this.data[cell] = cellValue;
  }

  _isContentDefined(cell) {
    return this.data[cell] !== undefined;
  }

  _getContentOf(cell) {
    const content = this.data[cell];
    if (this._isContentAsFormula(content)) {
      const contentInsideFormula = this._asValueOf(content);
      if (this._isContentAsReference(contentInsideFormula)) {
        return this._getContentOf(contentInsideFormula);
      } else if (this._isContentAsNumber(contentInsideFormula)) {
        return this._asNumber(contentInsideFormula);
      }
      return this._solveExpression(contentInsideFormula);
    }
    if (this._isContentAsNumber(content)) {
      return this._asNumber(content);
    }
    return content;
  }

  _asNumber(content) {
    return content.trim();
  }

  _asValueOf(content) {
    return content.substring(1);
  }

  _solveExpression(expression) {
    const infixToPostfix = new InfixToPostfix();
    const postfixSolver = new PostfixSolver();
    return postfixSolver.evaluateRPN(infixToPostfix.toPostfix(expression));
  }

  _isContentAsFormula(content) {
    return _.startsWith(content, '=');
  }

  _isContentAsNumber(content) {
    const contentAsNumber = _.toNumber(content);
    return contentAsNumber ? true : false;
  }

  _isContentAsReference(content) {
    const isAlphaNumeric = /^[a-z0-9]+$/i;
    return isAlphaNumeric.test(this._asValueOf(content));
  }
  displayAll() {
    console.log(this.data);
  }
}
