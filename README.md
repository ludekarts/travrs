# travrs
Helper library to for creating DOM structures from string templates


## Instalation

```
npm install -save travrs
```


## API

- **createElement(selector, children?)** (named import) - creates single DOM element.
- **template(structure)** (default import) - creates DOM structure base on the string template.


## Usage

#### Create element syntax
Travrs uses CSS-like abbreviation syntax for creating DOM nodes.
```
  const div = createElement('div#divId.classOne.classTwo[title="My Title" data-hello="world"]', 'This is content');
```


#### Basic
Travrs uses indentation to detect parent-child relation between noeds.

```
import template from "travrs";

const element = template(`
  div.hello
    h2 > "Hello from Travrs!"  
`);

document.querySelector("body").appendChild(element);

```


#### With references
Using `@referenceName::` in your template string you can retrive this *tagged* node from **template()** function:

```
import template from "travrs";

const [element, refs] = template(`
  div.hello
    h2 > "Hello from Travrs!"
    @subtitle::span > "I'm subtitle with reference."
`);

document.querySelector("body").appendChild(element);
console.lod(refs.subtitle.textContent);

```
