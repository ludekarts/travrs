// Helper library for creating DOM structures from string templates.
// by Wojciech Ludwin, @ludekarts, ludekarts@gmail.com

let insertCache = {};

const uid = () => (+new Date).toString(32);

export const createElement = (phrase, content) => {

  // Filter attributes.
  let attrs = phrase.match(/[\w-:]+=".+?"/g);
  if (attrs) attrs = attrs.map(match => match.replace(/"/g,"").split("="));

  // Filter id, type & classes.
  let head = ~phrase.indexOf("[") ? phrase.slice(0, phrase.indexOf("[")) : phrase;
  let id, classes = ~head.indexOf(".") ? head.split(".") : [head], type = classes[0];

  // Separate classes.
  if (classes.length > 0)
  classes = classes.slice(1, classes.length).join(" ");

  if (~type.indexOf("#")) [type, id] = type.split("#");

  // Create element.
  const element = document.createElement(type);

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

const getIndex = (str) => {
  const match = str.match(/^\s+/);
  return match ? match[0].length/2 : 0;
};

const parentIndex = (array, index, id) => {
  for (let i = index; i >= 0; i--) {
    if (getIndex(array[i]) < id) {
      return i;
    }
  }
  return -1;
};

const create = (id, refs, cache = {}) => {
  const insert = id.trim().match(/%\{(.*?)\}%/);
  if (insert) return cache[insert[1]];
  const reference = id.trim().match(/@([\w-_\.]+::)/);
  id = reference ? id.slice(id.indexOf("::") + 2, id.length) : id;
  const parentMarker = id.indexOf(">");
  const type = (parentMarker > -1) ? id.slice(0, parentMarker) : id;
  const textContent = id.match(/> "(.+)"/);
  const element = createElement(type.trim(), textContent ? textContent[1] : undefined);
  reference && (refs[reference[0].slice(1,-2)] = element);
  return element;
};

const travrs = (lines) => {
  const refs = {};
  const wrapper = create("root");
  lines
    .map((el, index) => ({
      id: index,
      type: el.trim(),
      parent: parentIndex(lines, index-1, getIndex(el)),
      element: create(el, refs, insertCache)
    }))
    .forEach((node, index, lines) =>
      node.parent === -1
      ? wrapper.appendChild(node.element)
      : lines[node.parent].element.appendChild(node.element)
    );

  insertCache = {};

  return Object.keys(refs).length > 0
    ? [wrapper.firstChild, refs]
    : wrapper.firstChild;
};

export const template = templateStr => {
  return travrs(templateStr.trim().split("\n"));
};

export const insert = node => {
  const id = uid();
  insertCache[id] = node;
  return `%{${id}}%`
};
