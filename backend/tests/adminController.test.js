const { getAllUsers, createUser } = require('../controllers/adminController');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Mock dependencies
jest.mock('../models/User');
jest.mock('bcryptjs');

describe('AdminController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users successfully', async () => {
      const mockUsers = [
        {
          _id: 'user1',
          name: 'User 1',
          email: 'user1@example.com',
          role: 'user'
        },
        {
          _id: 'user2',
          name: 'User 2',
          email: 'user2@example.com',
          role: 'entreprise'
        }
      ];

      User.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUsers)
      });

      await getAllUsers(req, res);

      expect(User.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle server error', async () => {
      const error = new Error('Database error');
      
      User.find.mockReturnValue({
        select: jest.fn().mockRejectedValue(error)
      });

      await getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Server error',
        error: 'Database error'
      });
    });
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      req.body = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'user'
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');

      const mockUser = {
        _id: 'newUserId',
        name: 'New User',
        email: 'newuser@example.com',
        role: 'user',
        save: jest.fn().mockResolvedValue(true)
      };

      User.mockImplementation(() => mockUser);

      // Mock the findById call for user response
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: 'newUserId',
          name: 'New User',
          email: 'newuser@example.com',
          role: 'user'
        })
      });

      await createUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'newuser@example.com' });
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        _id: 'newUserId',
        name: 'New User',
        email: 'newuser@example.com',
        role: 'user'
      });
    });

    it('should return error if required fields are missing', async () => {
      req.body = { email: 'test@example.com' };

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Please fill all required fields'
      });
    });

    it('should return error if user already exists', async () => {
      req.body = {
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue({ email: 'existing@example.com' });

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'User with this email already exists'
      });
    });

    it('should handle server error during user creation', async () => {
      req.body = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockRejectedValue(new Error('Bcrypt error'));

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Error creating user',
        error: 'Bcrypt error'
      });
    });
  });
});