/**
 * User Repository
 * Handles all User-related database operations
 * Extends BaseRepository for common CRUD operations
 */

const BaseRepository = require('./baseRepository');
const { User } = require('@models');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /**
   * Find user by username
   */
  async findByUsername(username) {
    const user = await this.model.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Check if phone number exists
   */
  async phoneExists(phone) {
    return await this.model.exists({ phone });
  }

  /**
   * Find active users only
   */
  async findActiveUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const users = await this.model
      .find({ status: 'active' })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.model.countDocuments({ status: 'active' });

    return {
      documents: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find users by status
   */
  async findByStatus(status, page = 1, limit = 10) {
    return await this.findByFilter({ status }, page, limit);
  }

  /**
   * Change user status
   */
  async changeStatus(userId, status) {
    return await this.update(userId, { status });
  }

  /**
   * Search users by username or phone
   */
  async search(query, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const searchFilter = {
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
      ],
    };

    const users = await this.model
      .find(searchFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.model.countDocuments(searchFilter);

    return {
      documents: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = UserRepository;
