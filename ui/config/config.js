// config

const path = require('path');
import pageRoutes from './router.config'

const getPublishPath = function () {
    if (process.env.currVersion === "dev") {
        return '/'
    } else if (process.env.currVersion === "pub") {
        return '/'
    }
}

export default {
    ignoreMomentLocale: true,
    theme: {
        'card-actions-background': '#f5f8fa',
    },
    outputPath: './dist',
    plugins: [[
        'umi-plugin-react',
        {
            antd: true,
            dva: {
                hmr: true,
            },
            locale: {
                enable: true,
                default: 'zh-CN',
                baseNavigator: false,
            },
            dynamicImport: {
                loadingComponent: './components/PageLoading/index',
            },
            polyfills: ['ie11'],

        }
    ]],
    routes: pageRoutes,
    define: {
        APP_TYPE: process.env.APP_TYPE || '',
    },
    publicPath: getPublishPath(),
    history: 'hash',
    proxy: {
        "/v1": {
            "target": "http://127.0.0.1:5000",
            "changeOrigin": true
        }
    }
};