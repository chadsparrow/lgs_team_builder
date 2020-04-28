module.exports = {
  devServer: {
    //proxy: 'http://localhost:5000'
    //proxy: 'http://192.168.99.100:5000' // home docker machine

    proxy: {
      '/api/v1/*': {
        target: 'http://192.168.99.100:5000',
        changeOrigin: true,
      },
    },
  },
  outputDir: '../server/dist',
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/styles/_variables.scss";`,
      },
    },
  },
};
