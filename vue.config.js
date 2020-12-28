
configureWebpack = {
    externals: {
        "@vue/composition-api": "@vue/composition-api",
    }
}

module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "https://jchou24.github.io/Demos/PagePreviewScrollbar/" : "/",
    configureWebpack: process.env.NODE_ENV === "production" ? configureWebpack : {}
}