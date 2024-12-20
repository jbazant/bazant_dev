---
layout: layouts/basic.njk
tags: ['bed', '11ty.js', 'SASS', 'Typescript']
title: Tento web
description: Statický web generovaný pomocí 11ty.js
sitemap:
  priority: 0.3
  lastmod: "2021-11-17"
---
<section class="top">
  <div class="container">
    <p>Rychlý, responsivní, statický a ne příliš reprezentativní.</p>
  </div>
</section>
<section class="basic">
  <div class="container">

## Co je pod kapotou?

### Krátká verze
Statické HTML, CSS bez knihoven třetích stran a pár řádků JS, včetně service workera. 

### Dlouhá verze
 * Web je generován pomocí [Eleventy](https://www.11ty.dev/). Markup je většinou vytvořen v [Nunjucks](https://mozilla.github.io/nunjucks/) nebo [Markdown](https://www.markdownguide.org/).
 * Styly jsou psané pomocí [SASS](https://sass-lang.com/).
 * Namísto Javasctiptu je většinou použit [TypeScript](https://www.typescriptlang.org/).
 * Kontaktní formulář využívá služby [Formspree](https://formspree.io/).
 * [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) pro preload jednotlivých stránek, řízení cache a zobrazování offline upozornění.
   * Web lze po prvním načtení používat téměř celý offline.
   * Pokud vás zajímá, jak vypadá **offline stránka** a nechcete se na&nbsp;ni složitě dostávat vypínáním internetu a hledáním, co ještě nemáte v&nbsp;cache. [Podívejte se](/offline.html).
   * Pokud vás zajímá **404 stránka**, tak ta je k&nbsp;nahlédnutí [zde](/404.html). (To sice nemá s&nbsp;PWA nic společného, ale chtěl jsem se pochlubit.)
   
### Kompletní verze

Vše k tomuto webu je veřejně na [GitHubu](https://github.com/jbazant/bazant_dev). (Tedy kromě hesla na FTP.)

  </div>
</section>

<section class="basic">
  <div class="container">

## A jak si vede v testech?

 * [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fbazant.dev)
 * [Mozilla Observatory](https://observatory.mozilla.org/analyze/bazant.dev)
  
  </div>
</section>