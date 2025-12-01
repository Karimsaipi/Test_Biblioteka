const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
require("dotenv").config();

module.exports = (env) => {
    return {
        mode: env.mode ?? "development",
        entry: {
            index: path.resolve(__dirname, "src", "index.tsx"),
        },
        output: {
            path: path.resolve(__dirname, "build"),
            filename: "[name].[contenthash].js",
            publicPath: '/', 
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                filename: "index.html",
                template: path.resolve(__dirname, "public", "index.html"),
                chunks: ["index"],
                publicPath: '/', 
            }),
            new webpack.ProgressPlugin(),
            new MiniCssExtractPlugin(),
            new webpack.DefinePlugin({
                __PLATFORM__: JSON.stringify(process.env.PLATFORM || "desktop"),
                "process.env.API_URL": JSON.stringify(process.env.API_URL || ""),
                "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
            }),
            new ForkTsCheckerWebpackPlugin(),
            new ReactRefreshWebpackPlugin(),
        ],
        module: {
            rules: [
                {
                    test: /\.module\.s[ac]ss$/i,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: { publicPath: '/' }, 
                        },
                        {
                            loader: "css-loader",
                            options: {
                                modules: {
                                    localIdentName: "[name]__[local]__[hash:base64:5]",
                                },
                                esModule: false,
                            },
                        },
                        "sass-loader",
                    ],
                },
                {
                    test: /\.s[ac]ss$/i,
                    exclude: /\.module\.s[ac]ss$/i,
                    use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
                },
                {
                    test: /\.css$/i,
                    use: [
                        {
                        loader: MiniCssExtractPlugin.loader,
                        options: { publicPath: "/" },
                        },
                        {
                        loader: "css-loader",
                        options: { esModule: false },
                        },
                    ],
                },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                transpileOnly: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: "asset/resource",
                },
                {
                    test: /\.(woff2?|ttf|eot|otf)$/i,
                    type: "asset/resource",
                    generator: {
                        filename: "fonts/[name][hash][ext][query]",
                    },
                },
            ],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
        },
        devtool: "inline-source-map",
        devServer: {
            historyApiFallback: true,
            port: env.port ?? 3001, // фронт на 3001
            host: "0.0.0.0",
            allowedHosts: "all",
            open: true,
            hot: true,
            proxy: [
                {
                    context: ["/api"],
                    target: "http://192.168.68.101:3000",
                    changeOrigin: true,
                },
                {
                    context: ["/uploads"],
                    target: "http://192.168.68.101:3000",
                    changeOrigin: true,
                },
            ],
        },
    };
};

console.log("WEBPACK DIR:", __dirname);
