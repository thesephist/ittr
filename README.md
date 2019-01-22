# ittr

[![npm ittr](https://img.shields.io/npm/v/ittr.svg)](http://npm.im/ittr)
[![Build Status](https://travis-ci.com/thesephist/ittr.svg?branch=master)](https://travis-ci.com/thesephist/ittr)
[![gzip size](http://img.badgesize.io/https://unpkg.com/ittr/dist/index.min.js?compression=gzip)](https://unpkg.com/ittr/dist/index.min.js)

Small library of iterator-related utility functions for JavaScript.

**Documentation**: [GitHub Pages](https://thesephist.github.io/ittr/src/index.js.html).

Ittr doesn't try to be a comprehensive hub of all array methods -- there are lots of NPM libraries will do that very well. This is just a smaller collection of just the essential (by my definition of _essential_) array/iterator methods I've learned comes up very, very often in UI development, including many that aren't a part of the JavaScript standard.

## Features

- **Works with any JavaScript iterator, not just arrays**
- Nice API
- Tiny, simple to use
- Relatively fast, compared to native JavaScript array methods

## Usage

Import it with a `<script>` tag...

```html
<script src="https://unpkg.com/ittr/dist/index.min.js"></script>
```

... and you'll find all the API functions exposed under the `Ittr` global object.

You can also `npm install ittr`, which will allow you to use it in both Node.js and client-side projects.

Please see the [documentation](https://thesephist.github.io/ittr/src/index.js.html) for detailed API information.

