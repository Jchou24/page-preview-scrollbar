
configureWebpack = {
    externals: {
        "@vue/composition-api": "@vue/composition-api",
    }
}

let targetArgIndex = 0
process.argv.forEach((val, index) => {
    if (val === "--target") {
        targetArgIndex = index + 1
    }
});

const isBuildLib = process.argv[targetArgIndex] === "lib"

module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "https://jchou24.github.io/Demos/PagePreviewScrollbar/" : "/",
    configureWebpack: process.env.NODE_ENV === "production" && isBuildLib ? configureWebpack : {}
}