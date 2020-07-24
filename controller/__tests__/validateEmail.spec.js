const validateEmail = require('../utils/validateEmail');

describe('Función validateEmail()', () => {
  it('Debería retornar true si es un email válido', () => {
    expect(validateEmail('admin@localhost.com')).toBe(true);
  });
});

describe('Función validateEmail()', () => {
  it('Debería retornar false si es un email inválido', () => {
    expect(validateEmail('test@test')).toBe(false);
  });
});
