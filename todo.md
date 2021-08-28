## general research
* Find better js and css cache busting
  * maybe shorttag inspired by [cache buster plugin](https://github.com/mightyplow/eleventy-plugin-cache-buster)
* Responsive images (https://github.com/nhoizey/images-responsiver), CDN?
* form transitions (error messages, success message)
* woff2 and preload
* [svg icon](https://css-tricks.com/svg-favicons-in-action/)?

## just do it
* no js navigation for small devices

## content
* garden
    - water
        - animated logo instead of text?
        - parallax effect for camera
    - L-system

## How to logo 
 - [svgtopng](https://svgtopng.com/)
 - [faviconit](http://faviconit.com/en)
 - [maskable](https://maskable.app/editor)

## PWA
 - use correct typings (see @types/service_worker_api) and delete ts-ignore comments
 - preload all assets? See [PWA by M. Volkmann](https://mvolkmann.github.io/blog/topics/#/blog/eleventy/pwa/?v=1.0.18)
   - or maybe just references and code.jpeg?
 - preload all pages (from sitemap)? Is not that much overhead in fact.
 - detect navigation to not yet loaded page and display custom offline one if necessary
 - code should be separated to multiple files
 - mention in "Tento web"
 - article?
 - test 404 reponse
