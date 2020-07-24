const ProductsService = require('../services/productsService');
const { pagination } = require('./utils/pagination');

const productsService = new ProductsService();

module.exports = {
  getProducts: async (req, resp, next) => {
    const { tags } = req.query;
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    const skip = (limit * page) - limit;
    const dataProducts = [];

    try {
      const products = await productsService.getProductsPag({ tags }, skip, limit);
      const totalProducts = await productsService.getProducts({ tags });
      pagination('products', page, limit, totalProducts.length);

      products.forEach((product) => {
        const detailProduct = {
          _id: product._id.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
          type: product.type,
          dataEntry: product.dataEntry,
        };

        dataProducts.push(detailProduct);
      });

      resp.status(200).json(dataProducts);
    } catch (error) {
      next(error);
    }
  },

  getProduct: async (req, resp, next) => {
    const { productId } = req.params;
    try {
      const product = await productsService.getProduct({ productId });
      if (product === null) {
        return next(404);
      }
      resp.status(200).json({
        _id: product._id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        type: product.type,
        dataEntry: product.dataEntry,
      });
    } catch (error) {
      next(error);
    }
  },

  postProduct: async (req, resp, next) => {
    const { body: product } = req;
    product.dataEntry = new Date();
    if (!req.body.name || !req.body.price || typeof req.body.price !== 'number') {
      return next(400);
    }

    try {
      const createProduct = await productsService.createProduct({ product });
      resp.status(200).json({
        _id: createProduct.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        type: product.type,
        date: product.dataEntry,
        message: 'product created',
      });
    } catch (error) {
      next(error);
    }
  },

  putProduct: async (req, resp, next) => {
    const { productId } = req.params;
    const { body: product } = req;
    product.dataEntry = new Date();

    if ((!req.body.name && !req.body.price && !req.body.image && !req.body.type) || (typeof req.body.price !== 'number')) {
      return next(400);
    }

    const validateProductId = await productsService.getProduct({ productId });
    if (!validateProductId) {
      return next(404);
    }

    try {
      const updateProduct = await productsService.updateProduct({ productId, product });
      resp.status(200).json({
        _id: updateProduct.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        type: product.type,
        dataEntry: product.dataEntry,
        message: 'product update',
      });
    } catch (error) {
      next(error);
    }
  },

  deleteProduct: async (req, resp, next) => {
    const { productId } = req.params;
    const { body: product } = req;
    product.dataEntry = new Date();

    const checkProduct = await productsService.getProduct({ productId });
    if (!checkProduct) {
      return next(404);
    }

    try {
      const productDelete = await productsService.deleteProduct({ productId });
      resp.status(200).json({
        _id: productDelete.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        type: product.type,
        date: product.dataEntry,
        message: 'product delete',
      });
    } catch (error) {
      next(error);
    }
  },
};
