# Sass tips 

## Dynamic line-height
```scss
@mixin dyn-line-height($min-line-height, $max-line-height, $min-width, $max-width) {
    line-height: calc(#{($min-line-height * 1em)} + #{($max-line-height - $min-line-height)} * ((100vw - #{($min-width * 1em)}/#{($max-width - $min-width)})));
}
``` 