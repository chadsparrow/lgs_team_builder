module.exports = {
  devServer: {
    proxy: {
      '^/api/*': {
        target: 'localhost:5001',
        ws: true,
        changeOrigin: true
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
