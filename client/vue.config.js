module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.99.100:5001'
        // target: 'http://localhost:5001'
      }
    }
  }
};
