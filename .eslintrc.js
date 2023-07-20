module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true
    },
    globals: {
      "Papa": "writable"
    },
    parserOptions: {
        "ecmaVersion": 2021,
        "sourceType": "script"
    },
    extends: [
        'eslint:recommended'    
    ]
};
