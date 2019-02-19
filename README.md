# travrs
Helper library for creating DOM structures from string templates.


## Instalation

#### With NPM
```
npm install -save travrs
```

#### With Browser
```
<script src="https://unpkg.com/travrs@1.0.0-alpha.3" charset="utf-8"></script>
```


## API

- **createElement(selector, children?)** - creates single DOM element. The *children* param can be eaither *innerHTML* or *HTMLElement*.
- **template(structure)** - creates DOM structure base on the string template.
- **include(element)** - inserts existing DOM element into specified place in template.


## Usage

#### Create element syntax
Travrs uses CSS-like abbreviation syntax for creating DOM nodes:

```
import {createElement} from "travrs";

const div = createElement("div#divId.classOne.classTwo[title="My Title" data-hello="world"]", "This is content");
```

Above code crates following div element:

```
<div id="divId" class="classOne classTwo" title="My Title" data-hello="world">
  This is content
</div>
```


#### Basic
Travrs uses indentation to detect parent-child relation between noeds:

```
import {template} from "travrs";

const element = template(`
  div.hello
    h2 > "Hello from Travrs!"  
`);

document.querySelector("body").appendChild(element);

```


#### With references
Using `@referenceName::` in your template you can retrive this *tagged* node from **template()** function:

```
import {template} from "travrs";

const [element, refs] = template(`
  div.hello
    h2 > "Hello from Travrs!"
    @subtitle::span > "I'm subtitle with reference."
`);

console.lod(refs.subtitle.textContent);
document.querySelector("body").appendChild(element);

```

#### With include()
Using `include()` in your template you can place existing node inside created structure:

```
import {template, createElement, insert} from "travrs";

const node = createElement("p", "Hello from insert node.");
const element = template(`
  div.hello
    h2 > "Hello from Travrs!"    
    ${insert(node)}
`);

document.querySelector("body").appendChild(element);

```
