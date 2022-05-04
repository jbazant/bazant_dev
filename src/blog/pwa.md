---
layout: layouts/basic.njk
tags: ['blog', 'PWA', 'Typescript']
title: Jak jsem psal PWA
description: Jak jsem psal PWA a vy to dělat nechcete
sitemap:
    exclude: true
    priority: 0.3
    lastmod: "2022-04-15"
---
<section class="top">
  <div class="container">

> PWA (Progressive web app) je webová aplikace, která používá [service worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API),
> [manifesto](https://developer.mozilla.org/en-US/docs/Web/Manifest) a další
> [progresivní vylepšení (progressive enhancements)](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) k tomu,
> aby uživatelům poskytly zážitek srovnatelný s nativními aplikacemi.
> 
> *(Zdroj: [MDN: Progressive web apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps))*

  </div>
</section>
<section class="basic">
  <div class="container">

## Jak jsem psal PWA a proč Vy to tak dělat nechcete

Vzhledem k tomu, že tento web je mé pískoviště na zkoušení různých technologií, rozhodl jsem se do něj přidat i PWA.
A kupodivu jsem to s tím dotáhl tak daleko, že mi přišlo jako dobrý nápad to nasadit do produkce.

### Cíle

- Ukládat lokálně stránky tak, aby při druhé návštěvě mobly být načteny offline.
- Udělat si toho co nejvíc sám.
- Přednačítat jen "malé" nebo "důležité" části webu.
- Možnost přidat web jako aplikaci na plochu. Proč? Protože proč ne.
- Offline stránku, pokud se uživatel pokusí zobrazit nenacachovaný zdroj. 


### Studium a příprava

K myšlence, že chci PWA přidat na svůj web, mě v podstatě přivedl jeden starší článek [Martina Michálka](https://www.vzhurudolu.cz/prirucka/pwa).
Ten sice obsahuje několik nepřesností a vlastně ani nesouhlasím s myšlenkou implementace 
PWA jen pro dosažení skóre v nějakém testu, ale jako výchozí bod to posloužilo víc než dobře. Takže...


### jdu na to
 
- Doplňuji [manifest](/manifest.json). 
- Registruji service workera.
```ts
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js');
  });
}
```
- Připravuji [offline stránku](/offline.html) (a ne, opravdu není potřeba, aby vše bylo inline, jak uvádí výše zmiňovaný článek). 

A pak narážím. Nechci cizí service worker, chci si ho napsat sám. A hlavně chci pochopit, jak to funguje. Takže hledám ...
a nacházím [Mark Volkmann's blog](https://mvolkmann.github.io/blog/topics/#/blog/eleventy/pwa/?v=1.0.19), který popisuje,
jak implemenoval PWA přímo pro [Eleventy](https://www.11ty.dev/).


### Intermezzo: Service worker a typescript
// TODO
// tod jako sekce?

### PWA a Eleventy

Eleventy je statický generátor. Service worker toho může využít - vím, že se mi obsah mění jen při nasazení nové verze
webu. Nikdy jindy. Takže můj plán je s každou novou verzí webu generovat nový service worker. V něm si přednačíst podstatnou 
část stránek a pak již uživateli vše servírovat lokálně.

Vytvářím tedy soubor `sw.ts` s logikou, ale nechci to dělat jako Mark a načítat zdroje až při aktivaci workera
načtením seznamu stránek. Chci, aby worker zdroje k přednačtení znal již při instalaci. Nakonec nevymyslím nic lepšího,
než sestavit seznam stránek z kolekce `all` + staticky definovat cesty k js, css, atd. zdrojům a vyplivnout to do JSONu
a tento seznam použít v `sw.js` nějak takto

```ts
const { date, files } = require('../../../_site/pwa-files.json');

const cacheName = 'bazant-dev-' + date;

self.addEventListener('install', (event: ExtendableEvent) => {
    event.waitUntil(cacheAssets(caches, cacheName, files));
});
```

`date` je timestamp kompilace, `files` je prosté pole zdrojů a to včetně css, js, obrázku na úvodní stránce, fontů a favicony.

Krásné? Ne. Funkční? Zdá se, že ano.

Zbytek logiky service workera asi už nemá cenu nějak komentovat. Snad jen, že vše lze nalézt na [githubu projektu](https://github.com/jbazant/bazant_dev/tree/master/src/ts/service-worker).



### Chcete PWA na skutečný projekt

Použijte předpřipravené řešení. Jako nejlepší mi přišel [Workbox](https://developers.google.com/web/tools/workbox). 
Modulární, konfigurovatelné a dobře zdokumentované řešení.

### Chcete se o PWA dozvědět více

  - Začněte na [MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps).
  - Doplňte to z [web.dev](https://web.dev/progressive-web-apps/).

  </div>
</section>