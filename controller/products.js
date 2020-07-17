const ProductsService = require('../services/productsService');
const { pagination } = require('./utils/pagination');

const productsService = new ProductsService();

module.exports = {
  getProducts: async (req, resp, next) => {
    const { tags } = req.query;
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    const skip = (limit * page) - limit;
    
    try {
      const products = await productsService.getProductsPag({ tags }, skip, limit);
      const totalProducts = await productsService.getProducts({ tags });
      const header = pagination('products', page, limit, totalProducts.length);
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
      console.log('response de getProduct', product)
      console.log('ogm',productId)
      if (product === null) {
        return next(404);
      }
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
    product.dateEntry = new Date();
    if (!req.body.name || !req.body.price) {
      return next(400);
    }

    try {
      const createProduct = await productsService.createProduct({ product });
       resp.status(200).json({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        type: product.type,
        date: product.dateEntry,
        message: 'product created',
      });
    } catch (error) {
      next(error);
    }
  },

  putProduct: async (req, resp, next) => {
    const { productId } = req.params;
    const { body: product } = req;
    product.dateEntry = new Date();

    if (!req.body.name && !req.body.price && !req.body.image && !req.body.type) {
      return next(400);
    }

    const validateProductId = await productsService.getProduct({productId});
    if (!validateProductId) {
      return next(404);
    }

    try {
      const updateProduct = await productsService.updateProduct({ productId, product });
      console.log(updateProduct)
      resp.status(200).json({
        id: updateProduct,
        name: product.name,
        price: product.price,
        image: product.image,
        type: product.type,
        date: product.dateEntry,
        message: 'product update',
      });
    } catch (error) {
      next(error);
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
      resp.status(200).json({
        id: productDelete,
        name: product.name,
        price: product.price,
        image: product.image,
        type: product.type,
        date: product.dateEntry,
        message: 'product delete',
      });
    } catch (error) {
      next(error);
    }
  },
};
