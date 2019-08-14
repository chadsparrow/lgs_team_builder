module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001'
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/styles/utils.scss";`
      }
    }
  }
};
