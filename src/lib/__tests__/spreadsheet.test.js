import Sheet from '../spreadsheet';

describe('A simple spreadsheet with columns A..Z, AA.., and rows 1..n', () => {
  let sheet;

  beforeEach(() => {
    sheet = new Sheet();
  });

  test('that cells are empty by default', () => {
    expect(sheet.get('A1')).toBe('');
  });

  test('that cells are stored', () => {
    const theCell = 'A1';

    sheet.put(theCell, 'A String');
    expect(sheet.get(theCell)).toBe('A String');

    sheet.put(theCell, 'A Different String');
    expect(sheet.get(theCell)).toBe('A Different String');

    sheet.put(theCell, '');
    expect(sheet.get(theCell)).toBe('');
  });

  test('that many cells exist and can store data', () => {
    sheet.put('A1', 'data for A1');
    sheet.put('A2', 'data for A2');
    sheet.put('A3', 'data for A3');

    expect(sheet.get('A1')).toBe('data for A1');
    expect(sheet.get('A2')).toBe('data for A2');
    expect(sheet.get('A3')).toBe('data for A3');
  });

  test('that Numeric Cells Are Identified And Stored', () => {
    const theCell = 'A22';

    sheet.put(theCell, 'X99'); // "Obvious" string
    expect(sheet.get(theCell), 'X99');

    sheet.put(theCell, '14'); // "Obvious" number
    expect(sheet.get(theCell)).toBe('14');

    sheet.put(theCell, ' 99 X'); // Whole string must be numeric
    expect(sheet.get(theCell)).toBe(' 99 X');

    sheet.put(theCell, ' 1234 '); // Blanks ignored
    expect(sheet.get(theCell)).toBe('1234');

    sheet.put(theCell, ' '); // Just a blank
    expect(sheet.get(theCell)).toBe(' ');
  });

  test('that We Have Access To Cell Literal Values For Editing', () => {
    const theCell = 'A21';

    sheet.put(theCell, 'Some string');
    expect(sheet.getLiteral(theCell)).toBe('Some string');

    sheet.put(theCell, ' 1234 ');
    expect(sheet.getLiteral(theCell)).toBe(' 1234 ');

    sheet.put(theCell, '=7'); // Foreshadowing formulas:)
    expect(sheet.getLiteral(theCell)).toBe('=7');
  });
});

describe('Formula specs', () => {
  let sheet;
  beforeEach(() => {
    sheet = new Sheet();
  });

  test('formula spec', () => {
    sheet.put('B1', ' =7'); // note leading space
    expect(sheet.get('B1')).toBe(' =7');
    expect(sheet.getLiteral('B1')).toBe(' =7');
  });

  test('constant formula', () => {
    sheet.put('A1', '=7');
    expect(sheet.getLiteral('A1')).toBe('=7');
    expect(sheet.get('A1')).toBe('7');
  });

  test('parentheses', () => {
    sheet.put('A1', '=(7)');
    expect('Parends', '7', sheet.get('A1'));
  });

  test('deep parentheses', () => {
    sheet.put('A1', '=((((10))))');
    expect('Parends', '10', sheet.get('A1'));
  });

  test('multiplication of two numbers', () => {
    sheet.put('A1', '=2*3');
    expect(sheet.getLiteral('A1')).toBe('=2*3');
    expect(sheet.get('A1')).toBe('6');
  });

  test('multiplication of many numbers', () => {
    sheet.put('A1', '=2*3*4*5');
    expect(sheet.getLiteral('A1')).toBe('=2*3*4*5');
    expect(sheet.get('A1')).toBe('120');
  });

  test('add', () => {
    sheet.put('A1', '=71+2+3');
    expect(sheet.get('A1')).toBe('76');
  });

  test('precedence', () => {
    sheet.put('A11', '=7+2*3');
    expect(sheet.get('A11')).toBe('13');
  });

  test('full expression', () => {
    sheet.put('A1', '=7*(2+3)*((((2+1))))');
    expect(sheet.get('A1')).toBe('105');
  });

  test('formula error', () => {
    sheet.put('A1', '=7*');
    expect(sheet.get('A1')).toBe('Error');
  });

  test('parentheses error', () => {
    sheet.put('A1', '=(((((7))');
    expect(sheet.get('A1')).toBe('Error');
  });

  test('divide by zero', () => {
    sheet.put('A1', '=2/0');
    expect(sheet.get('A1')).toBe('Error');
  });
});

describe('spreadsheet references', () => {
  let sheet;
  beforeEach(()=> {
    sheet = new Sheet();
  });
  test('references work', () => {
    sheet.put('A1', '8');
    sheet.put('A2', '=A1');
    expect(sheet.get('A2')).toBe('8');
  });
  test('cell changes propogate', () => {
    sheet.put('A1', '8');
    sheet.put('A2', '=A1');
    expect(sheet.get('A2')).toBe('8');

    sheet.put('A1', '9');
    expect(sheet.get('A2')).toBe('9');
  });
  test.skip('that Formulas Know Cells And Recalculate', () => {
    sheet.put('A1', '8');
    sheet.put('A2', '3');
    sheet.put('B1', '=A1*(A1-A2)+A2/3');
    expect(sheet.get('B1')).toBe('41');

    sheet.put('A2', '6');
    expect(sheet.get('B1')).toBe('18');
  });
});
