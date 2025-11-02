declare module 'react-syntax-highlighter' {
    export const Prism: any;
    export const Light: any;
    // export const default: any;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism/*' {
    const style: any;
    export default style;
}

declare module 'react-syntax-highlighter/dist/cjs/styles/prism' {
    const styles: any;
    export = styles;
}

declare module 'react-syntax-highlighter/dist/cjs/languages/prism/*' {
    const lang: any;
    export = lang;
}