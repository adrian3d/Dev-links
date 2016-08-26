# Sass tips 

## Flexible typography
@function flex-typo($min-size, $max-size, $min-width, $max-width, $base-unit: 1em) {
    @return calc(#{($min-size * $base-unit)} + #{($max-size - $min-size)} * ((100vw - #{($min-width * $base-unit)}/#{($max-width - $min-width)})));
}

Source [Flexible typography with CSS locks](http://blog.typekit.com/2016/08/17/flexible-typography-with-css-locks/?ref=webdesignernews.com)
