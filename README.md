# Yeoman Blender

**Yeoman generator methods as mixins.**

*This module helps you organize your [Yeoman](http://yeoman.io/) generator code
by splitting methods into multiple modules, aka mixins. You can write generator's
prototype mixins (methods will run sequentially) or split methods by feature/option
and priority upon the [Yeoman queue system](http://yeoman.io/authoring/running-context.html).*

## Installation

```bash
$ npm i yeoman-blender
```

## Usage

```bash
# Move into your generator folder
$ cd /path/to/your/yeoman/generator

# Create the "flavors" folder into the "app" or subgenerator folder
$ mkdir app/flavors

# Split your generator features by flavor
$ mkdir -p app/flavors/{css,ui}

# Create modules to organize methods by priority
$ touch app/flavors/css/{initializing.js,prompting.js,writing.js}
$ touch app/flavors/ui/{initializing.js,prompting.js,writing.js}

```

Supported priorities are:

* `initializing` (example: `app/flavors/css/initializing.js`)
* `prompting` (example: `app/flavors/css/prompting.js`)
* `configuring` (example: `app/flavors/css/configuring.js`)
* `writing` (example: `app/flavors/css/writing.js`)
* `install` (example: `app/flavors/css/install.js`)
* `end` (example: `app/flavors/css/end.js`)

Write your generator methods inside these modules:

```js
// generator/app/flavors/css/writing.js
module.exports = {
  css: function() {
    this.copy('main.css', 'css/main.css');
  }
};
```

You can also define generator's prototype methods:

```js
// generator/app/helpers.js
module.exports = {
  sayHello: function() {
    this.log('Hello');
  }
};
```

Then in `generator/app/index.js`:

```js
'use strict';

var path    = require('path');
var yeoman  = require('yeoman-generator');
var blender = require('yeoman-blender')();

// Add generator methods (order counts)
blender.methods([
  require('./path/to/generator/app/mixins')
]);

// Add flavor directories (order counts)
blender.flavors([
  path.join(__dirname, 'features', 'base'),
  path.join(__dirname, 'features', 'css'),
  path.join(__dirname, 'features', 'ui')
]);

// Then call blend() to get the global mixin
module.exports = yeoman.generators.Base.extend(blender.blend());
```

## Example

Let's take an example. You need to write a generator that let the developer choose
between several CSS preprocessors (SASS, Less, Stylus, etc) and several UI frameworks
(Twitter Bootstrap, Foundation, SemanticUI, etc). Instead of having a big bloated
generator file, you can split this generator into two "flavors" (or "features"):
`css` and `ui`. You create a `flavors` folder into your `app` directory (or
subgenerator) and one folder per flavor:

```bash
generator/app/index.js
generator/app/templates/
generator/app/flavors/css/
generator/app/flavors/css/initializing.js
generator/app/flavors/css/prompting.js
generator/app/flavors/css/configuring.js
generator/app/flavors/css/writing.js
generator/app/flavors/ui/
generator/app/flavors/ui/initializing.js
generator/app/flavors/ui/prompting.js
generator/app/flavors/ui/writing.js
```

As you can see, each flavor folder contains modules named with Yeoman queue names
(or priorities). Each module exports a plain object with methods to invoke on that
given queue:

```js
// generator/app/flavors/css/writing.js
module.exports = {
  css: function() {
    this.copy('main.css', 'css/main.css');
  }
};
```

This module will be merged into the generator prototype like this:

```js
{
  writing: {
    css: function() {
      this.copy('main.css', 'css/main.css');
    }
  }
}
```

Flavors help you write modular code.

You add flavors with the `flavors()` method that takes an array of paths:

```js
blender.flavors([
  path.join(__dirname, 'flavors', 'base'),
  path.join(__dirname, 'flavors', 'css'),
  path.join(__dirname, 'flavors', 'ui')
]);
```

You can also add mixins that will be directly merged into the generator's prototype.
This can be useful for initialization or to define common helpers. These mixins
can be added with the `methods()` method that takes an array of mixins.

```js
blender.methods([
  require('./lib/init.js'),
  require('./lib/helpers.js')
]);
```

Once you setup your methods and flavors, you just need to call `blend()` to
retrieve the global mixin to give to Yeoman generator `extend()` method:

```js
var Generator = yeoman.generators.Base.extend(blender.blend());
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License).
