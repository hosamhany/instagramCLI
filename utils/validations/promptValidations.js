var schema = {
    properties: {
      username: {
        required: true
      },
      password: {
        hidden: true,
        required: true
      }
    }
  };

  module.exports = {
      schema
  }