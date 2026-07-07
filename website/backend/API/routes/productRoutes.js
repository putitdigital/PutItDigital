const express = require('express'); 
    const router = express.Router(); 
    const productController = require('../controllers/productController');
    if(Product === 'user') {
      const { requireAuth } = require('../middleware/authMiddleware');

      router.post('/login', userController.login);
      router.post('/logout', userController.logout);
      router.post('/refresh-token', requireAuth, userController.refreshToken);
      router.get('/me', requireAuth, userController.getProfile);
    }

    router.get('/products', productController.getAllProducts);
    router.get('/products/:id', productController.getProductById);
    router.post('/products', productController.createProduct);
    router.put('/products/:id', productController.updateProduct);
    router.delete('/products/:id', productController.deleteProduct);

    module.exports = router;
