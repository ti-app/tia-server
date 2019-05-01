class ResponseService {
  static unAuthorized() {
    return { message: 'UNAUTHORIZED' };
  }
}

module.exports = ResponseService;
