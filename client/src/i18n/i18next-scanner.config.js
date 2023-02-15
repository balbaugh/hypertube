module.exports = {
    input: ['./src/**/*.jsx', './src/**/*.js'], // The files to scan for translation keys
    output: './src/i18n/$LOCALE/$NAMESPACE.json', // The output location and format
    options: {
        debug: true,
        removeUnusedKeys: true,
        sort: true,
        func: {
            list: ['t'], // The names of the translation functions to look for
            extensions: ['.js'], // The file extensions to include
        },
        trans: {
            component: 'Trans',
            i18nKey: 'i18nKey',
            extensions: ['.js', '.jsx'],
            fallbackKey: (ns, value) => value,
        },
        lngs: ['en', 'fi', 'es'], // The languages to output translations for
        ns: ['common'], // The namespaces to output translations for
        defaultLng: 'en', // The default language
        defaultNs: 'common', // The default namespace
    },
};
