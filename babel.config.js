module.exports = api => {
    return {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current'}}, '@babel/preset-typescript']
        ]
    };
}