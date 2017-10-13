# Brigrid
A simple, powerful and fully customizable SASS grid system.
Inspired by [Neat](https://github.com/thoughtbot/neat), [Gridle](https://github.com/Coffeekraken/gridle) and  [Bootstrap](https://github.com/twbs/bootstrap)

## Table of content
1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Documentation](#documentation)
    1. [Configuration](#configuration)
        - [Grid maps](#grid-maps)
        - [Media maps](#media-maps)
    2. [Functions](#functions)
        - [get-grid-value](#get-grid-value)
        - [set-grid-value](#set-grid-value)
        - [prepare-grid](#prepare-grid)
    3. [Components](#components)
        - [outer-container](#outer-container)
        - [grid-collapse](#grid-collapse)
        - [grid-container-align](#grid-container-align)
        - [grid-container](#grid-container)
        - [grid-column-width](#grid-column-width)
        - [grid-column-align](#grid-column-align)
        - [grid-column-gutter](#grid-column-gutter)
        - [grid-column-order](#grid-column-order)
        - [grid-column](#grid-column)
        - [grid-push](#grid-push)
        - [grid-shift](#grid-shift)
    4. [Helpers](#helpers)
        - [media-breakpoint-before](#media-breakpoint-before)
        - [media-breakpoint-from](#media-breakpoint-from)
        - [media-breakpoint-between](#media-breakpoint-between)
        - [media-breakpoint-only](#media-breakpoint-only)

## Requirements
- [Sass](https://github.com/sass/sass) 3.4+ or [LibSass](https://github.com/sass/libsass) 3.3+
- Also I strongly recommend using [css-mqpacker](https://github.com/hail2u/node-css-mqpacker) and [autoprefixer](https://github.com/postcss/autoprefixer) to generate beautiful output CSS code

## Installation
### Installing with npm and using a Node-based asset pipeline:
1. Add Brigrid as a dev dependency:
    ```bash
    npm install --save-dev brigrid
    ```
2. Require includePaths of the Brigrid:
    ```js
    var brigridPaths = require("brigrid").includePaths;
    ```
3. Pass this array of directories to node-sass. Webpack example:
     ```js
    var brigridPaths = require("brigrid").includePaths;
    module.exports = {
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: { includePaths: brigridPaths }
                        }
                    ]
                }
            ]
        }
    };
    ```
4. Import Brigrid in your stylesheet:
    ```scss
    @import "brigrid";
    ```

## Documentation
### Configuration
To generate CSS properties, all components in Brigrid use `grid-map`, which defines the general grid settings. By default, all components use the global variable `$default-grid` as the `grid-map`. All the possible `grid-map` options are listed below.

#### Grid maps
| Key | Type | Default | Description |
|------------------|------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `driver` | `String` (`flex` or `float`) | `flex` | The driver that will be used to build the grid. |
| `columns` | `Number (unitless)` | `12` | The number of columns in the grid. |
| `gutter` | `Number (with unit)` or [`Media-map`](#media-maps) | `20px` | The grid gutter width beetween columns. |
| `align-x` | `String` or [`Media-map`](#media-maps) | `left` | Specifies the horizontal alignment of the columns (Supported only in `flex` driver). Possible values: `null`, `flex-start`, `flex-end`, `left`, `right`, `center`, `baseline`, `stretch`, `auto` |
| `align-y` | `String` or [`Media-map`](#media-maps) | `top` | Specifies the vertical alignment of the columns (Supported only in `flex` driver). Possible values: `null`, `flex-start`, `flex-end`, `top`, `bottom`, `center`, `baseline`, `stretch`, `auto` |
| `reversed` | `Boolean` | `false` | Defines the reverse order of the elements in the grid. |
| `collapse` | `Boolean` | `false` | Defines the grid collapse by consuming the gutters of its container, for use in nested layouts. |
| `breakpoints` | `Map` | `(xs:0, sm:576px, md:768px, lg:992px, xl:1200px, xx:1600px)` | The breakpoints of the grid, where each key is the name of the breakpoint, and the value is its minimum width. |
| `container-widths` | `Number (with unit)` or [`Media-map`](#media-maps) | `(sm:576px, md:768px, lg:960px, xl:1170px,  xx:1400px)` | Maximum width of the outer container for each breakpoint. |

You can override the `$default-grid` by assigning it a map, where each key-value pair replaces the default settings. For all non-overridden keys, the standard values will be used.
##### Example SCSS:
```scss
$default-grid: prepare-grid((
    driver: float,
    columns: 16
));
.element {
    @include grid-container(); // By default, $default-grid will be used
}
```

Alternatively, you can create custom `grid-map`, prepare it with the function [`prepare-grid`](#prepare-grid) and pass it to components via the `$grid` argument.
##### Example SCSS:
```scss
$my-grid: prepare-grid((
    driver: float,
    columns: 16
));
.element {
    @include grid-container(
        $grid: $my-grid
    );
}
```

#### Media maps
For some grid settings you can set a dynamic value that will change for each breakpoint specified. Such values are called `media-maps` and are defined by the SASS map, each key of which is the breakpoint name, and the value specifies the state for this breakpoint.

##### Example SCSS:
```scss
$example-grid: prepare-grid((
    align-x: (
        md: left,
        lg: center,
        xl: right
    ),
    align-y: (
        md: top,
        lg: center,
        xl: bottom
    ),
    gutter: (
        md: 10px,
        lg: 20px,
        xl: 30px
    ),
));
.element {
    @include grid-container(
        $grid: $example-grid
    );
}
```
##### Output CSS:
```scss
.element {
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: row;
}
@media only screen and (min-width: 992px) {
    .element {
        justify-content: center;
        align-items: center;
    }
}
@media only screen and (min-width: 1200px) {
    .element {
        justify-content: flex-end;
        align-items: flex-end;
    }
}
```

### Functions
#### `get-grid-value`
Returns the value of the requested key in the `grid-map`. If there is no value for the required key in `grid-map`, the function will return the default value.
##### Arguments
| Name | Type | Default | Description |
|--------------------|-------|---------------|--------------------------------------------------------------------------------------------------------|
| `key` | `String` | - | Requested key of the [`grid-map`](#grid-maps)   |
| `grid` | [`Grid-map`](#grid-maps) | `$default-grid` | `grid-map` in which the requested key will be searched. |

##### Example SCSS:
```scss
$example-grid: prepare-grid((
    driver: flex,
    columns: 16,
));

@debug get-grid-value(driver, $example-grid); // > flex
@debug get-grid-value(columns, $example-grid); // > 16
@debug get-grid-value(align-x, $example-grid); // > left (returns the default value)
```

---

#### `set-grid-value`
Sets the value for the key in the `grid-map`.
##### Arguments
| Name | Type | Default | Description |
|--------------------|-------|---------------|--------------------------------------------------------------------------------------------------------|
| `key` | `String` | - | The key for which the value will be set |
| `value` | `String` | - | The value that will be set for the key  |
| `grid` | [`Grid-map`](#grid-maps) | `$default-grid` | `grid-map` in which the value for the key will be set. |

##### Example SCSS:
```scss
$example-grid: prepare-grid((
    driver: flex,
    columns: 16,
));

$example-grid: set-grid-value(columns, 14,  $example-grid);
$example-grid: set-grid-value(align-x, center, $example-grid);

@debug $example-grid;
// > ( 
//      driver: flex,
//      columns: 14,
//      breakpoints: ( // the default value is used
//          xs: 0,
//          sm: 576px,
//          md: 768px,
//          lg: 992px,
//          xl: 1200px,
//          xx: 1600px
//      ),
//      _breakpoints-sorting: min, // automatically created by sorting function
//      align-x: center
//   )
```

---

#### `prepare-grid`
Prepares a `grid-map` for use in components, helpers and functions (sorts breakpoints).
##### Arguments
| Name | Type | Default | Description |
|--------------------|-------|---------------|--------------------------------------------------------------------------------------------------------|
| `grid` | [`Grid-map`](#grid-maps) | `$default-grid` | `grid-map` which will be prepared. |

##### Example SCSS:
```scss
$example-grid: prepare-grid((
    driver: float,
    columns: 12,
    breakpoints: (
        xx: 1600px,
        sm: 576px,
        lg: 992px,
        md: 768px,
        xs: 0,
        xl: 1200px
    ),
));

@debug $example-grid;
// > (
//     driver: float,
//     columns: 12,
//     breakpoints: (xs: 0, sm: 576px, md: 768px, lg: 992px, xl: 1200px, xx: 1600px),
//     _breakpoints-sorting: min
//   )
```

### Components
#### `outer-container`
Creates an outer container by centering it in the viewport and setting its max-width.
##### Arguments
| Name | Type | Default | Description |
|--------------------|-------|---------------|--------------------------------------------------------------------------------------------------------|
| `grid` | [`Grid-map`](#grid-maps) | `$default-grid` | The grid map settings (breakpoints, container-widths) will be used to create the outer container. |
| `breakpoints` | `Map` | `null` | The breakpoints will be used to create media queries |
| `container-widths` | `Number (with unit)` or [`Media-map`](#media-maps)| `null` | A media map where each of its keys points to a breakpoint and the value specifies the container width. |
##### Example SCSS:
```scss
$example-grid: prepare-grid((
    breakpoints: (
        xs: 0, // Extra small screen
        sm: 576px, // Small screen
        md: 768px, // Medium screen
        lg: 992px, // Large screen
        xl: 1200px, // Extra large screen
        xx: 1600px // Extra extra large screen
    ),
    container-widths: (
        md: 768px, // Medium screen
        lg: 960px, // Large screen
        xl: 1170px, // Extra large screen
        xx: 1400px // Extra extra large screen
    )
));
.element {
    @include outer-container($grid: $example-grid);
}
```
##### Output CSS:
```css
.element {
    margin-left: auto;
    margin-right: auto;
    box-sizing: border-box; 
    max-width: 768px;
}
@media only screen and (min-width: 992px) {
    .element {
        max-width: 960px;
    }
}
@media only screen and (min-width: 1200px) {
    .element {
        max-width: 1170px;
    }
}
@media only screen and (min-width: 1600px) {
    .element {
        max-width: 1400px;
    }
}
```

---

#### `grid-collapse`
Collapses grid container by consuming the gutters of its container, for use in nested layouts.
##### Arguments
| Name | Type | Default | Description |
|--------------------|-------|---------------|--------------------------------------------------------------------------------------------------------|
| `grid` | [`Grid-map`](#grid-maps) | `$default-grid` | The [`grid-map`](#grid-maps) settings (`gutter`, `breakpoints`) will be used to create the grid collapse. |
##### Example SCSS:
```scss
$example-grid: prepare-grid((
    gutter: (
        md: 20px,
        xl: 30px
    )
));
.element {
    @include grid-collapse(
        $grid: $example-grid
    );
}
```
##### Output CSS:
```css
.element {
    margin-left: -10px;
    margin-right: -10px;
}
@media only screen and (min-width: 1200px) {
    .element {
        margin-left: -15px;
        margin-right: -15px;
    }
}
```

---

#### `grid-container-align`
Creates grid columns alignment in container (Supported only in flex driver)
##### Arguments
| Name | Type | Default | Description |
|------------------|------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `align-x` | `String` or [`Media-map`](#media-maps) | `null` | Specifies the horizontal alignment of the columns. Possible values: `null`, `flex-start`, `flex-end`, `left`, `right`, `center`, `baseline`, `stretch`, `auto` |
| `align-y` | `String` or [`Media-map`](#media-maps) | `null` | Specifies the vertical alignment of the columns. Possible values: `null`, `flex-start`, `flex-end`, `top`, `bottom`, `center`, `baseline`, `stretch`, `auto`  |
| `grid` | [`Grid-map`](#grid-maps) | `$default-grid` | The [`grid-map`](#grid-maps) settings (`driver`, `breakpoints`) will be used to create an alignment of the container columns. |
##### Example SCSS:
```scss
$example-grid: prepare-grid((
    driver: flex,
    align-x: left, // will be ignored, because it uses align-x declared in grid-column-align
    align-y: top, // will be ignored, because it uses align-y declared in grid-column-align
    breakpoints: (
        xs: 0,
        sm: 576px,
        md: 768px,
        lg: 992px,
        xl: 1200px,
        xx: 1600px
    )
));
.element {
    @include grid-container-align(
        $align-x: (
            md: left,
            lg: center,
            xl: right
        ),
        $align-y: (
            md: top,
            lg: center,
            xl: bottom
        ),
        $grid: $example-grid
    );
}
```
##### Output CSS:
```css
.element {
    justify-content: flex-start;
    align-items: flex-start; 
}
@media only screen and (min-width: 992px) {
    .element {
        justify-content: center;
        align-items: center;
    }
}
@media only screen and (min-width: 1200px) {
    .element {
        justify-content: flex-end;
        align-items: flex-end;
    } 
}
```

---

#### `grid-container`
Creates a grid container.
##### Arguments
| Name | Type | Default | Description |
|--------------------|-------|---------------|--------------------------------------------------------------------------------------------------------|
| `grid` | [`Grid-map`](#grid-maps) | `$default-grid` | The [`grid-map`](#grid-maps) settings will be used to create the grid container. |
##### Example SCSS (Float driver):
```scss
$example-grid: prepare-grid((
    driver: float,
    breakpoints: (
        xs: 0,
        sm: 576px,
        md: 768px,
        lg: 992px,
        xl: 1200px,
        xx: 1600px
    ),
    align-x: ( // will be ignored, because alignment is not supported in float driver
        md: left,
        lg: center,
        xl: right
    ),
    align-y: ( // will be ignored, because alignment is not supported in float driver
        md: top,
        lg: center,
        xl: bottom
    ),
    gutter: (md: 10px, lg: 20px, xl: 30px),
    collapse: true
));
.element {
    @include grid-container(
        $grid: $example-grid
    );
}
```
##### Output CSS:
```css
.element {
    box-sizing: border-box;
    margin-left: -5px;
    margin-right: -5px;
}
.element::before, .element::after {
    display: table;
    content: "";
}
.element::after {
    clear: both;
}
@media only screen and (min-width: 992px) {
    .element {
        margin-left: -10px;
        margin-right: -10px;
    }
}
@media only screen and (min-width: 1200px) {
    .element {
        margin-left: -15px;
        margin-right: -15px;
    }
}
```
##### Example SCSS (Flex driver):
```scss
$example-grid: prepare-grid((
    driver: flex,
    breakpoints: (
        xs: 0,
        sm: 576px,
        md: 768px,
        lg: 992px,
        xl: 1200px,
        xx: 1600px
    ),
    align-x: (
        md: left,
        lg: center,
        xl: right
    ),
    align-y: (
        md: top,
        lg: center,
        xl: bottom
    ),
    gutter: (md: 10px, lg: 20px, xl: 30px),
    collapse: true
));
.element {
    @include grid-container(
        $grid: $example-grid
    );
}
```
##### Output CSS (Flex driver):
```css
.element {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    justify-content: flex-start;
    align-items: flex-start;
    margin-left: -5px;
    margin-right: -5px;
    flex-direction: row;
}
@media only screen and (min-width: 992px) {
    .element {
        justify-content: center;
        align-items: center;
        margin-left: -10px;
        margin-right: -10px;
    }
}
@media only screen and (min-width: 1200px) {
    .element {
        justify-content: flex-end;
        align-items: flex-end;
        margin-left: -15px;
        margin-right: -15px;
    }
}
```

---

#### `grid-column-width`
Sets column width properties based on the number of occupied columns and grid settings.
##### Arguments
| Name | Type | Default | Description |
|------------------|------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `columns` | `Number` (unitless) or `String` (`hide` or `hidden`) or [`Media-map`](#media-maps) | - | The number of columns that the item should occupy. |
| `grid` | [`Grid-map`](#grid-maps) | `$default-grid` | The [`grid-map`](#grid-maps) settings (`breakpoints`, `columns`, `driver`) will be used to generate a column width. |
##### Example SCSS:
```scss
$example-grid: prepare-grid((
    driver: flex,
    columns: 12,
    breakpoints: (
        xs: 0,
        sm: 576px,
        md: 768px,
        lg: 992px,
        xl: 1200px,
        xx: 1600px
    )
));
.element {
    @include grid-column-width(
        $columns: (
            sm: 12,
            lg: 6,
            xl: hidden
        ),
        $grid: $example-grid
    );
}
```
##### Output CSS:
```css
.element {
    display: block;
    max-width: 100%;
    width: 100%;
}
@media only screen and (min-width: 992px) {
    .element {
        display: block;
        max-width: 50%;
        width: 50%;
    }
}
@media only screen and (min-width: 1200px) {
    .element {
        display: none;
    }
}
```

---

#### `grid-column-align`
Creates column alignment (Supported only in flex driver)
##### Arguments
| Name | Type | Default | Description |
|------------------|------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `align-x` | `String` or [`Media-map`](#media-maps) | `null` | Specifies the horizontal alignment of the column. Possible values: `null`, `left`, `right`, `center` |
| `align-y` | `String` or [`Media-map`](#media-maps) | `null` | Specifies the vertical alignment of the column. Possible values: `null`, `flex-start`, `flex-end`, `top`, `bottom`, `center`, `baseline`, `stretch`, `auto` |
| `grid` | [`Grid-map`](#grid-maps) | `$default-grid` | The [`grid-map`](#grid-maps) settings (`driver`, `breakpoints`) will be used to create a column alignment. |
##### Example SCSS:
```scss
$example-grid: prepare-grid((
    driver: flex,
    breakpoints: (
        xs: 0,
        sm: 576px,
        md: 768px,
        lg: 992px,
        xl: 1200px,
        xx: 1600px
    )
));
.element {
    @include grid-column-align(
        $align-x: (
            md: left,
            lg: center,
            xl: right
        ),
        $align-y: (
            md: top,
            lg: center,
            xl: bottom
        ),
        $grid: $example-grid
    );
}
```
##### Output CSS:
```css
.element {
    margin-right: auto;
    margin-left: 0;
    align-self: flex-start;
}
@media only screen and (min-width: 992px) {
    .element {
        margin-left: auto;
        margin-right: auto;
        align-self: center;
    } 
}
@media only screen and (min-width: 1200px) {
    .element {
        margin-left: auto;
        margin-right: 0;
        align-self: flex-end;
    }
}
```

---

#### `grid-column-gutter`
Sets grid gutter width around column, ignoring the gutter property in grid map.
##### Arguments
| Name | Type | Default | Description |
|------------------|------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `gutter` | `Number` (with unit) or [`Media-map`](#media-maps) | `null` | Grid gutter width around column. |
| `grid` | [`Grid-map`](#grid-maps) | `$default-grid` | The [`grid-map`](#grid-maps) settings (`breakpoints`) will be used to generate a grid gutter width around column. |
##### Example SCSS:
```scss
$example-grid: prepare-grid((
    gutter: 50px, // will be ignored
    breakpoints: (
        xs: 0,
        sm: 576px,
        md: 768px,
        lg: 992px,
        xl: 1200px,
        xx: 1600px
    )
));
.element {
    @include grid-column-gutter(
        $gutter: (
            sm: 10px,
            lg: 20px,
            xl: 30px
        ),
        $grid: $example-grid
    );
}
```
##### Output CSS:
```css
.element {
    padding-left: 5px;
    padding-right: 5px;
}
@media only screen and (min-width: 992px) {
    .element {
        padding-left: 10px;
        padding-right: 10px;
    }
}
@media only screen and (min-width: 1200px) {
    .element {
        padding-left: 15px;
        padding-right: 15px;
    }
}
```

---

#### `grid-column-order`
Creates column order (Supports only in flex driver)
##### Arguments
| Name | Type | Default | Description |
|------------------|------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `order` | `Number` (unitless) or [`Media-map`](#media-maps) | `null` | Specifies the order of the column. |
| `grid` | [`Grid-map`](#grid-maps) | `$default-grid` | The [`grid-map`](#grid-maps) settings (`driver`, `breakpoints`) will be used to create a column order. |
##### Example SCSS:
```scss
$example-grid: prepare-grid((
    driver: flex,
    breakpoints: (
        xs: 0,
        sm: 576px,
        md: 768px,
        lg: 992px,
        xl: 1200px,
        xx: 1600px
    )
));
.element {
    @include grid-column-order((
        md: -1,
        lg: 0,
        xl: 1
    ));
}
```
##### Output CSS:
```css
.element {
    order: -1;
}
@media only screen and (min-width: 992px) {
    .element {
        order: 0;
    }
}
@media only screen and (min-width: 1200px) {
    .element {
        order: 1;
    }
}
```

---

#### `grid-column`
Creates a grid column based on the driver specified in the grid map.
##### Arguments
| Name | Type | Default | Description |
|------------------|------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `columns` | `Number` (unitless) or `String` (`hide` or `hidden`) or [`Media-map`](#media-maps) | - | The number of columns that the item should occupy. |
| `align-x` | `String` or [`Media-map`](#media-maps) | `null` | Specifies the horizontal alignment of the column. Possible values: `null`, `left`, `right`, `center` |
| `align-y` | `String` or [`Media-map`](#media-maps) | `null` | Specifies the vertical alignment of the column. Possible values: `null`, `flex-start`, `flex-end`, `top`, `bottom`, `center`, `baseline`, `stretch`, `auto` |
| `gutter` | `Number` (with unit) or [`Media-map`](#media-maps) | `null` | Grid gutter width around column. |
| `order` | `Number` (unitless) or [`Media-map`](#media-maps) | `null` | Specifies the order of the column. |
| `grid` | [`Grid-map`](#grid-maps) | `$default-grid` | The [`grid-map`](#grid-maps) settings will be used to create grid column. |
##### Example SCSS (Flex driver):
```scss
$example-grid: prepare-grid((
    driver: flex,
    columns: 12,
    gutter: 50px,
    breakpoints: (
        xs: 0,
        sm: 576px,
        md: 768px,
        lg: 992px,
        xl: 1200px,
        xx: 1600px
    )
));
.element {
    @include grid-column(
        $columns: (
            xs: 12,
            sm: 6,
            lg: 1,
            xx:hidden
        ),
        $align-x: (
            md: left,
            lg: center,
            xl: right
        ),
        $align-y: (
            md: top,
            lg: center,
            xl: bottom
        ),
        $gutter: (
            sm: 10px,
            lg: 20px,
            xl: 30px
        ),
        $order: (
            sm: -1,
            lg: 0,
            xl: 1
        ),
        $grid: $example-grid
    );
}
```
##### Example CSS (Flex driver):
```css
.element {
    box-sizing: border-box;
    display: block;
    max-width: 100%;
    width: 100%;
    min-height: 1px;
    padding-left: 5px;
    padding-right: 5px;
    margin-right: auto;
    margin-left: 0;
    align-self: flex-start;
    order: -1;
}
@media only screen and (min-width: 576px) {
    .element {
        display: block;
        max-width: 50%;
        width: 50%;
    }
}
@media only screen and (min-width: 992px) {
    .element {
        display: block;
        max-width: 8.33333%;
        width: 8.33333%;
        padding-left: 10px;
        padding-right: 10px;
        margin-left: auto;
        margin-right: auto;
        align-self: center;
        order: 0;
    }
}
@media only screen and (min-width: 1200px) {
    .element {
        padding-left: 15px;
        padding-right: 15px;
        margin-left: auto;
        margin-right: 0;
        align-self: flex-end;
        order: 1;
    }
}
@media only screen and (min-width: 1600px) {
    .element {
        display: none;
    }
}
```
##### Example SCSS (Float driver):
```scss
$example-grid: prepare-grid((
    driver: float,
    columns: 12,
    gutter: 50px,
    breakpoints: (
        xs: 0,
        sm: 576px,
        md: 768px,
        lg: 992px,
        xl: 1200px,
        xx: 1600px
    )
));
.element {
    @include grid-column(
        $columns: (xs: 12, sm: 6, lg: 1, xx:hidden),
        $align-x: (
            md: left,
            lg: center,
            xl: right
        ), // ! will be ignored because alignment is not supported in float driver!
        $align-y: (
            md: top,
            lg: center,
            xl: bottom
        ), // ! will be ignored because alignment is not supported in float driver!
        $gutter: (
            sm: 10px,
            lg: 20px,
            xl: 30px
        ),
        $order: (
            sm: -1,
            lg: 0,
            xl: 1
        ), // ! will be ignored because order is not supported in float driver!
        $grid: $example-grid
    );
}
```
##### Output CSS (Float driver):
```css
.element {
    box-sizing: border-box;
    display: block;
    width: 100%;
    min-height: 1px;
    padding-left: 5px;
    padding-right: 5px;
    float: left;
}
@media only screen and (min-width: 576px) {
    .element {
        display: block;
        width: 50%;
    }
}
@media only screen and (min-width: 992px) {
    .element {
        display: block;
        width: 8.33333%;
        padding-left: 10px;
        padding-right: 10px;
    }
}
@media only screen and (min-width: 1200px) {
    .element {
        padding-left: 15px;
        padding-right: 15px;
    }
}
@media only screen and (min-width: 1600px) {
    .element {
        display: none;
    }
}
```

---

#### `grid-push`
Push or pull a grid column by manipulating its left margin.
##### Arguments
| Name | Type | Default | Description |
|------------------|------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `columns` | `Number` (unitless) or `String` (`hide` or `hidden`) or [`Media-map`](#media-maps) | - | Specifies the number of columns to push the column. |
| `grid` | [`Grid-map`](#grid-maps) | `$default-grid` | The [`grid-map`](#grid-maps) settings (`breakpoints`, `columns`, `driver`) will be used to create a grid push. |
##### Example SCSS:
```scss
$example-grid: prepare-grid((
    driver: float,
    columns: 12,
    breakpoints: (
        xs: 0,
        sm: 576px,
        md: 768px,
        lg: 992px,
        xl: 1200px,
        xx: 1600px
    )
));
.element {
    @include grid-push(
        $columns: (md: 2, lg: 3, xl: 4),
        $grid: $example-grid
    );
}
```
##### Output CSS:
```css
.element {
    margin-left: 33.33333%;
}
@media screen and (max-width: 991px) {
    .element {
        margin-left: 16.66667%;
    }
}
@media screen and (min-width: 992px) and (max-width: 1199px) {
    .element {
        margin-left: 25%;
    }
}
```

---

#### `grid-shift`
Shifts columns and reorder them within their container using relative positioning.
##### Arguments
| Name | Type | Default | Description |
|------------------|------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `columns` | `Number` (unitless) or `String` (`hide` or `hidden`) or [`Media-map`](#media-maps) | - | Specifies the number of columns to shift the column. |
| `grid` | [`Grid-map`](#grid-maps) | `$default-grid` | The [`grid-map`](#grid-maps) settings (`breakpoints`, `columns`, `driver`) will be used to create a grid shift. |
##### Example SCSS:
```scss
$example-grid: prepare-grid((
    driver: float,
    columns: 12,
    breakpoints: (
        xs: 0,
        sm: 576px,
        md: 768px,
        lg: 992px,
        xl: 1200px,
        xx: 1600px
    )
));
.element {
    @include grid-shift(
        $columns: (md: 2, lg: 3, xl: 4),
        $grid: $example-grid
    );
}
```
##### Output CSS:
```css
.element {
    position: relative;
    left: 16.66667%;
}
@media only screen and (min-width: 992px) {
    .element {
       left: 25%;
    }
}
@media only screen and (min-width: 1200px) {
    .element {
        left: 33.33333%;
    }
}
```

### Helpers

#### `media-breakpoint-before`
Creates a media query before the breakpoint width and applies @content to it.
##### Arguments
| Name | Type | Default | Description |
|------------------|------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `bp-name` | `String` | - | The breakpoint name, which specifies the final width of the media query. |
| `grid` | [`Grid-map`](#grid-maps) | `$default-grid` | The [`grid-map`](#grid-maps) settings (`breakpoints`) will be used to create a media query. |
##### Example SCSS:
```scss
$example-grid: prepare-grid((
    breakpoints: (
        xs: 0, // Extra small screen
        sm: 576px, // Small screen
        md: 768px, // Medium screen
        lg: 992px, // Large screen
        xl: 1200px, // Extra large screen
        xx: 1600px // Extra extra large screen
    )
));
.element {
    display: block;
    @include media-breakpoint-before(sm, $grid: $example-grid) {
        display: none;
    }
}
```
##### Output CSS:
```css
.element {
    display: block;
}
@media only screen and (max-width: 575px) {
    .element {
        display: none;
    }
}
```

---

#### `media-breakpoint-from`
Creates a media query from the breakpoint width and applies @content to it.
##### Arguments
| Name | Type | Default | Description |
|------------------|------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `bp-name` | `String` | - | The breakpoint name, which specifies the starting width of the media query. |
| `grid` | [`Grid-map`](#grid-maps) | `$default-grid` | The [`grid-map`](#grid-maps) settings (`breakpoints`) will be used to create a media query. |
##### Example SCSS:
```scss
$example-grid: prepare-grid((
    breakpoints: (
        xs: 0, // Extra small screen
        sm: 576px, // Small screen
        md: 768px, // Medium screen
        lg: 992px, // Large screen
        xl: 1200px, // Extra large screen
        xx: 1600px // Extra extra large screen
    )
));
.element {
    display: block;
    @include media-breakpoint-from(sm) {
        display: none;
    }
}
```
##### Output CSS:
```css
.element {
    display: block;
}
@media only screen and (min-width: 576px) {
    .element {
        display: none;
    }
}
```

---

#### `media-breakpoint-between`
Creates a media query that spans multiple breakpoint widths and applies @content to it.
##### Arguments
| Name | Type | Default | Description |
|------------------|------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `from` | `String` | - | The breakpoint name, which specifies the starting width of the media query. |
| `to` | `String` | - | The breakpoint name, which specifies the final width of the media query. |
| `grid` | [`Grid-map`](#grid-maps) | `$default-grid` | The [`grid-map`](#grid-maps) settings (`breakpoints`) will be used to create a media query. |
##### Example SCSS:
```scss
$example-grid: prepare-grid((
    breakpoints: (
        xs: 0, // Extra small screen
        sm: 576px, // Small screen
        md: 768px, // Medium screen
        lg: 992px, // Large screen
        xl: 1200px, // Extra large screen
        xx: 1600px // Extra extra large screen
    )
));
.element {
    display: block;
    @include media-breakpoint-between($from: sm, $to: lg, $grid: $example-grid) {
        display: none;
    }
}
```
##### Output CSS:
```css
.element {
    display: block;
}
@media only screen and (min-width: 576px) and (max-width: 991px) {
    .element {
        display: none;
    }
}
```

---

#### `media-breakpoint-only`
Creates a media query between the breakpoint's minimum and maximum widths and applies @content to it.
##### Arguments
| Name | Type | Default | Description |
|------------------|------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `bp-name` | `String` | - | The breakpoint name, the minimum and maximum width of which will be used to create a media query. |
| `grid` | [`Grid-map`](#grid-maps) | `$default-grid` | The [`grid-map`](#grid-maps) settings (`breakpoints`) will be used to create a media query. |
##### Example SCSS:
```scss
$example-grid: prepare-grid((
    breakpoints: (
        xs: 0, // Extra small screen
        sm: 576px, // Small screen
        md: 768px, // Medium screen
        lg: 992px, // Large screen
        xl: 1200px, // Extra large screen
        xx: 1600px // Extra extra large screen
    )
));
.element {
    display: block;
    @include media-breakpoint-only(sm, $grid: $example-grid) {
        display: none;
    }
}
```
##### Output CSS:
```css
.element {
    display: block;
}
@media screen and (min-width: 576px) and (max-width: 767px) {
    .element {
        display: none;
    }
}
```
