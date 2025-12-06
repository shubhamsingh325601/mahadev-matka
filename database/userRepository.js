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
   * Find user by email
   */
  async findByEmail(email) {
    const user = await this.model.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Check if email exists
   */
  async emailExists(email) {
    return await this.model.exists({ email });
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
   * Search users by name or email
   */
  async search(query, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const searchFilter = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
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
