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

  getProduct: async (req, resp, next) => {
    const { productId } = req.params;
    try {
      const product = await productsService.getProduct({ productId });
      resp.status(200).json({
        data: product,
        message: 'product retrieved',
      });
    } catch (error) {
      next(error);
    }
  },

  postProduct: async (req, resp, next) => {
    const { body: product } = req;
    if (!req.body.name || !req.body.price) {
      return next(400);
    }

    try {
      const createProduct = await productsService.createProduct({ product });
      resp.status(200).json({
        data: createProduct,
        message: 'product created',
      });
    } catch (error) {
      next(error);
    }
  },

  putProduct: async (req, resp, next) => {
    const { productId } = req.params;
    const { body: product } = req;

    if (!req.body.name && !req.body.price && !req.body.image && !req.body.type) {
      return next(400);
    }

    try {
      const updateProduct = await productsService.updateProduct({productId, product});
      resp.status(200).json({
        data: updateProduct,
        message: 'product update',
      });
    } catch (error) {
      next(error);
    }
  },

  deleteProduct: async (req, resp, next) => {
    const { productId } = req.params;

    try {
      const productDelete = await productsService.deleteProduct({ productId });
      resp.status(200).json({
        data: productDelete,
        message: 'product delete',
      });
    } catch (error) {
      next(error);
    }
  },
};
