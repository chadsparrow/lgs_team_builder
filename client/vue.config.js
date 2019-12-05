module.exports = {
  devServer: {
    //proxy: 'http://localhost:5001'
    //proxy: 'http://192.168.99.100:5001' // home docker machine

    proxy: {
      '/api/v1/*': {
        target: 'http://localhost:5001',
        changeOrigin: true
      },
      '/images': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
};
