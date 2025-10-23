const { register, login, getMe } = require('../controllers/authController');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      jwt.sign.mockReturnValue('mockToken');

      const mockUser = {
        _id: 'userId123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        save: jest.fn().mockResolvedValue(true)
      };

      User.mockImplementation(() => mockUser);

      await register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        msg: "User registered",
        token: 'mockToken',
        user: {
          id: 'userId123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user'
        }
      });
    });

    it('should return error if required fields are missing', async () => {
      req.body = { email: 'test@example.com' };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Please fill all fields'
      });
    });

    it('should return error if user already exists', async () => {
      req.body = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue({ email: 'existing@example.com' });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Email already in use'
      });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        _id: 'userId123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken');

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(res.json).toHaveBeenCalledWith({
        msg: "Login success",
        token: 'mockToken',
        user: {
          id: 'userId123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user'
        }
      });
    });

    it('should return error for invalid credentials', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      User.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Invalid credentials'
      });
    });
  });

  describe('getMe', () => {
    it('should return user data successfully', async () => {
      req.user = { id: 'userId123' };

      const mockUser = {
        _id: 'userId123',
        name: 'Test User',
        email: 'test@example.com'
      };

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await getMe(req, res);

      expect(User.findById).toHaveBeenCalledWith('userId123');
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should handle server error', async () => {
      req.user = { id: 'userId123' };

      User.findById.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      await getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        msg: "Error fetching user", 
        error: "Database error" 
      });
    });
  });
});