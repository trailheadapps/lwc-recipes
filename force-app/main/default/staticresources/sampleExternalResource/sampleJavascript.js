function manipulateDomFromLibrary(element) {
    // This is for example purposes. Static manipulation of the DOM
    // is discouraged, and should be done via using Lightning Web
    // Components templates.
    const div = document.createElement('div');
    div.setAttribute('class', 'blue');
    element.appendChild(div);
    const text = document.createTextNode('This is blue text');
    div.appendChild(text);
}
