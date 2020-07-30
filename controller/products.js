const ProductsService = require('../services/productsService');
const { pagination } = require('./utils/pagination');

const productsService = new ProductsService();

module.exports = {
  getProducts: async (req, resp, next) => {
    const url = `${req.protocol}://${req.get('host')}${req.path}`;
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    const skip = (limit * page) - limit;

    try {
      const products = await productsService.getProductsPag(skip, limit);
      const totalProducts = await productsService.getProducts();
      const headerPagination = pagination(url, page, limit, totalProducts.length);
      resp.set('link', headerPagination);

      return resp.status(200).json(products);
    } catch (error) {
      return next(error);
    }
  },

  getProduct: async (req, resp, next) => {
    const { productId } = req.params;

    try {
      const product = await productsService.getProduct({ productId });
      if (product === null) {
        return next(404);
      }

      return resp.status(200).json({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        type: product.type,
        dateEntry: product.dateEntry,
      });
    } catch (error) {
      return next(error);
    }
  },

  postProduct: async (req, resp, next) => {
    const { body: product } = req;
    if (!req.body.name || !req.body.price || typeof req.body.price !== 'number') {
      return next(400);
    }

    try {
      const createProduct = await productsService.createProduct({ product });
      return resp.status(200).json({
        _id: createProduct,
        name: product.name,
        price: product.price,
        image: product.image,
        type: product.type,
        dateEntry: new Date(),
        message: 'product created',
      });
    } catch (error) {
      return next(error);
    }
  },

  putProduct: async (req, resp, next) => {
    const { productId } = req.params;
    const { body: product } = req;
    product.dateEntry = new Date();

    if ((!req.body.name && !req.body.price && !req.body.image && !req.body.type) || (typeof req.body.price !== 'number')) {
      return next(400);
    }

    const validateProductId = await productsService.getProduct({ productId });
    if (!validateProductId) {
      return next(404);
    }

    try {
      const updateProduct = await productsService.updateProduct({ productId, product });
      return resp.status(200).json({
        _id: updateProduct,
        name: product.name,
        price: product.price,
        image: product.image,
        type: product.type,
        dateEntry: product.dateEntry,
        message: 'product update',
      });
    } catch (error) {
      return next(error);
    }
  },

  deleteProduct: async (req, resp, next) => {
    const { productId } = req.params;
    const { body: product } = req;
    product.dateEntry = new Date();

    const checkProduct = await productsService.getProduct({ productId });
    if (!checkProduct) {
      return next(404);
    }

    try {
      const productDelete = await productsService.deleteProduct({ productId });
      return resp.status(200).json({
        _id: productDelete,
        name: product.name,
        price: product.price,
        image: product.image,
        type: product.type,
        dateEntry: product.dateEntry,
        message: 'product delete',
      });
    } catch (error) {
      return next(error);
    }
  },
};
