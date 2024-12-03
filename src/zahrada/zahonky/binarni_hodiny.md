---
layout: layouts/basic.njk
tags: ['bed', 'OpenSCAD', 'KiCad EDA', 'ESP8266', 'C++']
title: Binární hodiny
description: '"Chytré" binární hodiny s teplotním a vlhkostním senzorem.'
sitemap:
    priority: 0.6
    lastmod: "2024-12-01"
---
<section class="top">
  <div class="container">
    <p>Binární hodiny, automaticky synchronizované přes Wifi a NTP, se senzorem teploty a relativní vlhkosti.</p>
  </div>
</section>
<section class="basic">
  <div class="container">

## DIY binární hodiny
Projekt [WEMOS D1 mini Binary Clock](https://github.com/jbazant/esp8266-binary-clock) je soukromý projekt binárních hodin založených na mikrokontroléru [WEMOS D1 mini](https://www.wemos.cc/en/latest/d1/d1_mini.html) s čipem ESP8266 a 8x8 LED maticí. 

Hodiny zobrazují v binárním formátu sekundy, minuty, hodiny, den v měsíci, den v týdnu, měsíc, fázi měsíce a poslední dvě desetinná místa roku. Dále jsou vybaveny senzorem DHT pro měření teploty a vlhkosti. Přesný čas je synchronizován prostřednictvím NTP protokolu.

  </div>
</section>
<section class="basic">
  <div class="container">

## Od návrhu obvodu po 3D tisk
Na [GitHubu](https://github.com/jbazant/esp8266-binary-clock) projektu naleznete komplentí zdrojové kódy, včetně schéma zapojení obvodu a jednovrstvého PCB(v [KiCad EDA](https://www.kicad.org/)), 3D modelu pouzdra (v [OpenSCAD](https://openscad.org/)) optimalizavoného pro FDM 3D tisk a samozřejmě i zdrojové kódy pro mikrokontrolér.

Pouzdro je navrženo pro zavěšení do IKEA Skadis.

  </div>
</section>
<section class="basic photo">
  <div class="container"><img src="{{ '/images/clock/binary_clock.jpg' | url }}" alt="Binární hodiny" class="img"/></div>
</section>

