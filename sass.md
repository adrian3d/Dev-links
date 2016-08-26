# Sass tips 

## Dynamic line-height
```scss
@mixin dyn-line-height($min-line-height, $max-line-height, $min-width, $max-width) {
    line-height: calc(#{($min-line-height * 1em)} + #{($max-line-height - $min-line-height)} * ((100vw - #{($min-width * 1em)}/#{($max-width - $min-width)})));
}
``` 
Source [Flexible typography with CSS locks](http://blog.typekit.com/2016/08/17/flexible-typography-with-css-locks/?ref=webdesignernews.com)