const ProductsService = require('../services/productsService');

const productsService = new ProductsService();

module.exports = {
  getProducts: async (req, resp, next) => {
    const { tags } = req.query;
    try {
      const products = await productsService.getProducts({ tags });
      resp.status(200).json({
        data: products,
        message: 'products listed',
      });
    } catch (error) {
      next(error);
    }
  },
};
