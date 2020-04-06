export default class ReplaceFromUTM {
    constructor({
                    initial = null,
                    replacements = null,
                    prefixes = {phone: 'tel:', email: 'mailto:'},
                    source = new URLSearchParams(location.search).get('utm_source')
                } = {}) {
        Object.assign(this, {initial, replacements, prefixes, source});
        ['initial', 'replacements'].forEach(key => {
            if (!this[key]) throw `Empty replacement data: ${key}`;
        });
        document.addEventListener("DOMContentLoaded", this.initReplacement.bind(this));
    }

    initReplacement() {
        const {initial, replacements, prefixes, source} = this;
        if (!source || !replacements[source]) return console.log(`Source not handled: ${source}`);
        const replacement = replacements[source];
        Object.keys(replacement).forEach(field => {
            if (!initial[field]) return console.warn(`Field not initialized: ${field}`);
            const prefix = (prefixes && prefixes[field]) ? prefixes[field] : '';
            document.querySelectorAll(`a[href="${prefix + initial[field]}"]`)
                .forEach(node => (node.href = prefix + replacement[field]) &&
                    this.replaceTextNodeRecursive(node, initial[field], replacement[field]));
        })
    }

    replaceTextNodeRecursive(node, search, replace) {
        if (node.childElementCount) node.childNodes.forEach(node => this.replaceTextNodeRecursive(node, search, replace));
        else if (node.textContent === search) node.textContent = replace;
    }
}