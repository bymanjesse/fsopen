class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = 'NotFoundError';
    }
  }
  
class ValidationError extends Error {
constructor(message) {
    super(message);
    this.name = 'ValidationError';
}
}
  
class DuplicateError extends Error {
constructor(message) {
    super(message);
    this.name = 'DuplicateError';
}
}
  
  module.exports = { NotFoundError, ValidationError, DuplicateError };