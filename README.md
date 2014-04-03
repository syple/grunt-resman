# grunt-resman

> A HTML resource manager.

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-resman --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-resman');
```

## Resman Task

### Overview
_Run this task with the 'grunt resman' command._

Resman is a tool to help manage shared resource references (Javascript, CSS) across multiple pages.

_For example:_

```html
<!DOCTYPE html>
<html>
<head>
    <title></title>

    <!-- build:css css/shared.css -->
    <link rel="stylesheet" href="./css/main.css" />
    <link rel="stylesheet" href="./css/module-one.css" />
    <link rel="stylesheet" href="./css/module-two.css" />
    <!-- endbuild -->

</head>
<body>

    <!-- build:js scripts/shared.js -->
    <script type="text/javascript" src="./js/module-one.js"></script>
    <script type="text/javascript" src="./js/app.js"></script>
    <script type="text/javascript" src="./js/module-two.js"></script>
    <script type="text/javascript" src="./js/util.js"></script>
    <!-- endbuild -->

</body>
</html>
```

If these blocks are required across multiple pages, it becomes difficult to maintain for large projects.

### Options

#### resourceFileSrc
Type: `String`

The location of the [resource file](#resource-file).

#### endIdentifier
Type: `String`

The closing tag identifier for all [resource blocks](#resource-block) that _**don't**_ have their own _**endIdentifier**_ declared. It doesn't need to adhere to any naming standards.

### Usage Examples

#### Output
Refer to the [Resource Block](#resource-block) section

#### Single File
If no dest is specified, then all source files will be updated/overwritten.

```js
grunt.initConfig({
  resman: {
    single: {
      options: {
        resourceFileSrc: './resman-resource.json'
      },
      src: './pages/index.html'
    }
  },
});
```

#### Multiple Files
This will create a copy of the source files and place them in the **_'tmp'_** directory.

```js
grunt.initConfig({
  resman: {
    options: {
      resourceFileSrc: './resman-resource.json'
    },
    multiple: {
      files: [{
        dest: './tmp/',
          src: ['./pages/*.html'],
          expand: true
      }]
    }
  },
});
```
<a name="resource-file"></a>
## Resource File
_Resman requires a resource file, in JSON format._

This is used to map HTML comment blocks within a page to the appropriate resources.

_For example:_

```JSON
{
    "resourceBlocks": [
        {
            "type": "js",
            "beginIdentifier": "build:js scripts/shared.js",
            "endIdentifier": "endbuild",
            "resources": [
                "./js/app.js",
                "./js/util.js",
                "./js/module-one.js",
                "./js/module-two.js"
            ]
        },
        {
            "type": "css",
            "beginIdentifier": "build:css css/shared.css",
            "endIdentifier": "endbuild",
            "resources": [
                "./css/module-two.css",
                "./css/main.css",
                "./css/module-one.css"
            ]
        }
    ]
}
```

### Resource Block<a name="resource-block"></a>

The resource file must contain a list of 'block' objects. These make up the 'resourceBlocks' array and map to each comment block within each html page:

_For example:_

**HTML**
```html
<!-- build:js scripts/shared.js -->
<!-- endbuild -->
```

** RESOURCE FILE **
```json
{
    "type": "js",
    "beginIdentifier": "build:js scripts/shared.js",
    "endIdentifier": "endbuild",
    "resources": [
        "./js/app.js",
        "./js/util.js",
        "./js/module-one.js",
        "./js/module-two.js"
    ]
}
```

In the above example, the resources declared within the the JSON block will be injected into the comment block.

_Output:_

** HTML**
```html
<!-- build:js scripts/shared.js -->
<script type="text/javascript" src="./js/app.js"></script>
<script type="text/javascript" src="./js/util.js"></script>
<script type="text/javascript" src="./js/module-one.js"></script>
<script type="text/javascript" src="./js/module-two.js"></script>
<!-- endbuild -->
```

### Resource Block Required Values

#### type
Type: `String`
Default value: `js`
Values: `js`, `css`

The type of comment block. This is used to determine what type of resource to generate.

#### beginIdentifier
Type: `String`

The opening tag identifier for the resource block. It doesn't need to adhere to any naming standards.

#### endIdentifier
Type: `String`

The closing tag identifier for the resource block. This will override the option level value. It doesn't need to adhere to any naming standards.

#### resources
Type: `Array`

A list of all resource URIs that will be included in the resource block.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* v0.1.0 - Released to NPM
* v0.1.1 - Fixed a critical bug which prevented the task from functioning correctly.
