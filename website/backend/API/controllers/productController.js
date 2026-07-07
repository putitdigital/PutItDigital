const Product = require('../models/productModel');
    if(Product === 'user') {
      const bcrypt = require('bcrypt');
      const jwt = require('jsonwebtoken');

      const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';
      const jwtExpiresIn = '24h';
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      };
    }

exports.getAllProducts = (req, res) => {
  Product.getAllProducts((err, products) => {
    if (err) {
      console.error('[getAllProducts] Error:', err);
      return res.status(500).json({ 
        error: err.message || JSON.stringify(err),
        code: err.code,
        type: err.constructor.name
      });
    }
    res.status(200).json(products);
  });
};

exports.getProductById = (req, res) => {
  const id = req.params.id;
  Product.getProductById(id, (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  });
};

exports.createProduct = (req, res) => {
  const data = { ...req.body };

    if (!data.email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Check email uniqueness
    Product.findByEmail(data.email, (err, existing) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (existing) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        if (data.number !== undefined) {
            if (typeof data.number === 'number') {
                data.number = String(data.number);
            }
            if (typeof data.number !== 'string' || !/^[0-9]+$/.test(data.number)) {
                return res.status(400).json({ error: 'Invalid phone number: use digits only and send it as a string.' });
            }
            if (data.number.length > 20) {
                return res.status(400).json({ error: 'Phone number is too long. Use at most 20 digits.' });
            }
        }

        Product.createProduct(data, (err, userId) => {
            if (err) {
                if (err.message === 'Missing password') {
                    return res.status(400).json({ error: 'Password is required' });
                }
                if (err.code === 'ER_DATA_OUT_OF_RANGE' || /Out of range value for column 'number'/.test(err.message)) {
                    return res.status(400).json({ error: 'Phone number is too large for the database column. Change the users.number column to VARCHAR(20) or a suitable text type.' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: userId });
        });
    });
};

if(product === 'user') {

const generateAuthToken = (user) => {
  const payload = { id: user.id, email: user.email };
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
};

const sendLoginCookie = (res, token) => {
  res.cookie('auth_token', token, cookieOptions);
};

const clearLoginCookie = (res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  User.findByEmail(email, async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = generateAuthToken(user);
    sendLoginCookie(res, token);
    res.status(200).json({ message: 'Logged in successfully' });
  });
};

exports.logout = (req, res) => {
  clearLoginCookie(res);
  res.status(200).json({ message: 'Logged out successfully' });
};

exports.getProfile = (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  User.getUserById(userId, (userErr, user) => {
    if (userErr) return res.status(500).json({ error: userErr.message });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { password, ...profile } = user;
    res.status(200).json({ user: profile });
  });
};

exports.refreshToken = (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  User.getUserById(userId, (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = generateAuthToken(user);
    sendLoginCookie(res, token);
    res.status(200).json({ message: 'Token refreshed' });
  });
};
  }
exports.updateProduct = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  Product.updateProduct(id, data, (err, affectedRows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product updated successfully' });
  });
};

exports.deleteProduct = (req, res) => {
  const id = req.params.id;
  Product.deleteProduct(id, (err, affectedRows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  });
};
