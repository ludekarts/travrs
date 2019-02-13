// Helper library for creating DOM structures from string templates.
// by Wojciech Ludwin, @ludekarts, ludekarts@gmail.com

(function (root, factory) {
    // AMD.
    if (typeof define === "function" && define.amd) {
      define([], factory);
    }

    // CommonJS-like.
    else if (typeof module === "object" && module.exports) {
      module.exports = factory();
    }

    // Browser globals.
    else {
      root.travrs = factory();
    }
}(typeof self !== "undefined" ? self : this, function () {
    "use strict";

    var createElement = (phrase, content) => {
     // Filter attributes.
     var attrs = phrase.match(/[\w-:]+=".+?"/g);
     if (attrs) attrs = attrs.map(match => match.replace(/"/g,"").split("="));

     // Filter id, type & classes.
     var head = ~phrase.indexOf("[") ? phrase.slice(0, phrase.indexOf("[")) : phrase;
     var id, classes = ~head.indexOf(".") ? head.split(".") : [head], type = classes[0];

     // Separate classes.
     if (classes.length > 0)
       classes = classes.slice(1, classes.length).join(" ");

     if (~type.indexOf("#")) [type, id] = type.split("#");

     // Create element.
     var element = document.createElement(type);

     // Append id.
     if (id) element.id = id;

     // Append content.
     if (content) {
       if (typeof content === "string") {
         element.innerHTML = content ;
       }
       else if (content instanceof HTMLElement) {
         element.appendChild(content);
       }
     }

     // Append attributes.
     if (attrs) attrs.forEach(attribute => element.setAttribute(attribute[0], attribute[1]));

     // Append classes.
     if (classes) element.className = classes;

     return element;
    };

    var getIndex = (str) => {
     var match = str.match(/^\s+/);
     return match ? match[0].length/2 : 0;
    };

    var parentIndex = (array, index, id) => {
     for (var i = index; i >= 0; i--) {
       if (getIndex(array[i]) < id) {
         return i;
       }
     }
     return -1;
    };

    var create = (id, refs) => {
     var reference = id.trim().match(/@([\w-_\.]+::)/);
     id = reference ? id.slice(id.indexOf("::") + 2, id.length) : id;
     var parentMarker = id.indexOf(">");
     var type = (parentMarker > -1) ? id.slice(0, parentMarker) : id;
     var textContent = id.match(/> "(.+)"/);
     var element = createElement(type.trim(), textContent ? textContent[1] : undefined);
     reference && (refs[reference[0].slice(1,-2)] = element);
     return element;
    };

    var travrs = (lines) => {
     var refs = {};
     var wrapper = create("root");
     lines
       .map((el, index) => ({
           id: index,
           type: el.trim(),
           parent: parentIndex(lines, index-1, getIndex(el)),
           element: create(el, refs)
         }))
       .forEach((node, index, lines) =>
         node.parent === -1
           ? wrapper.appendChild(node.element)
           : lines[node.parent].element.appendChild(node.element)
       );

     return Object.keys(refs).length > 0
       ? [wrapper.firstChild, refs]
       : wrapper.firstChild;
    };

    var template = (templateStr) => travrs(templateStr.trim().split("\n"));

    return {
      template: template,
      createElement: createElement
    };
}));
