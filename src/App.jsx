import { useState, useRef, useCallback, useEffect } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Cinzel+Decorative:wght@700&family=Nunito:wght@400;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --navy:#00111f;--blue:#0B3D91;--blue2:#1455C0;
  --gold:#F5C842;--gold2:#FFE380;
  --red:#C41E3A;--green:#2D8A4A;--purple:#7C3AED;
  --text:rgba(255,255,255,0.88);--dim:rgba(255,255,255,0.42);
  --card:rgba(11,61,145,0.18);--border:rgba(245,200,66,0.2);
}
body,#root{background:var(--navy);font-family:'Nunito',sans-serif;min-height:100vh;overflow-x:hidden;}
.app{max-width:430px;margin:0 auto;min-height:100vh;background:linear-gradient(180deg,#001830 0%,#00111f 100%);position:relative;}

/* Starfield */
.starfield{position:fixed;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:0;
  background-image:
    radial-gradient(circle 1px at 8% 12%,rgba(255,255,255,.8) 0%,transparent 1px),
    radial-gradient(circle 1px at 22% 48%,rgba(255,255,255,.6) 0%,transparent 1px),
    radial-gradient(circle 1.5px at 38% 7%,rgba(255,255,255,.9) 0%,transparent 1px),
    radial-gradient(circle 1px at 55% 62%,rgba(255,255,255,.5) 0%,transparent 1px),
    radial-gradient(circle 1px at 67% 28%,rgba(255,255,255,.7) 0%,transparent 1px),
    radial-gradient(circle 1px at 78% 55%,rgba(255,255,255,.6) 0%,transparent 1px),
    radial-gradient(circle 1.5px at 88% 18%,rgba(255,255,255,.8) 0%,transparent 1px),
    radial-gradient(circle 1px at 14% 78%,rgba(255,255,255,.5) 0%,transparent 1px),
    radial-gradient(circle 1px at 44% 84%,rgba(255,255,255,.4) 0%,transparent 1px),
    radial-gradient(circle 1px at 92% 72%,rgba(255,255,255,.6) 0%,transparent 1px),
    radial-gradient(circle 1.5px at 32% 92%,rgba(255,255,255,.5) 0%,transparent 1px),
    radial-gradient(circle 1px at 62% 40%,rgba(255,255,255,.4) 0%,transparent 1px);
  animation:twinkle 5s ease-in-out infinite alternate;}
@keyframes twinkle{from{opacity:.5}to{opacity:1}}

/* Hero */
.hero{background:linear-gradient(145deg,#001f60 0%,#0B3D91 45%,#001f60 100%);
  padding:18px 16px 16px;position:relative;overflow:hidden;z-index:1;
  border-bottom:2px solid var(--gold);}
.hero-glow{position:absolute;width:250px;height:250px;top:-80px;right:-80px;
  background:radial-gradient(circle,rgba(245,200,66,.18) 0%,transparent 60%);pointer-events:none;}
.hero-castle{position:absolute;bottom:-2px;right:12px;font-size:42px;opacity:.12;line-height:1;}
.hero-title{font-family:'Pacifico',cursive;font-size:24px;color:var(--gold);
  text-shadow:0 2px 24px rgba(245,200,66,.45);line-height:1.1;}
.hero-ship{font-family:'Cinzel Decorative',serif;font-size:10px;color:rgba(255,255,255,.65);
  letter-spacing:2.5px;text-transform:uppercase;margin-top:3px;}
.hero-divider{width:56px;height:2px;background:linear-gradient(90deg,var(--gold),transparent);margin:7px 0;}
.hero-pills{display:flex;gap:5px;flex-wrap:wrap;margin-top:9px;}
.pill{padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.3px;}
.pg{background:rgba(245,200,66,.14);color:var(--gold);border:1px solid rgba(245,200,66,.3);}
.pr{background:rgba(196,30,58,.2);color:#ff8091;border:1px solid rgba(196,30,58,.35);}
.pb{background:rgba(26,85,191,.3);color:#88bfff;border:1px solid rgba(26,85,191,.4);}
.pp{background:rgba(124,58,237,.25);color:#c4b5fd;border:1px solid rgba(124,58,237,.35);}

/* Pull to refresh */
.ptr{text-align:center;padding:10px;color:var(--gold);font-size:12px;font-weight:700;
  overflow:hidden;transition:max-height .3s,opacity .3s;position:relative;z-index:2;}
.ptr-spin{display:inline-block;width:16px;height:16px;border:2px solid rgba(245,200,66,.3);
  border-top-color:var(--gold);border-radius:50%;animation:spin .7s linear infinite;
  margin-right:7px;vertical-align:middle;}
@keyframes spin{to{transform:rotate(360deg)}}

/* Scroll */
.scroll-wrap{overflow-y:auto;padding-bottom:76px;position:relative;z-index:1;}
.content{padding:13px 13px 10px;}

/* Section header */
.shdr{font-family:'Cinzel Decorative',serif;font-size:10.5px;font-weight:700;
  color:var(--gold);letter-spacing:2px;text-transform:uppercase;
  margin:14px 0 8px;display:flex;align-items:center;gap:7px;}
.shdr::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(245,200,66,.3),transparent);}

/* Cards */
.card{background:linear-gradient(135deg,rgba(11,61,145,.2) 0%,rgba(0,15,45,.45) 100%);
  border:1px solid var(--border);border-radius:14px;padding:13px;margin-bottom:10px;
  position:relative;overflow:hidden;}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(245,200,66,.45),transparent);}
.card.rc{border-color:rgba(196,30,58,.4);}
.card.rc::before{background:linear-gradient(90deg,transparent,rgba(196,30,58,.5),transparent);}
.card.gc{border-color:rgba(45,138,74,.4);}
.card.gc::before{background:linear-gradient(90deg,transparent,rgba(45,138,74,.5),transparent);}
.card.pc{border-color:rgba(124,58,237,.4);}
.card.pc::before{background:linear-gradient(90deg,transparent,rgba(124,58,237,.5),transparent);}
.card-title{font-size:13px;font-weight:800;color:#fff;margin-bottom:7px;
  display:flex;align-items:center;gap:6px;flex-wrap:wrap;}

/* Badges */
.badge{font-size:9px;font-weight:700;letter-spacing:.8px;padding:2px 8px;border-radius:20px;text-transform:uppercase;}
.br{background:rgba(196,30,58,.2);color:#ff8091;border:1px solid rgba(196,30,58,.35);}
.bg{background:rgba(245,200,66,.14);color:var(--gold);border:1px solid rgba(245,200,66,.3);}
.bbl{background:rgba(74,144,217,.2);color:#88bfff;border:1px solid rgba(74,144,217,.3);}
.bgr{background:rgba(45,138,74,.2);color:#6ddb80;border:1px solid rgba(45,138,74,.35);}
.bpu{background:rgba(124,58,237,.2);color:#c4b5fd;border:1px solid rgba(124,58,237,.35);}

/* Lists */
.lst{list-style:none;}
.lst li{color:var(--text);font-size:12.5px;padding:5px 0;
  border-bottom:1px solid rgba(255,255,255,.05);
  display:flex;align-items:flex-start;gap:8px;line-height:1.45;}
.lst li:last-child{border-bottom:none;}
.dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:5px;}
.dg{background:var(--gold);}
.dr{background:#ff8091;}
.dbl{background:#88bfff;}
.dgr{background:#6ddb80;}

/* Highlight boxes */
.hl{background:rgba(245,200,66,.07);border-left:3px solid var(--gold);
  border-radius:0 8px 8px 0;padding:9px 11px;margin:8px 0;
  color:var(--text);font-size:12px;line-height:1.5;}
.hl.r{background:rgba(196,30,58,.07);border-color:var(--red);}
.hl.b{background:rgba(26,85,191,.07);border-color:var(--blue2);}
.hl.gr{background:rgba(45,138,74,.07);border-color:var(--green);}

/* Checklist */
.ci{display:flex;align-items:flex-start;gap:9px;padding:8px 0;
  border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer;}
.ci:last-child{border-bottom:none;}
.cb{width:17px;height:17px;border-radius:4px;border:2px solid rgba(245,200,66,.45);
  display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;
  transition:all .2s;background:transparent;}
.cb.on{background:var(--gold);border-color:var(--gold);}
.cl{color:var(--text);font-size:12.5px;line-height:1.4;flex:1;}
.cl.done{text-decoration:line-through;color:var(--dim);}
.csub{font-size:11px;color:var(--dim);display:block;margin-top:1px;}

/* Progress bar */
.prog{height:5px;border-radius:3px;background:rgba(255,255,255,.08);margin:6px 0 12px;overflow:hidden;}
.prog-fill{height:100%;background:linear-gradient(90deg,var(--gold),#c8962e);
  border-radius:3px;transition:width .4s ease;}
.prog-label{font-size:11px;color:var(--dim);margin-bottom:3px;
  display:flex;justify-content:space-between;}

/* Timeline */
.day-hdr{display:flex;align-items:center;gap:9px;cursor:pointer;padding:9px 0 5px;user-select:none;}
.dnum{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:'Cinzel Decorative',serif;font-size:10px;font-weight:700;color:#001220;flex-shrink:0;}
.dn1{background:linear-gradient(135deg,var(--gold),#c8962e);}
.dn2{background:linear-gradient(135deg,#4A90D9,#1455bf);}
.dn3{background:linear-gradient(135deg,#ff8091,var(--red));}
.dn4{background:linear-gradient(135deg,#c4b5fd,#7c3aed);}
.dn5{background:linear-gradient(135deg,#6ddb80,var(--green));}
.day-info h3{color:#fff;font-size:13px;font-weight:800;}
.day-info p{color:var(--dim);font-size:10.5px;}
.chev{margin-left:auto;color:var(--dim);font-size:10px;transition:transform .2s;}
.chev.open{transform:rotate(180deg);}
.timeline{padding:3px 0 6px 15px;border-left:1px solid rgba(255,255,255,.07);margin-left:15px;}
.tb{position:relative;padding:6px 0 6px 13px;}
.tb::before{content:'';position:absolute;left:-5px;top:12px;width:8px;height:8px;border-radius:50%;
  background:rgba(245,200,66,.3);border:1px solid rgba(245,200,66,.55);}
.tb.cr::before{background:rgba(196,30,58,.5);border-color:rgba(196,30,58,.8);}
.tb.te::before{background:rgba(0,212,170,.5);border-color:rgba(0,212,170,.7);}
.tb.pk::before{background:rgba(255,107,157,.5);border-color:rgba(255,107,157,.7);}
.tbt{font-family:'Cinzel Decorative',serif;font-size:9px;color:var(--gold);letter-spacing:.3px;}
.tb.cr .tbt{color:#ff8091;}
.tb.te .tbt{color:#00d4aa;}
.tb.pk .tbt{color:#ff6b9d;}
.tbd{color:var(--text);font-size:12.5px;line-height:1.4;margin-top:2px;}
.tbn{display:inline-block;font-size:9px;font-weight:700;padding:1px 7px;border-radius:10px;margin-top:3px;}
.tr{background:rgba(196,30,58,.14);color:#ff8091;}
.tg{background:rgba(245,200,66,.12);color:var(--gold);}
.tt{background:rgba(0,212,170,.12);color:#00d4aa;}
.tp{background:rgba(255,107,157,.12);color:#ff6b9d;}

/* Dining */
.rot-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;}
.rot-slot{background:rgba(11,61,145,.2);border:1px solid rgba(245,200,66,.2);border-radius:10px;padding:10px;}
.rot-slot label{font-size:9.5px;font-weight:800;color:var(--gold);letter-spacing:.5px;
  text-transform:uppercase;display:block;margin-bottom:6px;}
.rot-slot select{width:100%;background:rgba(0,15,40,.7);border:1px solid rgba(245,200,66,.25);
  border-radius:6px;color:#fff;font-family:'Nunito',sans-serif;font-size:11px;font-weight:600;
  padding:5px 8px;outline:none;cursor:pointer;-webkit-appearance:none;}
.rest-card{border-radius:12px;overflow:hidden;margin-bottom:10px;}
.rest-hdr{padding:13px;position:relative;}
.rest-name{font-size:15px;font-weight:800;color:#fff;}
.rest-tag{font-size:11px;color:rgba(255,255,255,.55);margin-top:2px;font-style:italic;}
.rest-body{padding:11px 13px 13px;background:rgba(0,8,25,.55);}
.mo-item{padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05);}
.mo-item:last-child{border-bottom:none;}
.mo-name{color:var(--gold);font-size:12.5px;font-weight:700;}
.mo-tip{color:rgba(255,255,255,.58);font-size:11.5px;margin-top:2px;}
.insider-tip{color:rgba(255,255,255,.7);font-size:12px;padding:4px 0;
  display:flex;align-items:flex-start;gap:7px;border-bottom:1px solid rgba(255,255,255,.04);}
.insider-tip:last-child{border-bottom:none;}

/* Shows */
.show-card{border-radius:12px;overflow:hidden;margin-bottom:10px;
  background:linear-gradient(135deg,rgba(11,61,145,.2) 0%,rgba(0,12,40,.5) 100%);
  border:1px solid rgba(255,255,255,.08);}
.show-hdr{padding:12px 13px;display:flex;align-items:flex-start;gap:10px;cursor:pointer;}
.show-em{font-size:28px;flex-shrink:0;}
.show-meta h3{color:#fff;font-size:13px;font-weight:800;}
.show-meta p{color:var(--dim);font-size:11px;margin-top:2px;}
.dnm-badge{display:inline-block;background:rgba(196,30,58,.2);color:#ff8091;
  font-size:9px;font-weight:700;padding:2px 7px;border-radius:10px;margin-top:3px;letter-spacing:.5px;}
.show-body{padding:10px 13px 12px;border-top:1px solid rgba(255,255,255,.06);}
.show-desc{color:var(--text);font-size:12px;line-height:1.5;margin-bottom:8px;}
.seat-box{background:rgba(245,200,66,.07);border-left:3px solid var(--gold);
  padding:8px 10px;border-radius:0 6px 6px 0;font-size:11.5px;color:rgba(255,255,255,.8);line-height:1.45;}
.km{font-size:11px;color:var(--dim);margin-top:6px;}

/* Iron Cycle */
.iron-hero{background:linear-gradient(135deg,#1a0830 0%,#3d0a1a 55%,#0f0a2e 100%);
  border:2px solid var(--red);border-radius:16px;padding:14px;margin-bottom:12px;
  position:relative;overflow:hidden;}
.iron-hero::after{content:'🦾';position:absolute;right:-5px;bottom:-12px;
  font-size:72px;opacity:.07;line-height:1;}
.iron-title{font-family:'Cinzel Decorative',serif;font-size:15px;font-weight:700;
  color:#ff4d6d;text-shadow:0 0 20px rgba(255,77,109,.5);}
.iron-sub{color:rgba(255,255,255,.58);font-size:11px;margin-top:3px;}
.kid-tracker{display:flex;gap:7px;margin:11px 0;}
.kc{flex:1;background:rgba(0,0,0,.35);border-radius:10px;padding:9px 6px;text-align:center;
  border:1px solid rgba(255,255,255,.09);cursor:pointer;transition:all .2s;}
.kc.ridden{background:rgba(45,138,74,.2);border-color:rgba(45,138,74,.5);}
.kc-em{font-size:20px;margin-bottom:3px;}
.kc-name{color:rgba(255,255,255,.55);font-size:9.5px;font-weight:800;letter-spacing:.5px;}
.kc-st{font-size:9.5px;margin-top:3px;font-weight:800;}
.kc-st.done{color:#6ddb80;}
.kc-st.pend{color:rgba(255,255,255,.3);}

/* Pack */
.pack-cat{font-size:11px;font-weight:800;color:var(--gold);letter-spacing:1px;
  text-transform:uppercase;margin:12px 0 5px;display:flex;align-items:center;gap:6px;}
.pi{display:flex;align-items:flex-start;gap:8px;padding:6px 0;
  border-bottom:1px solid rgba(255,255,255,.04);cursor:pointer;}
.pi:last-child{border-bottom:none;}
.pcb{width:15px;height:15px;border-radius:3px;border:1.5px solid rgba(245,200,66,.4);
  display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;
  transition:all .2s;background:transparent;}
.pcb.on{background:var(--gold);border-color:var(--gold);}
.pt{color:var(--text);font-size:12px;line-height:1.4;flex:1;}
.pt.done{color:var(--dim);text-decoration:line-through;}
.ptip{font-size:10.5px;color:var(--dim);display:block;margin-top:1px;}

/* Secrets */
.gem{background:linear-gradient(135deg,rgba(11,61,145,.18) 0%,rgba(20,8,48,.5) 100%);
  border:1px solid rgba(167,139,250,.22);border-radius:12px;padding:12px 13px;margin-bottom:9px;
  position:relative;overflow:hidden;}
.gem::before{content:attr(data-n);position:absolute;right:-4px;top:-8px;
  font-family:'Cinzel Decorative',serif;font-size:46px;font-weight:700;
  color:rgba(167,139,250,.06);line-height:1;}
.gem-title{color:#c4b5fd;font-size:13px;font-weight:700;margin-bottom:4px;}
.gem-text{color:rgba(255,255,255,.7);font-size:12px;line-height:1.5;}
.gem-text strong{color:var(--gold);}

/* Toast */
.toast{position:fixed;top:68px;left:50%;transform:translateX(-50%);
  background:rgba(11,61,145,.97);border:1px solid var(--gold);border-radius:10px;
  padding:10px 14px;color:#fff;font-size:12px;z-index:200;max-width:300px;width:90%;
  box-shadow:0 8px 32px rgba(0,0,0,.6);backdrop-filter:blur(10px);
  animation:sd .3s ease;}
@keyframes sd{from{opacity:0;transform:translateX(-50%) translateY(-8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.toast-title{font-weight:800;color:var(--gold);font-size:11px;text-transform:uppercase;
  letter-spacing:1px;margin-bottom:4px;}

/* Tab bar */
.tab-bar{position:fixed;bottom:0;left:50%;transform:translateX(-50%);
  width:100%;max-width:430px;background:rgba(0,10,22,.97);
  backdrop-filter:blur(20px);border-top:1px solid rgba(245,200,66,.22);
  display:flex;z-index:100;padding-bottom:env(safe-area-inset-bottom,0px);}
.tab-btn{flex:1;background:none;border:none;color:var(--dim);
  font-family:'Nunito',sans-serif;font-size:8px;font-weight:700;
  padding:7px 2px 8px;cursor:pointer;display:flex;flex-direction:column;
  align-items:center;gap:2px;transition:color .2s;letter-spacing:.2px;position:relative;}
.tab-btn.act{color:var(--gold);}
.tab-btn.act::after{content:'';position:absolute;bottom:0;left:18%;right:18%;
  height:2px;background:var(--gold);border-radius:2px 2px 0 0;}
.tab-ic{font-size:17px;line-height:1;}
.divider{height:1px;background:rgba(255,255,255,.06);margin:10px 0;}
`;

// ─────────────────────────────── DATA ────────────────────────────────

const RESTAURANTS = {
  hollywood: {
    id:'hollywood', name:'Hollywood Spotlight Club', emoji:'🎬',
    tagline:'Red carpet, golden-age glamour — Mickey in evening wear',
    color:'linear-gradient(135deg,#1a0d00 0%,#3d2000 100%)',
    badge:'Most Theatrical',
    mustOrder:[
      {name:'Duck Confit Pastilla',tip:'Filo, saffron, cinnamon, blackberry. Verified from actual menus. The standout starter.'},
      {name:'Prawns Mumbai Bhel',tip:'Sweet corn, rice puffs, tamarind. Unexpectedly brilliant. Not your standard cruise prawn.'},
      {name:"Mickey's Chocolate Tart",tip:'Gets audible gasps from other tables. Order one for each kid.'},
      {name:'Nightly Signature Main',tip:'Rotates each sailing. Ask your server what is special tonight — they always know.'},
      {name:'Kids Hollywood Plate',tip:'Plated theatrically. Kids feel like little celebrities. They will ask for it every night.'},
    ],
    insider:[
      '🌟 Mickey, Minnie, Donald and Daisy arrive in full evening wear. Have your camera out BEFORE they approach your table.',
      '🎭 Most high-energy of all 6 rotational restaurants. Schedule on Night 1 or 2 when everyone is fresh.',
      '📸 The lighting in this room is designed for photos. Best character shots of any dining venue on the ship.',
      '🎬 Live entertainment plays between courses. Do not rush. Let the performance happen.',
    ],
    dress:'Smart casual to semi-formal',
  },
  navigators: {
    id:'navigators', name:"Navigator's Club", emoji:'⚓',
    tagline:'Golden age of ocean travel — dine like a sea captain',
    color:'linear-gradient(135deg,#001a3a 0%,#002a5c 100%)',
    badge:'Character Dining',
    mustOrder:[
      {name:'Seafood Signature Starter',tip:'The nautical menu leans heavily on the ocean. Always order the seafood-based starter.'},
      {name:"Captain's Beef Tenderloin",tip:'Ask your server how it is prepared tonight — preparation rotates by sailing.'},
      {name:'Voyage Dessert',tip:'Changes nightly. Always order it — the kitchen gets creative here.'},
      {name:'Kids Navigator Plate',tip:"Mickey-shaped touches on the kids' menu. Reliable for picky eaters."},
      {name:'Global Cheese Selection',tip:'Lighter option. Ask for the accompanying wine pairing if you enjoy that.'},
    ],
    insider:[
      '🎭 Mickey, Minnie, Donald and Daisy appear as "distinguished world travellers" sharing songs and stories between courses.',
      '⚓ Most intimate of the 6 rotational restaurants. Great for a quieter, more personal family dinner.',
      '🗺️ Vintage maps and historical charts cover the walls. Detailed enough to keep curious kids occupied between courses.',
      '🕔 First seating (1745) in this restaurant is notably calmer. Staff have more time for your table.',
    ],
    dress:'Smart casual',
  },
  animatorpalate: {
    id:'animatorpalate', name:"Animator's Palate", emoji:'🎨',
    tagline:'Your kids draw characters. Watch them appear on screen.',
    color:'linear-gradient(135deg,#0a1a0a 0%,#0a2010 100%)',
    badge:'Most Interactive',
    mustOrder:[
      {name:'Hainanese Chicken Rice',tip:'Verified from actual menus. Sweet dark soy, ginger garlic sauce, chili sauce. On a Disney ship. Intentional, authentic, excellent.'},
      {name:'Laksa Lemak',tip:'Prawn, tau pok, laksa leaf, chili. Real Singapore laksa on a cruise ship. Order it without question.'},
      {name:'Chocolate Decadence',tip:'Bitter chocolate crème, truffle crème, hazelnut chiffon, chocolate sauce. The dessert highlight of the ship.'},
      {name:'Salted Caramel Cheesecake',tip:'Vanilla cheesecake, salted dulce de leche glaze, peanut butter rice crisps. Order both desserts.'},
      {name:'Digital Drawing Plate (kids)',tip:'Kids get a digital placemat to draw a character. It animates onto the screens. They will not stop talking about this.'},
    ],
    insider:[
      '🖥️ Kids draw on a digital placemat. Their drawing appears animated on the surrounding screens. Sit facing the main wall screen.',
      '🍜 The Singapore dishes (Hainanese chicken, laksa) are here by design and they are done well. Order them even if you eat them every week.',
      '🎨 Best restaurant for kids aged 5–12. The digital drawing activity runs the entire meal duration.',
      '🎬 Animation cels and film strips line the room. Walk around before sitting and look at the detail.',
    ],
    dress:'Smart casual — most family-friendly of the 6',
  },
  enchantedsummer: {
    id:'enchantedsummer', name:'Enchanted Summer', emoji:'🌸',
    tagline:'Garden elegance · Town Square · Disney Princesses nearby',
    color:'linear-gradient(135deg,#001a0e 0%,#002a16 100%)',
    badge:'Princess Vibes',
    mustOrder:[
      {name:'Garden Seasonal Starter',tip:'Menu changes by voyage. Ask your server what is freshest — they will recommend it immediately.'},
      {name:'Princess-themed Kids Main',tip:'Plated with princess details. Your 9yo will love this.'},
      {name:'Summer Herb Main',tip:'Typically a fish or chicken preparation. Consistently well-executed across sailings.'},
      {name:'Pixie Dust Lemonade (kids)',tip:'Arrives with edible glitter. Peak Disney moment for a 9yo. Order it.'},
      {name:'Garden Dessert Plate',tip:'Presentation is theatrical here. Do not skip it, especially for your 9yo.'},
    ],
    insider:[
      '🏰 Enchanted Summer is in Town Square — the Disney Princess area. Your 9yo is already in the right frame of mind walking here.',
      '✨ Schedule this on the same night as BBB for a full princess evening for your youngest.',
      '🌿 The most serene of the 6 rotational restaurants. Best for Night 3 or 4 when the family\'s energy is more mellow.',
      '🌸 BBB (Bibbidi Bobbidi Boutique) is steps away. The two experiences pair perfectly for one magical evening.',
    ],
    dress:'Smart casual',
  },
  animatortable: {
    id:'animatortable', name:"Animator's Table", emoji:'🎭',
    tagline:'The Animator\'s Palate experience on a different deck',
    color:'linear-gradient(135deg,#0a0a1a 0%,#0a102a 100%)',
    badge:'Tech Dining',
    mustOrder:[
      {name:'Nightly Signature Dish',tip:'Menu mirrors Animator\'s Palate broadly but with variations. Ask your server what is exclusive to this location.'},
      {name:'Singapore Heritage Dish',tip:'Like Animator\'s Palate, this restaurant features Singapore-inspired items. Verify with server on your sailing.'},
      {name:'Kids Animated Plate',tip:'Similar digital placemat experience. Kids draw, characters appear. Works the same way.'},
      {name:'Dessert Duo',tip:'Order two — let the kids share. The presentation quality is consistent across both Animator venues.'},
    ],
    insider:[
      '🎨 Same interactive digital drawing concept as Animator\'s Palate — kids draw on placemats and see them come alive on screens.',
      '📍 Located on Deck 9 vs Animator\'s Palate on Deck 5. The experience is similar; the room layout differs.',
      '🔄 Your rotation will assign you to one OR the other, not both. The experiences are comparable.',
      '✅ If assigned here, everything you know about Animator\'s Palate applies.',
    ],
    dress:'Smart casual',
  },
  pixarmarket: {
    id:'pixarmarket', name:'Pixar Market', emoji:'🎡',
    tagline:'Pixar universe all-day dining · Buffet by day · Table service at night',
    color:'linear-gradient(135deg,#1a0a00 0%,#2e1800 100%)',
    badge:'Most Casual',
    mustOrder:[
      {name:'Breakfast Buffet Spread',tip:'Wide Asian and Western options. Best quick-start breakfast on the ship. Great for boarding day fuel.'},
      {name:'Pixar Character-Themed Mains',tip:'Nods to Inside Out, Cars, Finding Nemo, Monsters University, Turning Red, The Incredibles. Kids identify every reference.'},
      {name:'Plant-Based Options',tip:'Best plant-based selection of all dining venues on the ship. Good for dietary needs.'},
      {name:'Quick Lunch Grab',tip:'Perfect for sea days when you want food fast and the kids want to get back to the pool.'},
    ],
    insider:[
      '📍 Located on Deck 17 near Toy Story Place — convenient before or after the water slides.',
      '🍽️ Buffet at breakfast and lunch, table service at dinner. The dinner rotation is included in your fare.',
      '🎡 Best casual restaurant for days when you want flexibility without formality.',
      '✅ Good for the 9yo\'s lunch on BBB day — quick, reliable, no fuss.',
    ],
    dress:'Casual — poolwear acceptable at lunch',
  },
};

const SHOWS = [
  {name:"Seas the Adventure",type:"Walt Disney Theatre · Deck 7 Forward",em:"🌊",dur:"~50 min",
    desc:"Goofy time-travels through Moana, The Little Mermaid, Aladdin, and Frozen. Classic Disney nostalgia. Real passengers report adults crying. 2 showings per night.",
    when:"Multiple evenings. Check Navigator app for times.",
    seat:"⚠️ FRONT rows are best — snow and bubble confetti effects are felt most in the first rows. NOT rows 5-12 as other guides say. Go centre-front. Arrive 20-25 min early. Kids on aisle seats.",
    book:"Book via Navigator app on boarding day. No photography or recording permitted inside.",
    km:"🌟🌟🌟🌟🌟",dnm:true},
  {name:"Remember (WALL-E's Remember)",type:"Walt Disney Theatre · Deck 7 Forward",em:"✨",dur:"~45 min",
    desc:"WALL-E travels through Coco, Up, Inside Out, The Little Mermaid, Aladdin, and Frozen to fix EVE. Confirmed as 'the best 45 minutes onboard' by multiple real passengers. Created exclusively for Disney Adventure.",
    when:"Multiple evenings. Rotates with Seas the Adventure. Check Navigator app.",
    seat:"Same rules — FRONT rows for best effects. Arrive 20-25 min early. Second showing is less crowded.",
    book:"Book via Navigator app. No photography or recording permitted.",
    km:"🌟🌟🌟🌟🌟",dnm:true},
  {name:"The Lion King: Celebration in the Sky",type:"Fireworks at Sea",em:"🎆",dur:"~15 min",
    desc:"The ONLY fireworks show at sea on any cruise ship worldwide. Confirmed for Disney Adventure. This is a standalone dedicated fireworks event — not tied to any themed night. Absolutely unmissable.",
    when:"Night 3 (typical). Check Navigator app — exact timing varies.",
    seat:"Upper deck, stern-facing for best angle. Get there 30-45 min early. Real passengers say spots go FAST.",
    book:"No booking. Show up early and claim your stern-facing position.",
    km:"🌟🌟🌟🌟🌟",dnm:true},
  {name:"Let's Set Sail",type:"Disney Imagination Garden · Embarkation Show",em:"🎊",dur:"~30 min",
    desc:"Embarkation day show at the Garden Stage. Real passengers confirm: Mickey, Minnie, Belle, Elsa, and Ms. Marvel. The ship honks to 'When You Wish Upon a Star' as it leaves. Multiple passengers report this as an unexpectedly emotional moment.",
    when:"Day 1, ~1630 at sail-away. E-Muster MUST be complete first.",
    seat:"Garden Stage area, Disney Imagination Garden (Deck 10). Port side for Marina Bay Sands view. Arrive 20 min early.",
    book:"No booking. Be at the Garden Stage at 1600 to claim space.",
    km:"🌟🌟🌟🌟🌟",dnm:true},
  {name:"Avengers Assemble!",type:"Deck Show · Marvel Landing",em:"⚡",dur:"~30 min",
    desc:"Confirmed Marvel deck event. Live characters, effects, superhero action. Your 7 and 9yo will be completely locked in.",
    when:"Check Navigator app. Typically daytime or early evening sea days.",
    seat:"Marvel Landing area, Deck 19. Arrive 20 min early. Centre stage position.",
    book:"No booking. Navigator app for time.",
    km:"🌟🌟🌟🌟🌟",dnm:true},
  {name:"Moana: Call of the Sea",type:"Wayfinder Bay · Outdoor",em:"🌺",dur:"~30 min",
    desc:"Live outdoor performance at Wayfinder Bay. Confirmed by real passengers. Great for your 5yo and 7yo. Best shows are morning or evening — midday heat at Wayfinder Bay is brutal based on real passenger reports.",
    when:"Check Navigator app. Avoid midday showings — Singapore heat makes open decks difficult.",
    seat:"Wayfinder Bay (Decks 10-11). Shaded areas fill fast. Arrive 15-20 min early.",
    book:"No booking.",
    km:"🌟🌟🌟🌟",dnm:false},
  {name:"Captain Jack Sparrow & The Siren Queen",type:"Garden Stage · Disney Imagination Garden",em:"🏴‍☠️",dur:"~30 min",
    desc:"Swashbuckling pirate adventure at the Garden Stage — guests help Captain Jack hunt for treasure. Interactive. Your 7 and 9yo are the exact target age for this.",
    when:"Check Navigator app. Multiple times daily.",
    seat:"Garden Stage, Deck 10. Arrive 15 min early. Kids to the front.",
    book:"No booking.",
    km:"🌟🌟🌟🌟",dnm:false},
  {name:"Duffy and The Friend Ship",type:"Garden Stage · Disney Imagination Garden",em:"🐻",dur:"~25 min",
    desc:"First-ever Duffy show on a Disney cruise ship. Original songs, character meet-and-greets. Confirmed. Your 5yo will be captivated. Duffy and Friends are popular in Asia — this is a big deal for the region.",
    when:"Check Navigator app.",
    seat:"Garden Stage, Deck 10. Kids to the front. Arrive 10 min early.",
    book:"No booking.",
    km:"🌟🌟🌟🌟",dnm:false},
  {name:"Baymax: Big Hero 6 Fitness Expo",type:"Deck Event · Marvel Landing area",em:"🤖",dur:"~20 min",
    desc:"Baymax leads a fitness-themed interactive deck event. Confirmed by multiple passengers on B2B sailings. Hands-on and interactive — good for kids who want to move rather than sit and watch.",
    when:"Check Navigator app. Typically mornings on sea days.",
    seat:"No booking. Arrive 10 min early.",
    book:"No booking required.",
    km:"🌟🌟🌟",dnm:false},
];

const CHECKLIST_ITEMS = [
  {cat:"⚡ Do Now (Booking Window Opens)",items:[
    {t:"Download Disney Cruise Line Navigator app",s:"iOS or Android — your command centre for all 4 nights"},
    {t:"Complete Online Check-In for all 5 family members",s:"Upload passport photos. Unlocks earlier boarding slot."},
    {t:"Book Port Arrival Time (PAT)",s:"Earliest slot = longest day on ship. Go for 11am window."},
    {t:"Pre-register kids for Oceaneer Club",s:"Do this in app now — skip the queue on boarding day"},
    {t:"Set alarm for character meet booking window",s:"Midnight SG time on your booking window day. Characters go FAST."},
    {t:"Book Bibbidi Bobbidi Boutique for your 9yo",s:"Princess makeover. Sells out weeks before sailing. Non-negotiable."},
    {t:"Book Palo (optional adults-only dinner)",s:"If you want 1 night just the two of you — kids go to Oceaneer Club"},
  ]},
  {cat:"📦 2 Weeks Before",items:[
    {t:"Buy door magnet supplies",s:"Print designs, laminate, attach adhesive magnets. No tape allowed on doors."},
    {t:"Join Disney Adventure Singapore Facebook group",s:"Sign up for Fish Extender gift exchange. Buy small gifts ($3–5/cabin)."},
    {t:"No Pirate Night — skip costumes",s:"Confirmed by PlanDisney (official Disney). Captain Jack show is a regular deck show. No themed night, no costume dinner."},
    {t:"Get formal outfits for Hollywood Spotlight Club / gala night",s:"1 dinner is semi-formal. Kids too. Hollywood Spotlight Club is the dressed-up restaurant."},
    {t:"Purchase seasickness patches (Kwells/Scopoderm)",s:"Put on the MORNING you board — not on the ship."},
    {t:"Buy a power strip (non-surge protector type)",s:"Surge protectors are confiscated. Plain power strip only."},
  ]},
  {cat:"✅ Day Before",items:[
    {t:"Pack carry-on with boarding day essentials",s:"Meds, swimwear, charger, snacks, passports — bags go to cabin at 4–6pm"},
    {t:"Label all checked bags with cabin number",s:"Deck 13, cabin number — write it big. Attach luggage tags DCL sends."},
    {t:"Print or screenshot boarding documents",s:"The app sometimes lags at check-in. Screenshots save lives."},
    {t:"Charge all devices + power bank",s:"Navigator app drains battery fast on boarding day"},
    {t:"Prepare door magnets, fish extender gifts in carry-on",s:"You'll set them up in the first 30 mins on the ship"},
    {t:"Have a light lunch at home before heading out",s:"Boarding buffet is chaotic. Eat before you leave Bedok."},
  ]},
  {cat:"🚗 Boarding Day",items:[
    {t:"Put seasickness patch behind ear before leaving home",s:"Behind the ear, clean dry skin. It takes 1–2hrs to work."},
    {t:"Book GrabXL (7-seater) at 0915 for 0930 departure",s:"Macpherson → KPE → Marina Coastal Drive. ~35-45 min. SGD 38-50."},
    {t:"Drop bags with kerb porter at MBCC",s:"Tip $2–3 USD. You won't see bags until 4–6pm."},
    {t:"Open Navigator app IMMEDIATELY on boarding",s:"Book characters, shows, check dining rotation — first 15 mins are gold"},
  ]},
];

const PACKING = [
  {cat:"🔑 Non-Negotiables",items:[
    {t:"Power strip (non-surge protector)",tip:"Surge protectors get confiscated. Buy a plain strip from Daiso."},
    {t:"Seasickness patches (Scopoderm / Kwells)",tip:"Behind ear, 2hrs before sailing. NOT after. Travellers swear by this."},
    {t:"Portable power bank (10,000+ mAh)",tip:"Navigator app kills battery. You need this by Day 2."},
    {t:"Night lights × 2",tip:"Cabin blackout curtains are nuclear-grade. Kids will wake up terrified without one."},
    {t:"Passports for all 5",tip:"Required for boarding even though this is a cruise to nowhere. Keep in your carry-on, not checked bags."},
    {t:"Navigator app pre-downloaded offline maps",tip:"Ship Wi-Fi can lag. Cache everything you can before boarding."},
  ]},
  {cat:"👗 Clothes (Real Traveller Intel)",items:[
    {t:"Swimwear × 2 sets per person",tip:"Things get wet. You WILL be doing laundry otherwise. Pack two."},
    {t:"Formal outfit for Hollywood Spotlight Club night",tip:"One semi-formal night. This is it. Don't overpack formal wear."},
    {t:"Full pirate outfits for all 5",tip:"⚠️ NO Pirate Night on Disney Adventure (PlanDisney confirmed). Captain Jack show is a regular show. No ship-wide costume event."},
    {t:"Flip flops + water shoes for kids",tip:"The pool deck gets HOT. Water shoes prevent burns. Travellers mention this constantly."},
    {t:"Light rain poncho for each person",tip:"Deck parties happen rain or shine. 10pm fireworks in a downpour = still magical but you'll want a poncho."},
    {t:"Extra socks × lots",tip:"Kids go through socks in 6 hours on a ship. Pack more than you think."},
    {t:"Lanyard for each kid",tip:"Pin trading! Kids clip character pins on their lanyard. Buy the DCL starter set on Day 1."},
  ]},
  {cat:"🧴 Health & Comfort",items:[
    {t:"Sunscreen SPF50+ in large quantity",tip:"You will use it all. Pool deck is relentless. Buy before boarding — ship prices are steep."},
    {t:"Basic first aid (Panadol, Bandaids, antihistamine)",tip:"Ship has a medical centre but at a price. Bring your own basics."},
    {t:"Reusable water bottle per person",tip:"Free water stations throughout the ship. Saves you buying constantly."},
    {t:"Small clip fan",tip:"Cabins can get warm. A tiny USB clip fan pointed at beds = everyone sleeps better."},
    {t:"Kids ear plugs or sleep headphones",tip:"Ship engine hum is real at night. Your 5yo might notice it."},
    {t:"Laundry detergent pods",tip:"Ship has a laundromat. Run one load mid-cruise. Saves repacking."},
  ]},
  {cat:"🎒 Cruise-Specific Must-Haves",items:[
    {t:"Door magnet set (pre-made)",tip:"No tape. Pre-make at home. Shopee or print + laminate + adhesive magnets."},
    {t:"Magnetic hooks × 3",tip:"For Fish Extender bag + hanging wet swimwear + towels outside cabin."},
    {t:"Small mesh laundry bags",tip:"Toss kids' wet swimwear in. Doesn't smell up the luggage."},
    {t:"Zip-lock bags (varied sizes)",tip:"For wet stuff, snacks, sandy shoes. Seriously — bring lots."},
    {t:"Pixie Dusting gifts (small trinkets)",tip:"⚠️ Items HAVE been stolen from door pouches on Disney Adventure. Use a lockable pouch. Keychains, Singapore sweets, stickers for ~8-10 cabins."},
    {t:"USD small bills for cash tips",tip:"USD 5s and 10s. Tip envelopes are in your cabin on final night."},
    {t:"HDMI cable (optional)",tip:"Some cabins have HDMI TVs. Lets kids watch downloaded shows on the big screen."},
    {t:"Waterproof phone pouch",tip:"Toy Story Place water slides + deck parties. Your phone will get wet. Protect it."},
  ]},
];

const GEMS = [
  {t:"HEAT KILLS YOUR DAY PLAN",tx:"Singapore humidity is brutal. Real passengers report the open top deck becomes a ghost town by 1000. One show (Jack-Jack's Diaper Dash) had to <strong>relocate mid-event</strong> because the mat was too hot for infants. Rule: all outdoor activities before 1000 or after 1700. Non-negotiable."},
  {t:"Ironcycle Goes Down. Have a Backup.",tx:"<strong>No reservations. Hours 1000–2100.</strong> Confirmed booking trick: check the app right before release times — <strong>12:28–12:29pm, 2:59pm, 3:44pm</strong>. Slots are gone if you check on the hour or half-hour. Downtime peaks midday (heat kills electronics — confirmed by a Disney ride engineer onboard). Queue at 0930 for the 1000 open, or try during first dinner seating (~1800) when crowds drop."},
  {t:"Selfies at Sea — But Walk-Up Meets Exist",tx:"The scheduled 'Selfies at Sea' sessions are distanced photos only. BUT <strong>traditional walk-up character meets with contact have been confirmed happening</strong> — Snow White and Mickey were spotted in Town Square with no reservation needed. Ask cast members every morning. Characters also wander decks unannounced."},
  {t:"NO Mickey Ice Cream Bars on This Ship",tx:"<strong>Disney Adventure does not have Mickey-shaped ice cream bars</strong>. This surprised every single reviewer. Confirmed missing by multiple passengers. Do not tell the kids to expect it. Soft serve in Toy Story Place is your substitute."},
  {t:"Pixie Dusting = Real Theft Risk",tx:"On Disney Adventure, the door gift exchange is called 'Pixie Dusting.' Multiple maiden voyage passengers had items stolen from corridor pouches. <strong>Disney is not liable</strong> — it's unofficial. Use a small lockable pouch and don't leave anything valuable. CCTV helped some guests recover items."},
  {t:"NO Pirate Night on Disney Adventure",tx:"<strong>Disney Adventure has no Pirate Night</strong> — confirmed by PlanDisney (official Disney panel, March 2026) and EatSleepDisney: 'Pirate Night is NOT offered on Singapore sailings.' Captain Jack Sparrow & The Siren Queen is a real confirmed deck show but it is not a ship-wide themed night. No costume dinner, no special menu. Do not pack dedicated pirate costumes."},
  {t:"Front Rows Are Best for Theatre Shows",tx:"Ignore guides saying rows 5-12. <strong>Real passengers confirm: FRONT rows are best</strong> for 'Seas the Adventure' and 'Remember' — that's where snow and confetti effects land. No photography or recording in the Walt Disney Theatre. Arrive 20-25 min early."},
  {t:"No Deck 14 — You're on 13, Then 15",tx:"Disney Adventure skips Deck 14 entirely (unlucky number in Asia). Ship goes: 12, 13, 15, 16... <strong>Your Deck 13 cabin sits directly below Deck 15.</strong> Important for navigation. Don't search for Deck 14."},
  {t:"In-Room Bacha Coffee — Use It",tx:"Your cabin has complimentary <strong>Bacha Coffee and TWG Tea</strong> with a Bacha kettle. Multiple passengers said it was so good they couldn't return to home coffee. Use it every morning before heading out. Saves queuing at Cove Café."},
  {t:"Ship Is 342m Long — Buffer 15 Minutes",tx:"<strong>Allow 10-15 min walking time between any two areas.</strong> Real passengers got lost repeatedly — lower ceilings create disorientation. Navigation anchor: Disney Imagination Garden (Deck 10) is the heart of the ship. Use it to reorient whenever confused."},
  {t:"Free WiFi: WhatsApp + iMessage Only",tx:"Ship WiFi covers <strong>WhatsApp, iMessage, and Navigator app for free</strong>. You only need to buy a package for web browsing, social media, or streaming. The free tier is enough to coordinate with your wife between activities."},
  {t:"Room Service Breakfast (Free)",tx:"Order via app the night before for morning delivery. <strong>Free — tip only</strong> (~USD 3-5). Kids wake up to food at the cabin door. One of the most practical low-cost wins on the ship."},
  {t:"Free Soft Serve in Toy Story Place",tx:"Soft serve machines in Toy Story Place are <strong>self-serve and free</strong>. Your kids will locate them within 15 minutes of boarding. It becomes a religion by Day 2. Note: NOT Mickey-bar shaped. There are no Mickey bars on this ship."},
  {t:"Quick-Service Hidden Gems Beyond Pixar Market",tx:"Four spots passengers love but miss: <strong>Grandma Tala's</strong> (buttermilk fried chicken + fries — best casual food on ship), <strong>Cosmic Kebabs</strong> (lamb shawarma), <strong>Mowgli's</strong> (butter chicken and naan), <strong>Tiana's Bayou</strong> (beignets, cold brew for a fee, hidden forest seating inside the bar — bring the 9yo here). All included in fare except cold brew."},
];

// ─────────────────────────────── COMPONENTS ────────────────────────────────

function CheckItem({ item, checked, onToggle }) {
  return (
    <div className="ci" onClick={onToggle}>
      <div className={`cb ${checked ? 'on' : ''}`}>
        {checked && <span style={{fontSize:'10px',color:'#001220',fontWeight:900}}>✓</span>}
      </div>
      <div style={{flex:1}}>
        <div className={`cl ${checked ? 'done' : ''}`}>{item.t}</div>
        {item.s && <span className="csub">{item.s}</span>}
      </div>
    </div>
  );
}

function PackItem({ item, packed, onToggle }) {
  return (
    <div className="pi" onClick={onToggle}>
      <div className={`pcb ${packed ? 'on' : ''}`}>
        {packed && <span style={{fontSize:'9px',color:'#001220',fontWeight:900}}>✓</span>}
      </div>
      <div style={{flex:1}}>
        <div className={`pt ${packed ? 'done' : ''}`}>{item.t}</div>
        {item.tip && <span className="ptip">💬 {item.tip}</span>}
      </div>
    </div>
  );
}

function DayCard({ n, cls, title, sub, children }) {
  const [open, setOpen] = useState(n === 1);
  return (
    <div className="card" style={{padding:'11px 12px',marginBottom:'8px'}}>
      <div className="day-hdr" onClick={() => setOpen(!open)}>
        <div className={`dnum ${cls}`}>{n}</div>
        <div className="day-info"><h3>{title}</h3><p>{sub}</p></div>
        <div className={`chev ${open ? 'open' : ''}`}>▼</div>
      </div>
      {open && <div className="timeline">{children}</div>}
    </div>
  );
}

function TB({ t, tx, note, nc, type='' }) {
  return (
    <div className={`tb ${type}`}>
      <div className="tbt">{t}</div>
      <div className="tbd">{tx}</div>
      {note && <div className={`tbn ${nc||'tg'}`}>{note}</div>}
    </div>
  );
}

function ShowCard({ show }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="show-card">
      <div className="show-hdr" onClick={() => setOpen(!open)}>
        <div className="show-em">{show.em}</div>
        <div className="show-meta" style={{flex:1}}>
          <h3>{show.name}</h3>
          <p>{show.type} · {show.dur}</p>
          {show.dnm && <span className="dnm-badge">⭐ DON'T MISS</span>}
        </div>
        <div className={`chev ${open ? 'open' : ''}`} style={{marginTop:'4px'}}>▼</div>
      </div>
      {open && (
        <div className="show-body">
          <p className="show-desc">{show.desc}</p>
          <div className="seat-box">
            🎟️ <strong>Best Seats:</strong> {show.seat}
          </div>
          <div style={{marginTop:'8px',color:'rgba(255,255,255,.55)',fontSize:'11.5px'}}>
            🕐 {show.when}
          </div>
          <div style={{marginTop:'4px',color:'rgba(255,255,255,.55)',fontSize:'11.5px'}}>
            📱 {show.book}
          </div>
          <div className="km">Kids Meter: {show.km}</div>
        </div>
      )}
    </div>
  );
}

function RestCard({ rest, nightLabel }) {
  if (!rest) return (
    <div className="card" style={{textAlign:'center',padding:'20px'}}>
      <div style={{color:'var(--dim)',fontSize:'13px'}}>Select a restaurant above for {nightLabel}</div>
    </div>
  );
  return (
    <div className="rest-card">
      <div className="rest-hdr" style={{background:rest.color}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
          <span style={{fontSize:'22px'}}>{rest.emoji}</span>
          <div>
            <div className="rest-name">{rest.name}</div>
            <div className="rest-tag">{rest.tagline}</div>
          </div>
          <span className="badge bg" style={{marginLeft:'auto',flexShrink:0}}>{rest.badge}</span>
        </div>
        <div style={{fontSize:'10.5px',color:'rgba(255,255,255,.5)',marginTop:'2px'}}>
          👗 {rest.dress}
        </div>
      </div>
      <div className="rest-body">
        <div style={{fontSize:'10.5px',fontWeight:800,color:'var(--gold)',letterSpacing:'1px',
          textTransform:'uppercase',marginBottom:'7px'}}>🍽️ Must Order</div>
        {rest.mustOrder.map((m,i) => (
          <div key={i} className="mo-item">
            <div className="mo-name">⭐ {m.name}</div>
            <div className="mo-tip">{m.tip}</div>
          </div>
        ))}
        <div style={{fontSize:'10.5px',fontWeight:800,color:'var(--gold)',letterSpacing:'1px',
          textTransform:'uppercase',margin:'10px 0 6px'}}>💡 Insider Tips</div>
        {rest.insider.map((tip,i) => (
          <div key={i} className="insider-tip">
            <span style={{flexShrink:0}}></span>
            <span style={{flex:1}}>{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────── TABS ────────────────────────────────

const KIDS_DATA = [
  {k:'k9', em:'👧', age:'9yo', ht:'1.20m'},
  {k:'k7', em:'👦', age:'7yo', ht:'1.10m'},
  {k:'k5', em:'👦', age:'5yo', ht:'0.90m'},
];
const RIDES = [
  {id:'iron',  label:'🎢 Ironcycle Test Run',  min:120, minStr:'120cm', note:'Roller coaster · 820ft · 30ft above deck · Deck 19',
   eligible:(ht)=>ht>=120, underSeven:false},
  {id:'pym',   label:'🏎️ Pym Quantum Racers', min:89,  minStr:'89cm',  note:'Mini cars · Ant-Man · Kids under 7 need adult 14+',
   eligible:(ht)=>ht>=89,  underSeven:true},
  {id:'groot', label:'🪐 Groot Galaxy Spin',   min:81,  minStr:'81cm',  note:'Spinner · Guardians · Kids under 7 need adult 14+',
   eligible:(ht)=>ht>=81,  underSeven:true},
];
const HEIGHT_MAP = {k9:120, k7:110, k5:90};
const AGE_MAP    = {k9:9,   k7:7,   k5:5};

function KidsTab() {
  const init = {};
  KIDS_DATA.forEach(k => { init[k.k]={}; RIDES.forEach(r => { init[k.k][r.id]=false; }); });
  const [ridden, setRidden] = useState(init);
  const toggleRide = (k, rid) => setRidden(p => ({...p,[k]:{...p[k],[rid]:!p[k][rid]}}));
  const possible = KIDS_DATA.reduce((s,k)=>s+RIDES.filter(r=>r.eligible(HEIGHT_MAP[k.k])).length,0);
  const done = KIDS_DATA.reduce((s,k)=>s+RIDES.filter(r=>ridden[k.k][r.id]).length,0);

  return (
    <div className="content">
      <div className="iron-hero">
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}>
          <span style={{fontSize:'24px'}}>⚡</span>
          <div>
            <div className="iron-title">MARVEL LANDING MISSION</div>
            <div className="iron-sub">3 confirmed rides · Deck 19 · All heights verified from official Disney source</div>
          </div>
        </div>

        <div className="hl r" style={{margin:'8px 0 8px',fontSize:'11px'}}>
          🎢 <strong>Ironcycle Test Run min: 120cm confirmed.</strong> Only 9yo (1.20m) qualifies. BUT your 7yo and 5yo both qualify for Pym Quantum Racers (89cm) and Groot Galaxy Spin (81cm). Tap rides to mark as done.
        </div>

        {RIDES.map(ride => (
          <div key={ride.id} style={{marginBottom:'10px'}}>
            <div style={{fontSize:'11px',fontWeight:800,color:'rgba(255,255,255,.75)',marginBottom:'4px',
              display:'flex',alignItems:'center',gap:'6px'}}>
              <span>{ride.label}</span>
              <span style={{background:'rgba(245,200,66,.12)',color:'var(--gold)',padding:'1px 7px',
                borderRadius:'10px',fontSize:'9px',fontWeight:700}}>Min {ride.minStr}</span>
            </div>
            <div style={{fontSize:'9.5px',color:'rgba(255,255,255,.38)',marginBottom:'5px'}}>{ride.note}</div>
            <div style={{display:'flex',gap:'7px'}}>
              {KIDS_DATA.map(kid => {
                const ok = ride.eligible(HEIGHT_MAP[kid.k]);
                const needsAdult = ok && ride.underSeven && AGE_MAP[kid.k] < 7;
                const isDone = ridden[kid.k][ride.id];
                return (
                  <div key={kid.k} onClick={()=>ok && toggleRide(kid.k,ride.id)}
                    style={{flex:1,background:isDone?'rgba(45,138,74,.25)':ok?'rgba(255,255,255,.05)':'rgba(196,30,58,.1)',
                      border:`1px solid ${isDone?'rgba(45,138,74,.5)':ok?'rgba(255,255,255,.1)':'rgba(196,30,58,.25)'}`,
                      borderRadius:'8px',padding:'7px 4px',textAlign:'center',
                      cursor:ok?'pointer':'default',opacity:ok?1:0.55}}>
                    <div style={{fontSize:'16px'}}>{kid.em}</div>
                    <div style={{fontSize:'8.5px',fontWeight:800,color:'rgba(255,255,255,.5)',marginTop:'2px'}}>{kid.ht}</div>
                    {needsAdult && <div style={{fontSize:'7.5px',color:'#f5c842',marginTop:'1px'}}>+adult</div>}
                    <div style={{fontSize:'9px',fontWeight:800,marginTop:'2px',
                      color:isDone?'#6ddb80':ok?'rgba(255,255,255,.4)':'#ff8091'}}>
                      {isDone?'✅':ok?'○':'✗'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{fontSize:'11px',color:'rgba(255,255,255,.4)',textAlign:'center',marginTop:'6px'}}>
          {done}/{possible} eligible rides completed
        </div>
        <div className="prog"><div className="prog-fill" style={{width:`${possible>0?done/possible*100:0}%`}} /></div>

        <ul className="lst" style={{marginTop:'10px'}}>
          <li><div className="dot dr" /><strong>Ironcycle: 9yo only (120cm exact minimum, confirmed).</strong> 2 per car, inline. Closed-toe secured shoes required.</li>
          <li><div className="dot dg" /><strong>Pym Quantum Racers + Groot Galaxy Spin: all 3 kids ride.</strong> 5yo (90cm) needs a parent in the car — take turns.</li>
          <li><div className="dot dbl" /><strong>Book via Navigator app immediately on boarding.</strong> Marvel Landing is the most in-demand area on the ship.</li>
          <li><div className="dot dg" />Best time: <strong>0830 on any sea day.</strong> Shortest queue of the entire cruise.</li>
          <li><div className="dot dr" />Ironcycle was not running on the maiden voyage (March 2026) but confirmed operational shortly after. Check Navigator app status on boarding day.</li>
        </ul>
      </div>

      {/* Oceaneer Club */}
      <div className="shdr">🏰 Oceaneer Club (Ages 3–10)</div>
      <div className="card gc">
        <div className="card-title">Your 3 Kids' Second Home <span className="badge bgr">Pre-Register in App</span></div>
        <ul className="lst">
          <li><div className="dot dgr" />Disney, Pixar, Marvel and Star Wars themed zones. Supervised. Included in your fare.</li>
          <li><div className="dot dgr" /><strong>Pre-register in Navigator app before boarding</strong> — walk in on Day 1 without queuing.</li>
          <li><div className="dot dg" /><strong>Kids never want to leave.</strong> Use Oceaneer Club for 1.5–2 hrs of adult time on sea days. Spa, pool, quiet deck.</li>
          <li><div className="dot dbl" />Check-in and out anytime. Snacks provided. No distress calls.</li>
        </ul>
      </div>

      {/* Toy Story Place Water */}
      <div className="shdr">💦 Toy Story Place — Water Area</div>
      <div className="card pc">
        <div className="card-title">🌊 Water Slides + Splash Pads <span className="badge bpu">No AquaMouse here</span></div>
        <ul className="lst">
          <li><div className="dot dr" />Disney Adventure does <strong>not</strong> have AquaMouse (that is on Disney Wish/Treasure). The water attraction is Toy Story Place on the upper decks.</li>
          <li><div className="dot dg" />Toy Story Place has: <strong>large family pool, multiple whirlpools, towering water slides, and interactive splash pads.</strong></li>
          <li><div className="dot dg" />All 3 kids will thrive here. The splash pads are perfect for the 5yo; the water slides for the 7 and 9yo.</li>
          <li><div className="dot dbl" />Go at <strong>0800–0900 on sea days</strong> for minimal queues. Gets crowded by 1100.</li>
          <li><div className="dot dg" /><strong>Pizza Planet</strong> is steps away in Toy Story Place — easiest lunch on any sea day.</li>
        </ul>
      </div>

      {/* Character Meets */}
      <div className="shdr">⭐ Character Meets — Read This First</div>
      <div className="card rc">
        <div className="card-title">⚠️ Selfies at Sea — Hybrid System <span className="badge br">Real Passenger Alert</span></div>
        <ul className="lst">
          <li><div className="dot dr" /><strong>Disney Adventure does NOT have traditional character hugs by default.</strong> The system launched as "Selfies at Sea" — distanced photos only, no physical contact. This drew massive backlash.</li>
          <li><div className="dot dg" />Disney partially rolled back in mid-March 2026. As of latest sailings: <strong>hybrid system</strong> — some sessions are still distanced "Selfies at Sea" via app, others have reverted to walk-up traditional meets with contact.</li>
          <li><div className="dot dbl" /><strong>Strategy:</strong> Book "Selfies at Sea: Disney Royals" (princesses) and "Disney Pals" (Mickey/Minnie/Donald/Pluto/Goofy) via app on boarding. ALSO ask cast members daily about unscheduled walk-up meets — these have been confirmed to happen.</li>
          <li><div className="dot dg" />Characters confirmed on board: Mickey, Minnie, Donald, Pluto, Goofy, Duffy + Friends, Moana, Captain Jack Sparrow, Snow White, Jasmine, Rapunzel, Elsa, Belle, and others.</li>
          <li><div className="dot dg" />Random character wanderings on deck DO happen. Real passengers spotted Donald, Minnie, Ariel, and Duffy friends walking the decks without queues. <strong>Keep the Navigator app open</strong> for live character location alerts.</li>
          <li><div className="dot dr" />The 9yo's best formal character moment: schedule a "Disney Royals" Selfies at Sea session — princesses in a group setting. Then supplement with whatever walk-up meets appear.</li>
        </ul>
      </div>

function ChecklistTab({ checks, setChecks }) {
  const total = CHECKLIST_ITEMS.flatMap(c=>c.items).length;
  const done = checks.filter(Boolean).length;
  let idx = 0;
  return (
    <div className="content">
      <div className="prog-label"><span>Pre-Cruise Progress</span><span>{done}/{total} done</span></div>
      <div className="prog"><div className="prog-fill" style={{width:`${done/total*100}%`}} /></div>
      {CHECKLIST_ITEMS.map(cat => (
        <div key={cat.cat}>
          <div className="shdr">{cat.cat}</div>
          <div className="card">
            {cat.items.map(item => {
              const i = idx++;
              return <CheckItem key={i} item={item} checked={checks[i]}
                onToggle={() => setChecks(p => { const n=[...p]; n[i]=!n[i]; return n; })} />;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function DaysTab() {
  return (
    <div className="content">
      <div className="hl r" style={{marginBottom:'10px'}}>
        🌊 4 nights · ALL sea days · No ports. Light meal at home before boarding — do not rely on the ship for your first meal.
      </div>
      <DayCard n={1} cls="dn1" title="🛳️ Embarkation" sub="Board 1245 · First 15 min = gold">
        <TB t="0600" tx="Wake. Patch behind ear NOW — Scopoderm or Kwells. Takes 2hrs to kick in. Non-negotiable." type="cr" note="Do not skip" nc="tr" />
        <TB t="0800" tx="Light meal at home (brunch). Boarding buffet is chaos — arrive fed, not hungry." note="Pre-board feed" nc="tg" />
        <TB t="0915" tx="Book GrabXL now (7-seater). Family of 5 + 4-night luggage will not fit a regular GrabCar." type="cr" note="GrabXL only" nc="tr" />
        <TB t="0930" tx="Depart Macpherson. Tell driver: via KPE → Marina Coastal Drive. Avoids CBD and CTE. Budget ~SGD 38–50." type="te" />
        <TB t="1015" tx="Arrive MBCC. Drop checked bags with kerb porter — tip SGD 3–5. You won't see bags until 1600–1800." note="Label bags first" nc="tg" />
        <TB t="1045" tx="Terminal check-in, security, boarding lounge. Keep carry-on with meds, swimwear, charger, passports." />
        <TB t="1245" tx="BOARD. Take the ship photo at the gangway. They use it all cruise." type="cr" note="Board!" nc="tr" />
        <TB t="1300" tx="🔥 APP SPRINT — open Navigator immediately. Book: Iron Cycle (9yo + 7yo), character meets, shows, AquaMouse. 15 minutes. Go." type="cr" note="Highest-value 15 min of trip" nc="tr" />
        <TB t="1330" tx="Light bite at Cabanas. Quick. Free." />
        <TB t="1400" tx="Cabin opens. 20 mins: set up door magnets + Fish Extender bag with the kids. Make it a mission." type="te" note="Door setup" nc="tt" />
        <TB t="1430" tx="Swimwear on. Pool and AquaMouse before the afternoon surge." type="pk" />
        <TB t="1530" tx="E-Muster via app — complete before 1630 or you miss the Sail Away party. Takes 10 min." type="cr" note="Mandatory" nc="tr" />
        <TB t="1630" tx="🎉 SAIL AWAY PARTY. All 5 on deck. Mickey, crew, confetti, Singapore skyline shrinking into the distance. Non-negotiable." type="pk" note="Don't miss" nc="tp" />
        <TB t="1800" tx="Rotational Dinner Night 1. Check Navigator for your restaurant assignment." type="te" />
        <TB t="1930" tx="Ship orientation walk. Kids locate: Oceaneer Club entrance, theatre, arcade, soft-serve machine." />
        <TB t="2100" tx="Free soft-serve at pool deck. Kids will find it themselves within the hour. Let them." type="pk" />
        <TB t="2130" tx="Kids to bed. Deck 13 blackout curtains = nuclear dark. They sleep well." />
      </DayCard>

      <DayCard n={2} cls="dn2" title="🌊 Sea Day 1" sub="Iron Cycle · Characters · Shows">
        <TB t="0600" tx="Wake early. Deck walk 0600–0700 = golden light, zero people, pure ship magic. Coffee from Cove Café." type="te" note="Secret window" nc="tt" />
        <TB t="0730" tx="Family breakfast — main dining room for the sit-down experience." />
        <TB t="0830" tx="🎢 MARVEL LANDING — go now. Ironcycle (9yo only), Pym Quantum Racers and Groot Galaxy Spin (all 3 kids). 0830 is the lowest-queue window of the entire cruise." type="cr" note="Lowest queue window" nc="tr" />
        <TB t="0930" tx="Drop kids at Oceaneer Club (pre-registered = walk straight in). Adults: spa, upper deck. Allow 10-15 min to walk between areas — ship is massive." type="pk" />
        <TB t="1000" tx="⚠️ HEAT WARNING: By 1000 the open decks get brutal in Singapore humidity. Real passengers report upper deck becomes a ghost town by midday. Plan all outdoor activities before 1000 or after 1700." type="cr" note="Real passenger warning" nc="tr" />
        <TB t="1100" tx="Collect kids. Woody and Jessie's Wild Slides (Toy Story Place, Decks 17-19). Go before the 1130 crowd peak." />
        <TB t="1300" tx="Lunch. Pixar Market (Deck 17, near slides) is fastest and most convenient." />
        <TB t="1430" tx="⭐ Selfies at Sea session (book via Navigator) OR check for walk-up meets. Ask cast members about unscheduled character appearances." type="cr" note="Check app for walk-ups" nc="tr" />
        <TB t="1630" tx="Rest. Cabin quiet time. 30 min is the minimum. Don't skip this." />
        <TB t="1800" tx="Rotational Dinner Night 2." type="te" />
        <TB t="1930" tx="🌊 Seas the Adventure OR ✨ Remember (WALL-E) at Walt Disney Theatre, Deck 7 Forward. FRONT rows for best effects (snow + confetti). No photo/recording." type="pk" note="Front rows for effects" nc="tp" />
        <TB t="2130" tx="Kids to bed. Order room service breakfast via app for tomorrow (free — tip only)." />
      </DayCard>

      <DayCard n={3} cls="dn3" title="🎆 Sea Day 2" sub="Captain Jack show · Rest HARD · Lion King fireworks at sea">
        <TB t="0600" tx="Wake. Second sea day — kids are in full cruise rhythm now." />
        <TB t="0700" tx="Breakfast. Let the kids pick." />
        <TB t="0800" tx="Woody and Jessie's Wild Slides — before the heat hits. Earliest queue of the day." type="te" note="Beat the heat" nc="tt" />
        <TB t="0900" tx="Marvel Landing follow-up — any rides the kids need to retry. Check Ironcycle status in Navigator app." />
        <TB t="0930" tx="Oceaneer Club drop. This is your last quiet adult window before the cruise turns festive." type="pk" />
        <TB t="1100" tx="Pick up kids. Pool or shaded areas — avoid unshaded upper deck midday." />
        <TB t="1300" tx="Lunch." />
        <TB t="1430" tx="Character meet session #2 — check Navigator app. Walk-up meets sometimes appear without notice, especially in Town Square. Keep checking." type="cr" note="Check app constantly" nc="tr" />
        <TB t="1600" tx="REST. This is non-negotiable. 'The Lion King: Celebration in the Sky' fireworks evening runs late. If kids don't nap, the 5yo melts at 1930. Force it." type="cr" note="Critical rest" nc="tr" />
        <TB t="1700" tx="Get to the stern deck early tonight — fireworks are unmissable. No Pirate Night on this ship." type="pk" note="Stern deck prep" nc="tp" />
        <TB t="1800" tx="Rotational Dinner Night 3. Regular dinner — no Pirate Night on Disney Adventure. Check Navigator for your restaurant." type="te" />
        <TB t="1845" tx="Head to stern deck IMMEDIATELY after dinner to claim your fireworks spot. Allow 10-15 min to walk from dining room. Real passengers say spots go FAST." type="cr" note="Go immediately" nc="tr" />
        <TB t="1930" tx="⚔️ Captain Jack Sparrow & The Siren Queen at Garden Stage — guests hunt treasure with Jack. Real confirmed show. Not a Pirate Night event." type="cr" />
        <TB t="2030" tx='🎆 "THE LION KING: CELEBRATION IN THE SKY" — the only fireworks show at sea on ANY cruise ship worldwide. Face the stern. From a moving ship. Over the ocean. Nothing else competes.' type="cr" note="Only fireworks at sea on Earth" nc="tr" />
        <TB t="2130" tx="Kids crash immediately. You: quiet drink at Taverna Portorosso or Wayfinder Bay." />

      <DayCard n={4} cls="dn4" title="✨ Sea Day 3" sub="Shop early · BBB · Farewell magic">
        <TB t="0600" tx="Final early deck walk. Last morning at sea. This one hits differently — savour it." type="te" />
        <TB t="0700" tx="Breakfast. Slow morning. Let the kids feel it." />
        <TB t="0800" tx="🛍️ SHOP NOW. Ship-exclusive merch sells out on the last sea day. Mickey ears, Spirit Jerseys (kids' sizes go first), Dooney bags, pin sets. First pick." type="cr" note="Go early" nc="tr" />
        <TB t="0930" tx="Last character meets. Kids are not exhausted yet — best photos of the trip." type="pk" />
        <TB t="1100" tx="Final pool session. Last AquaMouse run. Let the kids feel 'last time' without narrating it." />
        <TB t="1300" tx="Lunch. Let the kids order their single favourite thing they've eaten all cruise." />
        <TB t="1330" tx="👑 Bibbidi Bobbidi Boutique — your 9yo's main event. ~90 min. She exits as a princess." type="pk" note="Book in advance" nc="tp" />
        <TB t="1530" tx="Pack non-essentials. Label all luggage. Bags must be outside cabin door by 2200 tonight." type="cr" note="Bags out by 2200" nc="tr" />
        <TB t="1700" tx="Final dip. Final soft-serve. Final AquaMouse if queue allows." />
        <TB t="1800" tx="🎬 Gala / Farewell Dinner at 1923. Semi-formal. The fancy night. Kids look unreal in proper clothes." type="te" note="Dress code" nc="tg" />
        <TB t="1930" tx="Farewell show at the theatre. Bring something to wipe your eyes. It ends with Mickey waving goodbye." type="pk" />
        <TB t="2100" tx="Last deck walk. Stars above. Ocean below. Silence. Do not skip this." type="te" />
        <TB t="2130" tx="Kids to bed. Settle gratuities via Navigator app. Set 0600 alarm." />
        <TB t="2200" tx="BAGS OUT. Outside cabin door. Hard deadline." type="cr" note="Hard deadline" nc="tr" />
      </DayCard>

      <DayCard n={5} cls="dn5" title="🌅 Disembarkation" sub="Home to Macpherson · Mission complete">
        <TB t="0600" tx="Wake. Breakfast at Cabanas — room key still works until you physically leave the ship." type="te" />
        <TB t="0730" tx="Head to disembarkation lounge. Check Navigator app for your colour/zone assignment." />
        <TB t="0830" tx="Disembark. Collect labelled bags at terminal. Clear customs." />
        <TB t="0900" tx="Book GrabXL home. Macpherson. ~30 min, ~SGD 30–40. Kids will fall asleep within 10 minutes." type="pk" note="Chan family: mission complete" nc="tp" />
      </DayCard>
    </div>
  );
}

function DiningTab({ rotation, setRotation }) {
  const NIGHTS = ['Night 1','Night 2','Night 3','Night 4'];
  const OPTIONS = [
    {value:'',label:'— Select restaurant —'},
    {value:'hollywood',     label:"🎬 Hollywood Spotlight Club"},
    {value:'navigators',    label:"⚓ Navigator's Club"},
    {value:'animatorpalate',label:"🎨 Animator's Palate"},
    {value:'animatortable', label:"🎭 Animator's Table"},
    {value:'enchantedsummer',label:"🌸 Enchanted Summer"},
    {value:'pixarmarket',   label:"🎡 Pixar Market"},
  ];

  return (
    <div className="content">
      <div className="hl b" style={{marginBottom:'10px'}}>
        📋 You rotate through all 3 restaurants over 4 nights. Your servers follow you — get to know them on Night 1.
      </div>

      <div className="shdr">🗓️ Set Your Rotation</div>
      <div className="rot-grid">
        {NIGHTS.map((night,i) => (
          <div key={i} className="rot-slot">
            <label>{night}</label>
            <select value={rotation[i]||''} onChange={e=>{
              const r=[...rotation]; r[i]=e.target.value; setRotation(r);
            }}>
              {OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        ))}
      </div>

      <div className="hl" style={{marginBottom:'12px',fontSize:'11.5px'}}>
        💡 Tip: Schedule <strong>Hollywood Spotlight Club</strong> on Night 1 or 2 when energy is high. Schedule <strong>Enchanted Summer</strong> on the same night as BBB for your 9yo's princess evening.
      </div>

      {rotation.some(r=>r) ? (
        <>
          <div className="shdr">🍽️ Your Restaurant Guides</div>
          {[...new Set(rotation.filter(Boolean))].map(rid => (
            <RestCard key={rid} rest={RESTAURANTS[rid]} nightLabel={rid} />
          ))}
        </>
      ) : (
        <>
          <div className="shdr">🍽️ All Restaurants</div>
          {Object.values(RESTAURANTS).map(r => <RestCard key={r.id} rest={r} />)}
        </>
      )}

      <div className="shdr">⭐ Dining Tips</div>
      <div className="card">
        <ul className="lst">
          <li><div className="dot dg" /><strong>Your servers follow you all 4 nights.</strong> Tip warmly on Night 1 — the rest of the cruise they'll remember your kids' names and food preferences.</li>
          <li><div className="dot dg" />First seating (~5:30pm) is more relaxed. Second seating (~8pm) is busier but good for kids who need afternoon naps.</li>
          <li><div className="dot dbl" />Order extras. It's all included. Order 2 entrees if curious. You cannot over-order.</li>
          <li><div className="dot dr" />Dietary restrictions and allergies: tell your head server on Night 1. They pre-prepare for the rest of the cruise without prompting.</li>
          <li><div className="dot dg" />The kids' menu has Mickey-shaped items at every restaurant. Reliable and safe for picky eaters.</li>
        </ul>
      </div>
    </div>
  );
}

function ShowsTab() {
  return (
    <div className="content">
      <div className="hl" style={{marginBottom:'10px'}}>
        🎭 Book shows via the Navigator app on boarding day. Second showings are always less crowded and identical in quality.
      </div>
      <div className="shdr">🎬 All Shows & Events</div>
      {SHOWS.map((s,i) => <ShowCard key={i} show={s} />)}
      <div className="card" style={{marginTop:'12px'}}>
        <div className="card-title">🎟️ Universal Seating Rules</div>
        <ul className="lst">
          <li><div className="dot dg" /><strong>Rows 5–12, centre orchestra</strong> = sweet spot for all main-stage shows. Effects, sight lines, and sound are all best here.</li>
          <li><div className="dot dr" />Avoid extreme side seats — lighting and projection effects are centre-weighted.</li>
          <li><div className="dot dbl" />Kids on aisle seats. The first 3 rows are too close for shows with ceiling projections.</li>
          <li><div className="dot dg" />Second show = same quality, 40% fewer people. Always prefer the second showing unless you need an early night.</li>
          <li><div className="dot dr" />For Lion King fireworks: arrive 30-45 min early. Upper deck, stern-facing. Railing spots go FAST — only fireworks show at sea on any cruise ship worldwide.</li>
        </ul>
      </div>
    </div>
  );
}

function PackTab({ packed, setPacked }) {
  const allItems = PACKING.flatMap(c=>c.items);
  const total = allItems.length;
  const done = packed.filter(Boolean).length;
  let idx = 0;
  return (
    <div className="content">
      <div className="prog-label"><span>Packing Progress</span><span>{done}/{total} packed</span></div>
      <div className="prog"><div className="prog-fill" style={{width:`${done/total*100}%`}} /></div>

      {PACKING.map(cat => (
        <div key={cat.cat}>
          <div className="pack-cat">{cat.cat}</div>
          {cat.items.map(item => {
            const i = idx++;
            return <PackItem key={i} item={item} packed={packed[i]||false}
              onToggle={()=>setPacked(p=>{const n=[...p];n[i]=!n[i];return n;})} />;
          })}
        </div>
      ))}

      <div className="shdr" style={{marginTop:'14px'}}>🛍️ Ship Shopping Strategy</div>
      <div className="card rc">
        <div className="card-title">What Sells Out (In Order) <span className="badge br">Day 1 Only</span></div>
        <ul className="lst">
          <li><div className="dot dr" /><strong>Ship-exclusive Mickey/Minnie ears</strong> — not sold anywhere else on Earth. Go first.</li>
          <li><div className="dot dr" /><strong>Spirit Jerseys (children's sizes S/M)</strong> — gone by Day 2 morning. Buy on boarding day.</li>
          <li><div className="dot dr" /><strong>Character plushies (Duffy / StellaLou)</strong> — Singapore-specific. Limited run.</li>
          <li><div className="dot dg" />Dooney & Bourke Disney Adventure bags — adults buy these on Day 1–2.</li>
          <li><div className="dot dg" />Limited pin sets — buy the set, not individual pins, for better value.</li>
          <li><div className="dot dbl" />Glow merch for Lion King fireworks night — light-up wands, headbands. Buy Day 1 afternoon.</li>
          <li><div className="dot dbl" />Last night (Day 4 evening): some items quietly discounted 15–25% to clear stock. Final sweep.</li>
        </ul>
      </div>
    </div>
  );
}

function SecretsTab() {
  return (
    <div className="content">
      <div className="hl" style={{marginBottom:'10px'}}>
        💎 These are what the average tourist misses. Read this tab once, remember it always.
      </div>
      {GEMS.map((g,i)=>(
        <div key={i} className="gem" data-n={String(i+1).padStart(2,'0')}>
          <div className="gem-title">✦ {g.t}</div>
          <div className="gem-text" dangerouslySetInnerHTML={{__html:g.tx}} />
        </div>
      ))}

      <div className="shdr" style={{marginTop:'4px'}}>💰 Tipping Guide</div>
      <div className="card">
        <div className="hl" style={{marginBottom:'10px',fontSize:'12px'}}>
          Auto-gratuity: ~<strong>USD 14.50/person/night</strong>. Family of 5 × 4 nights = <strong>~USD 290 (~SGD 390)</strong> auto-charged. Below is extra for exceptional service.
        </div>
        {[
          ['Stateroom Host','Cabin, turndown, towel animals','USD 20–40','envelope, last night'],
          ['Head Server + Server','Your dining team all 4 nights','USD 20 each','envelope, last night'],
          ['Room Service','Per delivery','USD 2–5','cash in hand'],
          ['Bar / Drinks','18% already added','Auto-included','no extra needed'],
          ['Kids Club Staff','Optional gesture','SGD 5–10 total','last day, cash'],
        ].map(([who,sub,amt,note],i)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',
            padding:'9px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
            <div>
              <div style={{color:'var(--text)',fontSize:'12.5px',fontWeight:700}}>{who}</div>
              <div style={{color:'var(--dim)',fontSize:'11px'}}>{sub}</div>
            </div>
            <div style={{textAlign:'right',flexShrink:0,marginLeft:'8px'}}>
              <div style={{color:'var(--gold)',fontWeight:800,fontSize:'13px'}}>{amt}</div>
              <div style={{color:'var(--dim)',fontSize:'10px'}}>{note}</div>
            </div>
          </div>
        ))}
        <div className="hl" style={{marginTop:'8px',fontSize:'11.5px'}}>
          💡 Bring <strong>USD 100–150 in small bills</strong> (USD 5s and 10s). Disney tip envelopes are in your cabin on the final night.
        </div>
      </div>

      <div className="shdr">🐘 Towel Animals</div>
      <div className="card gc">
        <ul className="lst">
          <li><div className="dot dgr" /><strong>Leave a note on Day 1:</strong> "Could you make us an elephant, monkey and swan across the 4 nights? Our kids would love it." They appreciate the direction.</li>
          <li><div className="dot dgr" /><strong>Leave the kids' stuffed animals on the bed before dinner.</strong> A great host incorporates them — Mickey riding a towel elephant = pure magic.</li>
          <li><div className="dot dg" />Leave sunglasses or a hat out. Hosts accessorise the animals. A towel monkey in your sunglasses is a 5yo's entire personality.</li>
          <li><div className="dot dg" />Request list: 🐘 Elephant · 🐒 Monkey · 🦢 Swan · 🦞 Lobster · 🐊 Croc · 🐬 Dolphin · 🦭 Seal</li>
        </ul>
      </div>

      <div className="shdr">🏠 Door Decor Rules</div>
      <div className="card">
        <ul className="lst">
          <li><div className="dot dg" /><strong>Magnets only.</strong> No tape, no adhesives — they damage the door coating and staff will remove them.</li>
          <li><div className="dot dg" />Print designs, laminate, attach adhesive magnets to back. SGD 15–20 total from Shopee or Daiso.</li>
          <li><div className="dot dbl" />Popular: family name + cabin number, kids' favourite character, pirate theme for Night 3.</li>
          <li><div className="dot dbl" />Magnetic hook on door = Fish Extender bag. You'll receive gifts from neighbours daily.</li>
        </ul>
      </div>
    </div>
  );
}

// ─────────────────────────────── MAIN APP ────────────────────────────────

const TABS = [
  {id:'kids',icon:'🎡',label:'Kids'},
  {id:'tasks',icon:'✅',label:'Tasks'},
  {id:'days',icon:'📅',label:'Days'},
  {id:'dining',icon:'🍽️',label:'Dining'},
  {id:'shows',icon:'🎭',label:'Shows'},
  {id:'pack',icon:'🎒',label:'Pack'},
  {id:'secrets',icon:'💎',label:'Secrets'},
];

const TOTAL_CHECK = CHECKLIST_ITEMS.flatMap(c=>c.items).length;
const TOTAL_PACK = PACKING.flatMap(c=>c.items).length;

export default function App() {
  const [tab, setTab] = useState('kids');
  const [checks, setChecks] = useState(Array(TOTAL_CHECK).fill(false));
  const [packed, setPacked] = useState(Array(TOTAL_PACK).fill(false));
  const [rotation, setRotation] = useState(['','','','']);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);
  const touchStartY = useRef(null);
  const scrollRef = useRef(null);

  const showToast = (title, msg) => {
    setToast({ title, msg });
    setTimeout(() => setToast(null), 5000);
  };

  const fetchFreshTip = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 200,
          messages: [{
            role: 'user',
            content: 'Give ONE crisp insider tip for Disney Adventure cruise Singapore 2025. Format: {"title":"short title","tip":"2 sentence tip"}. JSON only.'
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === 'text')?.text || '';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      showToast('✨ Fresh Tip', parsed.tip);
    } catch {
      showToast('✨ Tip of the Voyage', 'Check the Navigator app every morning at 7am — new character meet slots sometimes open overnight from cancellations.');
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  const onTouchStart = (e) => {
    if (scrollRef.current?.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const onTouchEnd = (e) => {
    if (touchStartY.current !== null) {
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      if (dy > 70) fetchFreshTip();
      touchStartY.current = null;
    }
  };

  const renderTab = () => {
    switch (tab) {
      case 'kids': return <KidsTab />;
      case 'tasks': return <ChecklistTab checks={checks} setChecks={setChecks} />;
      case 'days': return <DaysTab />;
      case 'dining': return <DiningTab rotation={rotation} setRotation={setRotation} />;
      case 'shows': return <ShowsTab />;
      case 'pack': return <PackTab packed={packed} setPacked={setPacked} />;
      case 'secrets': return <SecretsTab />;
      default: return null;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="starfield" />

        {/* Hero */}
        <div className="hero">
          <div className="hero-glow" />
          <div className="hero-castle">🏰</div>
          <div className="hero-title">The Chan Family</div>
          <div className="hero-ship">✦ Disney Adventure · Singapore ✦</div>
          <div className="hero-divider" />
          <div style={{fontSize:'11px',color:'rgba(255,255,255,.5)'}}>
            4 Nights · All Sea Days · 2 Adults + 3 Kids (5,7,9) · Deck 13 · Board 1245
          </div>
          <div className="hero-pills" style={{marginTop:'8px'}}>
            <span className="pill pg">🎆 Lion King Fireworks</span>
            <span className="pill pr">🔴 Iron Cycle</span>
            <span className="pill pb">🎭 5 Shows</span>
            <span className="pill pp">👑 BBB</span>
            <span className="pill pg">🎢 AquaMouse</span>
          </div>
        </div>

        {/* Pull to refresh hint */}
        {refreshing && (
          <div className="ptr">
            <span className="ptr-spin" />
            Fetching fresh tip from the ship…
          </div>
        )}

        {/* Scroll content */}
        <div
          className="scroll-wrap"
          ref={scrollRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {!refreshing && (
            <div style={{textAlign:'center',padding:'6px 0 0',fontSize:'10px',color:'rgba(255,255,255,.2)'}}>
              ↓ Pull down for a fresh tip
            </div>
          )}
          {renderTab()}
        </div>

        {/* Toast */}
        {toast && (
          <div className="toast">
            <div className="toast-title">{toast.title}</div>
            <div style={{fontSize:'12px',lineHeight:'1.4',color:'rgba(255,255,255,.85)'}}>{toast.msg}</div>
          </div>
        )}

        {/* Tab bar */}
        <div className="tab-bar">
          {TABS.map(t => (
            <button key={t.id} className={`tab-btn ${tab===t.id?'act':''}`} onClick={() => setTab(t.id)}>
              <span className="tab-ic">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
