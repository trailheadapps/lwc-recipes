/**
 * Utility function to load a JS file via a script tag.
 *
 * This workaround is implemented to get around a limitation of the Lightning Locker library in LWR sites.
 * Read more about it in the "Lightning Locker Limitations" section of the documentation
 * https://developer.salesforce.com/docs/atlas.en-us.exp_cloud_lwr.meta/exp_cloud_lwr/template_limitations.htm
 */
export function loadScript(ctx, url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.charset = 'utf-8';
        script.type = 'text/javascript';
        document.head.appendChild(script);
        script.addEventListener('load', resolve);
        script.addEventListener('error', reject);
    });
}
