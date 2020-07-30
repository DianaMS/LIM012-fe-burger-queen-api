const { pagination } = require('../utils/pagination');

describe('pagination()', () => {
  it('Debería retornar una cadena de URL con enlaces firstPage, prevPage, nextPage, lastPage', () => {
    expect(pagination('http://127.0.0.1:8080/users', 1, 10, 11)).toBe('<http://127.0.0.1:8080/users?limit=10&page=1>; rel="first", <http://127.0.0.1:8080/users?limit=10&page=1>; rel="prev", <http://127.0.0.1:8080/users?limit=10&page=2>; rel="next", <http://127.0.0.1:8080/users?limit=10&page=2>; rel="last"');
  });
});
