# Brigrid
A simple, powerful and fully customizable SASS grid system.
Inspired by [Neat](https://github.com/thoughtbot/neat), [Gridle](https://github.com/Coffeekraken/gridle) and  [Bootstrap](https://github.com/twbs/bootstrap)

## Table of content
1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Documentation](#documentation)
    1. [Configuration](#configuration)
    2.  [Default grid settings](#default-grid-settings)
    3.  [Media maps](#media-maps)
    4. [Components](#components)
        - [outer-container](#outer-container)
        - [grid-collapse](#grid-collapse)
        - [grid-container](#grid-container)
        - [grid-container-align](#grid-container-align)
        - [grid-column-align](#grid-column-align)
        - [grid-column-gutter](#grid-column-gutter)
        - [grid-column-width](#grid-column-width)
        - [grid-column](#grid-column)
        - [grid-push](#grid-push)
        - [grid-shift](#grid-shift)
    5. [Helpers](#helpers)
        - [media-breakpoint-before](#media-breakpoint-before)
        - [media-breakpoint-from](#media-breakpoint-from)
        - [media-breakpoint-between](#media-breakpoint-between)
        - [media-breakpoint-only](#media-breakpoint-only)

## Requirements
- [Sass](https://github.com/sass/sass) 3.4+ or [LibSass](https://github.com/sass/libsass) 3.3+

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
    @import "brigrid/brigrid";
    ```

## Documentation
### Configuration
By default, all mixines and functions in Brigrid use the global variable `$default-grid`, which defines all the default grid settings.
#### Default grid settings
| Key | Type | Default | Description |
|------------------|------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `driver` | `String` | `flex` | The driver that will be used to build the grid |
| `columns` | `Number (unitless)` | `12` | The number of columns in the grid |
| `gutter` | `Number (with unitless)` or `Map` | `20px` | The grid gutter width beetween columns. |
| `align-x` | `String` or `Map` | `left` | Specifies the horizontal alignment of the columns. (Supported only in `flex` driver) |
| `align-y` | `String` or `Map` | `top` | Specifies the vertical alignment of the columns (Supported only in `flex` driver)  |
| `reversed` | `Boolean` | `false` | Defines the reverse order of the elements in the grid |
| `collapse` | `Boolean` | `false` | Defines the grid collapse by consuming the gutters of its container, for use in nested layouts. |
| `breakpoints` | `Map` | `(xs:0, sm:576px, md:768px, lg:992px, xl:1200px, xx:1600px)` | The breakpoints of the grid, where each key is the name of the breakpoint, and the value is its minimum width |
| `container-widths` | `Map` | `(sm:576px, md:768px, lg:960px, xl:1170px,  xx:1400px)` | Maximum width of the outer container for each breakpoint. |

You can override the `$default-grid` by assigning it a map, where each key-value pair replaces the default settings. For all non-overridden keys, the standard values will be used.
Example:
```scss
$default-grid: (
    driver: float,
    columns: 16
);
.element {
    @include grid-container(); // By default, $default-grid will be used
}
```
#### Media maps
For keys `gutter`,` align-x` and `align-y` in your grid map, you can set a media-map, where each key is the breakpoint name, and the value specifies the state for this breakpoint. The media map allows you to set a dynamic value that will change at certain breakpoints using media queries.
##### Example SCSS:
```scss
$example-grid: (
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
);
.element {
    @include grid-container(
        $grid: $example-grid
    );
}
```
##### Output CSS:
```scss
.element {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    justify-content: flex-end;
    align-items: flex-end;
    flex-direction: row;
}
@media screen and (max-width: 991px) {
    .element {
        justify-content: flex-start;
        align-items: flex-start;
    }
}
@media screen and (min-width: 992px) and (max-width: 1199px) {
    .element {
        justify-content: center;
        align-items: center;
    }
}
```

### Components
#### `outer-container`
Creates an outer container by centering it in the viewport and setting its max-width.
##### Arguments
| Name | Type | Default | Description |
|--------------------|-------|---------------|--------------------------------------------------------------------------------------------------------|
| `grid` | `Map` | `$default-grid` | The grid map settings (breakpoints, container-widths) will be used to create the outer container. |
| `breakpoints` | `Map` | `null` | The breakpoints will be used to create media queries |
| `container-widths` | `Map` | `null` | A media map where each of its keys points to a breakpoint and the value specifies the container width. |
##### Example SCSS:
```scss
$example-grid {
    breakpoints: (
        xs: 0, // Extra small screen
        sm: 576px, // Small screen
        md: 768px, // Medium screen
        lg: 992px, // Large screen
        xl: 1200px, // Extra large screen
        xx: 1600px // Extra extra large screen
    ),
    container-widths: (
        sm: 576px, // Small screen
        md: 768px, // Medium screen
        lg: 960px, // Large screen
        xl: 1170px, // Extra large screen
        xx: 1400px // Extra extra large screen
    )
}
.outer-container {
    @include outer-container($grid: $example-grid);
}
```
##### Output CSS:
```css
.element {
    margin-left: auto;
    margin-right: auto;
    box-sizing: border-box;
    transition: max-width .12s ease;
    max-width: 100%;
}
@media screen and (min-width: 576px) {
    .element {
        max-width: 576px;
    }
}
@media screen and (min-width: 768px) {
    .element {
        max-width: 768px;
    }
}
@media screen and (min-width: 992px) {
    .element {
        max-width: 960px;
    }
}
@media screen and (min-width: 1200px) {
    .element {
        max-width: 1170px;
    }
}
@media screen and (min-width: 1600px) {
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
| `grid` | `Map` | `$default-grid` | The grid map settings (gutter, breakpoints) will be used to create the grid collapse. |
##### Example SCSS:
```scss
$example-grid: (
    gutter: 20px
);
.element {
    @include grid-collapse($example-grid);
}
```
##### Output CSS:
```css
.element {
    margin-left: -10px;
    margin-right: -10px;
}
```

---

#### `grid-container`
Creates a grid container.
##### Arguments
| Name | Type | Default | Description |
|--------------------|-------|---------------|--------------------------------------------------------------------------------------------------------|
| `grid` | `Map` | `$default-grid` | The grid map settings will be used to create the grid container. |
##### Example SCSS (Float driver):
```scss
$example-grid: (
    driver: float,
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
);
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
    margin-left: -15px;
    margin-right: -15px;
}
.element::before, .element::after {
    display: table;
    content: "";
}
.element::after {
    clear: both;
}
@media screen and (max-width: 991px) {
    .element {
        margin-left: -5px;
        margin-right: -5px;
    }
}
@media screen and (min-width: 992px) and (max-width: 1199px) {
    .element {
        margin-left: -10px;
        margin-right: -10px;
    }
}
```
##### Example SCSS (Flex driver):
```scss
$example-grid: (
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
);
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
    justify-content: flex-end;
    align-items: flex-end;
    margin-left: -15px;
    margin-right: -15px;
    flex-direction: row;
}
@media screen and (max-width: 991px) {
    .element {
        margin-left: -5px;
        margin-right: -5px;
        justify-content: flex-start;
        align-items: flex-start;
    }
}
@media screen and (min-width: 992px) and (max-width: 1199px) {
    .element {
        margin-left: -10px;
        margin-right: -10px;
        justify-content: center;
        align-items: center;
    }
}
```

---

#### `grid-container-align`
Creates grid columns alignment in container (Supported only in flex driver)
##### Arguments
| Name | Type | Default | Description |
|------------------|------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `align-x` | `String` or `Map` | `null` | Specifies the horizontal alignment of the columns. |
| `align-y` | `String` or `Map` | `null` | Specifies the vertical alignment of the columns.  |
| `grid` | `Map` | `$default-grid` | The grid map settings (driver, breakpoints) will be used to create an alignment of the container columns. |
##### Example SCSS:
```scss
$example-grid: (
    driver: flex,
    breakpoints: (
        xs: 0,
        sm: 576px,
        md: 768px,
        lg: 992px,
        xl: 1200px,
        xx: 1600px
    )
);
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
    justify-content: flex-end;
    align-items: flex-end;
}
@media screen and (max-width: 991px) {
    .element {
        justify-content: flex-start;
        align-items: flex-start;
    }
}
@media screen and (min-width: 992px) and (max-width: 1199px) {
    .element {
        justify-content: center;
        align-items: center;
    }
}
```

---

#### `grid-column-align`
Creates column alignment (Supported only in flex driver)
##### Arguments
| Name | Type | Default | Description |
|------------------|------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `align-x` | `String` or `Map` | `null` | Specifies the horizontal alignment of the column. |
| `align-y` | `String` or `Map` | `null` | Specifies the vertical alignment of the column.  |
| `grid` | `Map` | `$default-grid` | The grid map settings (driver, breakpoints) will be used to create a column alignment. |
##### Example SCSS:
```scss
$example-grid: (
    driver: flex,
    breakpoints: (
        xs: 0,
        sm: 576px,
        md: 768px,
        lg: 992px,
        xl: 1200px,
        xx: 1600px
    )
);
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
    margin-left: auto;
    margin-right: 0;
    align-self: flex-end;
}
@media screen and (max-width: 991px) {
    .element {
        margin-right: auto;
        margin-left: 0;
        align-self: flex-start;
    }
}
@media screen and (min-width: 992px) and (max-width: 1199px) {
    .element {
        margin-left: auto;
        margin-right: auto;
        align-self: center;
    }
}
```

---

#### `grid-column-gutter`
Sets grid gutter width around column, ignoring the gutter property in grid map.
##### Arguments
| Name | Type | Default | Description |
|------------------|------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `gutter` | `Number` (with unit) or `Map` | `null` | Grid gutter width around column. |
| `grid` | `Map` | `$default-grid` | The grid map settings (breakpoints) will be used to generate a grid gutter width around column. |
##### Example SCSS:
```scss
$example-grid: (
    gutter: 50px, // will be ignored
    breakpoints: (
        xs: 0,
        sm: 576px,
        md: 768px,
        lg: 992px,
        xl: 1200px,
        xx: 1600px
    )
);
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
    padding-left: 15px;
    padding-right: 15px;
}
@media screen and (max-width: 991px) {
    .element {
        padding-left: 5px;
        padding-right: 5px;
    }
}
@media screen and (min-width: 992px) and (max-width: 1199px) {
    .element {
        padding-left: 10px;
        padding-right: 10px;
    }
}
```

---

#### `grid-column-width`
Sets column width properties based on the number of occupied columns and grid settings.
##### Arguments
| Name | Type | Default | Description |
|------------------|------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `columns` | `Number` (unitless) or `String` or `Map` | - | The number of columns that the item should occupy. |
| `grid` | `Map` | `$default-grid` | The grid map settings (breakpoints, columns, driver) will be used to generate a column width. |
##### Example SCSS:
```scss
$example-grid: (
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
);
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
    display: none;
}
@media screen and (max-width: 991px) {
    .element {
        display: block;
        max-width: 100%;
        width: 100%;
    }
}
@media screen and (min-width: 992px) and (max-width: 1199px) {
    .element {
        display: block;
        max-width: 50%;
        width: 50%;
    }
}
```

---

#### `grid-column`
Sets column width properties based on the number of occupied columns and grid settings.
##### Arguments
| Name | Type | Default | Description |
|------------------|------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `columns` | `Number` (unitless) or `String` or `Map` | - | The number of columns that the item should occupy. |
| `align-x` | `String` or `Map` | `null` | Specifies the horizontal alignment of the column. |
| `align-y` | `String` or `Map` | `null` | Specifies the vertical alignment of the column. |
| `gutter` | `Number` (with unit) or `Map` | `null` | Grid gutter width around column. |
| `grid` | `Map` | `$default-grid` | The grid map settings will be used to create grid column. |
##### Example SCSS (Flex driver):
```scss
$example-grid: (
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
);
.element {
    @include grid-column(
        $columns: (xs: 12, sm: 6, lg: 1, xx:hidden),
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
        $gutter: (sm: 10px, lg: 20px, xl: 30px),
        $grid: $example-grid
    );
}
```
##### Example CSS (Flex driver):
```css
.element {
    box-sizing: border-box;
    min-height: 1px;
    display: none;
    margin-left: auto;
    margin-right: 0;
    padding-left: 15px;
    padding-right: 15px;
    align-self: flex-end;
}
@media screen and (max-width: 575px) {
    .element {
        display: block;
        max-width: 100%;
        width: 100%;
    }
}
@media screen and (min-width: 576px) and (max-width: 991px) {
    .element {
        display: block;
        max-width: 50%;
        width: 50%;
    }
}
@media screen and (max-width: 991px) {
    .element {
        margin-right: auto;
        margin-left: 0;
        padding-left: 5px;
        padding-right: 5px;
        align-self: flex-start;
    }
}
@media screen and (min-width: 992px) and (max-width: 1199px) {
    .element {
        margin-left: auto;
        margin-right: auto;
        padding-left: 10px;
        padding-right: 10px;
        align-self: center;
    }
}
@media screen and (min-width: 992px) and (max-width: 1599px) {
    .element {
        display: block;
        max-width: 8.33333%;
        width: 8.33333%;
    }
}
```
##### Example SCSS (Float driver):
```scss
$example-grid: (
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
);
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
        $gutter: (sm: 10px, lg: 20px, xl: 30px),
        $grid: $example-grid
    );
}
```
##### Output CSS (Float driver):
```css
.element {
    box-sizing: border-box;
    min-height: 1px;
    display: none;
    padding-left: 15px;
    padding-right: 15px;
    float: left;
}
@media screen and (max-width: 575px) {
    .element {
        display: block;
        width: 100%;
    }
}
@media screen and (min-width: 576px) and (max-width: 991px) {
    .element {
        display: block;
        width: 50%;
    }
}
@media screen and (min-width: 992px) and (max-width: 1599px) {
    .element {
        display: block;
        width: 8.33333%;
    }
}
@media screen and (max-width: 991px) {
    .element {
        padding-left: 5px;
        padding-right: 5px;
    }
}
@media screen and (min-width: 992px) and (max-width: 1199px) {
    .element {
        padding-left: 10px;
        padding-right: 10px;
    }
}
```

---

#### `grid-push`
Push or pull a grid column by manipulating its left margin.
##### Arguments
| Name | Type | Default | Description |
|------------------|------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `columns` | `Number` (unitless) or `String` or `Map` | - | Specifies the number of columns to push the column. |
| `grid` | `Map` | `$default-grid` | The grid map settings (breakpoints, columns, driver) will be used to generate a column width. |
##### Example SCSS:
```scss
.element {
    @include grid-push(
        $columns: (md: 2, lg: 3, xl: 4)
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
| `columns` | `Number` (unitless) or `String` or `Map` | - | Specifies the number of columns to shift the column. |
| `grid` | `Map` | `$default-grid` | The grid map settings (breakpoints, columns, driver) will be used to generate a column width. |
##### Example SCSS:
```scss
.element {
    @include grid-shift(
        $columns: (md: 2, lg: 3, xl: 4)
    );
}
```
##### Output CSS:
```css
.element {
    position: relative;
    left: 33.33333%;
}
@media screen and (max-width: 991px) {
    .element {
        left: 16.66667%;
    }
}
@media screen and (min-width: 992px) and (max-width: 1199px) {
    .element {
        left: 25%;
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
| `grid` | `Map` | `$default-grid` | The grid map settings (breakpoints) will be used to create a media query. |
##### Example SCSS:
```scss
$example-grid: (
    breakpoints: (
        xs: 0, // Extra small screen
        sm: 576px, // Small screen
        md: 768px, // Medium screen
        lg: 992px, // Large screen
        xl: 1200px, // Extra large screen
        xx: 1600px // Extra extra large screen
    )
);
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
@media screen and (max-width: 575px) {
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
| `grid` | `Map` | `$default-grid` | The grid map settings (breakpoints) will be used to create a media query. |
##### Example SCSS:
```scss
$example-grid: (
    breakpoints: (
        xs: 0, // Extra small screen
        sm: 576px, // Small screen
        md: 768px, // Medium screen
        lg: 992px, // Large screen
        xl: 1200px, // Extra large screen
        xx: 1600px // Extra extra large screen
    )
);
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
@media screen and (min-width: 576px) {
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
| `grid` | `Map` | `$default-grid` | The grid map settings (breakpoints) will be used to create a media query. |
##### Example SCSS:
```scss
$example-grid: (
    breakpoints: (
        xs: 0, // Extra small screen
        sm: 576px, // Small screen
        md: 768px, // Medium screen
        lg: 992px, // Large screen
        xl: 1200px, // Extra large screen
        xx: 1600px // Extra extra large screen
    )
);
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
@media screen and (min-width: 576px) and (max-width: 991px) {
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
| `grid` | `Map` | `$default-grid` | The grid map settings (breakpoints) will be used to create a media query. |
##### Example SCSS:
```scss
$example-grid: (
    breakpoints: (
        xs: 0, // Extra small screen
        sm: 576px, // Small screen
        md: 768px, // Medium screen
        lg: 992px, // Large screen
        xl: 1200px, // Extra large screen
        xx: 1600px // Extra extra large screen
    )
);
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
