/* GlamLaunch seasonal overlay
   One file for every page. It picks the theme from today's date:
     leaves  Sep 22 - Nov 30
     snow    Dec 1 - Jan 6 (snowflakes + ornaments through Dec 26)
     hearts  Feb 1 - Feb 14
   Preview any theme with ?season=leaves | snow | hearts | off */
(function () {
  if (window.__glSeason) return; window.__glSeason = 1;
  try { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch (e) {}

  var q = (location.search.match(/[?&]season=(\w+)/) || [])[1];
  var d = new Date(), m = d.getMonth() + 1, day = d.getDate(), md = m * 100 + day;
  var theme = q || (
    (md >= 922 && md <= 1130) ? 'leaves' :
    (md >= 1201 || md <= 106) ? 'snow' :
    (md >= 201 && md <= 214) ? 'hearts' : 'off');
  if (theme === 'off') return;
  var ornaments = q === 'snow' || (m === 12 && day <= 26);

  var SVG = {
    maple: '<svg viewBox="0 0 24 24"><path fill="C" d="M12 1.5l1.7 3.9 2.7-1.5-.6 4.2 3.6-1.7-1.1 3.4 2.8 1.1-4.4 3.6.9 1.9-4.4-.6V22h-2.4v-6.2l-4.4.6.9-1.9-4.4-3.6 2.8-1.1-1.1-3.4 3.6 1.7-.6-4.2 2.7 1.5z"/></svg>',
    leaf: '<svg viewBox="0 0 24 24"><path fill="C" d="M21 3C10 3 3 9 3 21c11 0 18-7 18-18z"/><path d="M3.5 20.5L15 9" stroke="rgba(0,0,0,.22)" stroke-width="1.1" fill="none"/></svg>',
    flake: '<svg viewBox="0 0 24 24" fill="none" stroke="C" stroke-width="1.6" stroke-linecap="round"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M12 2l-2 2m2-2l2 2M12 22l-2-2m2 2l2-2M3.3 7l.7 2.7M3.3 7l2.7-.7M20.7 17l-.7-2.7m.7 2.7l-2.7.7M3.3 17l2.7.7M3.3 17l.7-2.7M20.7 7l-2.7-.7m2.7.7l-.7 2.7"/></svg>',
    ornament: '<svg viewBox="0 0 24 28"><path d="M12 1.5v3" stroke="#B8923A" stroke-width="1.2"/><rect x="9" y="4" width="6" height="3.4" rx="1" fill="#D8B45C"/><circle cx="12" cy="17" r="9.5" fill="C"/><path d="M3.2 15.5c5.6 2.4 12 2.4 17.6 0" stroke="rgba(255,255,255,.55)" stroke-width="1.3" fill="none"/><circle cx="8.6" cy="13" r="2" fill="rgba(255,255,255,.45)"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path fill="C" d="M12 21.2S3.6 16.1 1.9 10.6C.7 6.8 3.2 3.4 6.8 3.4c2.2 0 3.9 1.2 5.2 3 1.3-1.8 3-3 5.2-3 3.6 0 6.1 3.4 4.9 7.2C20.4 16.1 12 21.2 12 21.2z"/></svg>'
  };
  var SETS = {
    leaves: { shapes: ['maple', 'leaf', 'maple'], colors: ['#C0522B', '#D98A2B', '#E3B04B', '#9C2F3E', '#E5328F', '#B8642E'], size: [18, 34], spin: 1 },
    snow: { shapes: ornaments ? ['flake', 'flake', 'flake', 'ornament'] : ['flake'], colors: ['#ffffff', '#E9EAFB', '#C5C8F3'], oc: ['#E5328F', '#C2186F', '#C5C8F3', '#D8B45C'], size: [14, 28], spin: .4 },
    hearts: { shapes: ['heart'], colors: ['#E5328F', '#C2186F', '#F48FC4', '#FBC7E4', '#D6336C'], size: [14, 28], spin: .25 }
  };
  var set = SETS[theme]; if (!set) return;

  var css = '#gl-season{position:fixed;inset:0;pointer-events:none;z-index:9990;overflow:hidden;contain:strict}' +
    '#gl-season i{position:absolute;top:-60px;display:block;will-change:transform;animation:glFall linear infinite}' +
    '#gl-season b{display:block;animation:glSway ease-in-out infinite alternate}' +
    '#gl-season svg{display:block;width:100%;height:100%;filter:drop-shadow(0 2px 3px rgba(42,16,54,.18))}' +
    '#gl-season.snow svg{filter:drop-shadow(0 0 1.5px rgba(42,16,54,.35)) drop-shadow(0 2px 4px rgba(42,16,54,.15))}' +
    '@keyframes glFall{to{transform:translate3d(0,calc(100vh + 120px),0)}}' +
    '@keyframes glSway{from{transform:translateX(calc(var(--sw) * -1)) rotate(calc(var(--r) * -1))}to{transform:translateX(var(--sw)) rotate(var(--r))}}';

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  var LEAVES_CSS = '.leaves{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:50}' +
    '.leaves span{position:absolute;top:-10%;font-size:1.5rem;animation:fall 10s linear infinite}' +
    '.leaves span:nth-child(1){left:10%;animation-duration:9s;animation-delay:-2s}' +
    '.leaves span:nth-child(2){left:30%;animation-duration:12s;animation-delay:-6s}' +
    '.leaves span:nth-child(3){left:50%;animation-duration:10s;animation-delay:-4s}' +
    '.leaves span:nth-child(4){left:70%;animation-duration:13s;animation-delay:-8s}' +
    '.leaves span:nth-child(5){left:90%;animation-duration:11s;animation-delay:-1s}' +
    '@keyframes fall{0%{transform:translateY(0) translateX(0) rotate(0deg);opacity:0}10%{opacity:1}' +
    '50%{transform:translateY(55vh) translateX(30px) rotate(180deg)}' +
    '100%{transform:translateY(110vh) translateX(-25px) rotate(360deg);opacity:.8}}';

  function startLeaves() {
    if (document.getElementById('gl-season')) return;
    var st = document.createElement('style'); st.textContent = LEAVES_CSS; document.head.appendChild(st);
    var box = document.createElement('div'); box.id = 'gl-season'; box.className = 'leaves'; box.setAttribute('aria-hidden', 'true');
    var maple = '<svg viewBox="0 0 24 24" width="1em" height="1em" style="display:block;overflow:visible"><defs><linearGradient id="glMg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2672A"/><stop offset="1" stop-color="#C9281B"/></linearGradient></defs>' +
      '<path d="M12 16.6c.1 2.4-.1 4.4-.9 6.4" stroke="#8F2416" stroke-width=".55" fill="none" stroke-linecap="round"/>' +
      '<path fill="url(#glMg)" d="M12 1.5l1.7 3.9 2.7-1.5-.6 4.2 3.6-1.7-1.1 3.4 2.8 1.1-4.4 3.6.9 1.9-4.4-.6L12 17.2l-1.2-1.4-4.4.6.9-1.9-4.4-3.6 2.8-1.1-1.1-3.4 3.6 1.7-.6-4.2 2.7 1.5z"/>' +
      '<path d="M12 16.8V4.5M12 12.6l5.6-3M12 12.6L6.4 9.6M12 14.6l3.6.8M12 14.6l-3.6.8" stroke="#A3241A" stroke-width=".4" fill="none" stroke-linecap="round" opacity=".8"/></svg>';
    var fallen = '<svg viewBox="0 0 24 24" width="1em" height="1em" style="display:block;overflow:visible"><defs><linearGradient id="glFg" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0913A"/><stop offset="1" stop-color="#9A4E1F"/></linearGradient></defs>' +
      '<path d="M5.8 17.8c-1.1 1.4-2.2 2.6-3.5 3.7" stroke="#6E3815" stroke-width=".55" fill="none" stroke-linecap="round"/>' +
      '<path fill="url(#glFg)" d="M19.5 2.8C10.6 3.2 4.8 8.6 5.4 18.2c9-.3 14.6-5.9 14.1-15.4z"/>' +
      '<path d="M5.9 17.6C9.6 13.4 13.5 8.6 17.9 4.4M9 14.2l-1.2-3.4M11.6 11.2l-.6-3.6M9 14.2l3.6.6M11.6 11.2l3.6.2" stroke="#7A3D17" stroke-width=".4" fill="none" stroke-linecap="round" opacity=".75"/></svg>';
    box.innerHTML = '<span>' + maple + '</span><span>' + fallen + '</span><span>' + maple + '</span><span>' + fallen + '</span><span>' + maple + '</span>';
    document.body.appendChild(box);
  }

  function start() {
    if (theme === 'leaves') return startLeaves();
    if (document.getElementById('gl-season')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var box = document.createElement('div'); box.id = 'gl-season'; box.className = theme; box.setAttribute('aria-hidden', 'true');
    var n = innerWidth < 700 ? 9 : 16, html = '';
    for (var k = 0; k < n; k++) {
      var shape = pick(set.shapes), s = rnd(set.size[0], set.size[1]);
      var col = shape === 'ornament' ? pick(set.oc) : pick(set.colors);
      if (shape === 'ornament') s *= 1.1;
      var dur = rnd(11, 21), sway = rnd(2.8, 5);
      html += '<i style="left:' + rnd(-2, 98).toFixed(1) + '%;width:' + s.toFixed(0) + 'px;height:' + (shape === 'ornament' ? s * 1.17 : s).toFixed(0) + 'px;' +
        'opacity:' + rnd(.7, .95).toFixed(2) + ';animation-duration:' + dur.toFixed(1) + 's;animation-delay:-' + rnd(0, dur).toFixed(1) + 's">' +
        '<b style="width:100%;height:100%;--sw:' + rnd(18, 60).toFixed(0) + 'px;--r:' + (rnd(25, 140) * set.spin).toFixed(0) + 'deg;animation-duration:' + sway.toFixed(1) + 's;animation-delay:-' + rnd(0, sway).toFixed(1) + 's">' +
        SVG[shape].split('"C"').join('"' + col + '"') + '</b></i>';
    }
    box.innerHTML = html;
    document.body.appendChild(box);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
