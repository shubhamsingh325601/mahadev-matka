/**
 * Base Repository
 * Abstract repository with common database operations
 * All specific repositories should extend this
 */

class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  /**
   * Create a new document
   */
  async create(data) {
    const document = new this.model(data);
    return await document.save();
  }

  /**
   * Find a single document by filter
   * (Added to support uniqueness checks like phone/username)
   */
  async findOne(filter) {
    return await this.model.findOne(filter);
  }

  /**
   * Find all documents with pagination
   */
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const documents = await this.model
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.model.countDocuments();

    return {
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find document by ID
   */
  async findById(id) {
    const document = await this.model.findById(id);
    if (!document) {
      throw new Error(`${this.model.modelName} not found`);
    }
    return document;
  }

  /**
   * Find by custom filter
   */
  async findByFilter(filter, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const documents = await this.model
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.model.countDocuments(filter);

    return {
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update document by ID
   */
  async update(id, updateData) {
    const document = await this.model.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true },
    );

    if (!document) {
      throw new Error(`${this.model.modelName} not found`);
    }
    return document;
  }

  /**
   * Delete document by ID
   */
  async delete(id) {
    const document = await this.model.findByIdAndDelete(id);
    if (!document) {
      throw new Error(`${this.model.modelName} not found`);
    }
    return document;
  }

  /**
   * Alias for delete (to match Service layer calls)
   */
  async deleteById(id) {
    return await this.delete(id);
  }

  /**
   * Delete multiple documents
   */
  async deleteMany(filter) {
    return await this.model.deleteMany(filter);
  }

  /**
   * Count documents
   */
  async count(filter = {}) {
    return await this.model.countDocuments(filter);
  }

  /**
   * Check if document exists
   */
  async exists(filter) {
    return await this.model.exists(filter);
  }

  /**
   * Update many documents
   */
  async updateMany(filter, updateData) {
    return await this.model.updateMany(
      filter,
      { ...updateData, updatedAt: Date.now() },
    );
  }
}

module.exports = BaseRepository;