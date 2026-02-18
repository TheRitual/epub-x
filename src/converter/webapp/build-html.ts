import type { EpubExportJson } from "../json-output-types.js";
import { getAllWebAppTranslations } from "../../i18n/webapp-translations.js";

export interface WebAppConfig {
  initialLocale: string;
  chapterNewPage: boolean;
}

function escapeScriptContent(s: string): string {
  return s.replace(/<\/script/gi, "\\u003c/script");
}

export function buildWebAppHtml(
  bookData: EpubExportJson,
  config: WebAppConfig,
  contentCss: string
): string {
  const i18n = getAllWebAppTranslations();
  const bookJson = escapeScriptContent(JSON.stringify(bookData));
  const i18nJson = escapeScriptContent(JSON.stringify(i18n));
  const configJson = escapeScriptContent(JSON.stringify(config));
  const safeContentCss = contentCss.replace(/<\/style/gi, "\\u003c/style");

  return getTemplate()
    .replace("{{BOOK_DATA_JSON}}", bookJson)
    .replace("{{I18N_JSON}}", i18nJson)
    .replace("{{CONFIG_JSON}}", configJson)
    .replace("{{CONTENT_CSS}}", safeContentCss);
}

function getTemplate(): string {
  return WEBAPP_TEMPLATE;
}

const READER_LAYOUT_CSS = `
.reader-content img { display: block; max-width: 100%; height: auto; margin: 1.5em auto; }
.reader-content figure { margin: 1.5em 0; text-align: center; }
.reader-content figure img { margin: 0 auto; }
.reader-content ul, .reader-content ol { padding-left: 1.5em; }
.reader-content p { margin: 0.75em 0; }
.reader-content h1, .reader-content h2, .reader-content h3 { margin: 1em 0 0.5em; }
`;

export const WEBAPP_READER_LAYOUT_CSS = READER_LAYOUT_CSS;

const GOOGLE_FONTS = [
  "preserve",
  "Helvetica",
  "Lato",
  "Roboto",
  "Arial",
  "Literata",
  "Lora",
  "Merriweather",
  "Source Serif 4",
  "Crimson Pro",
  "Libre Baskerville",
  "PT Serif",
  "Noto Serif",
  "Charis SIL",
  "Newsreader",
  "DM Serif Text",
  "Playfair Display",
  "Georgia",
  "system-ui",
];

const WEBAPP_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#1a1a1a">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="mobile-web-app-capable" content="yes">
  <title>Book Reader</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <style>
* { box-sizing: border-box; }
:root {
  --reader-font: "Literata", "Georgia", serif;
  --reader-font-size: 1rem;
  --reader-text: #1a1a1a;
  --reader-bg: #f5f0e8;
  --reader-link: #2563eb;
  --glass-bg: rgba(255,255,255,0.25);
  --glass-blur: 12px;
  --bar-bg: rgba(0,0,0,0.05);
  --reader-margin: 12px;
  --img-radius: 0;
}
[data-theme="dark"] {
  --reader-text: #e8e4dc;
  --reader-bg: #1a1a1a;
  --reader-link: #60a5fa;
  --glass-bg: rgba(0,0,0,0.3);
  --bar-bg: rgba(255,255,255,0.08);
}
[data-theme="sepia"] {
  --reader-text: #5c4b37;
  --reader-bg: #f4ecd8;
  --reader-link: #20608f;
}
[data-theme="nord"] {
  --reader-text: #2e3440;
  --reader-bg: #eceff4;
  --reader-link: #5e81ac;
}
[data-theme="dracula"] {
  --reader-text: #f8f8f2;
  --reader-bg: #282a36;
  --reader-link: #bd93f9;
}
body { margin: 0; font-family: var(--reader-font); font-size: var(--reader-font-size); color: var(--reader-text); background: var(--reader-bg); min-height: 100vh; overflow-x: hidden; }
#app { display: flex; flex-direction: column; min-height: 100vh; }
#app.toolbar-bottom header { order: 2; }
header { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 1rem; background: var(--bar-bg); flex-wrap: wrap; gap: 0.5rem; transition: opacity 0.2s ease; }
header:not(:hover) { opacity: 0.85; }
header.glass { background: var(--glass-bg); backdrop-filter: blur(var(--glass-blur)); -webkit-backdrop-filter: blur(var(--glass-blur)); }
header.toolbar-minimal { padding: 0.5rem; min-width: auto; }
header.toolbar-minimal .header-left #view-group { display: none; }
header.toolbar-minimal .header-right .nav-group,
header.toolbar-minimal .header-right #options-btn { display: none; }
header.toolbar-minimal .header-left button,
header.toolbar-minimal .header-right button { opacity: 0.6; transition: opacity 0.2s; }
header.toolbar-minimal .header-left button:hover,
header.toolbar-minimal .header-right button:hover { opacity: 1; }
.header-left { display: flex; align-items: center; gap: 0.5rem; }
.header-center { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; min-width: 0; }
.header-right { display: flex; align-items: center; gap: 0.5rem; }
header.toolbar-minimal .header-center { display: none; }
button { font: inherit; cursor: pointer; border: 1px solid rgba(128,128,128,0.3); background: rgba(255,255,255,0.06); color: inherit; padding: 0.5rem 0.9rem; border-radius: 8px; transition: background 0.2s, box-shadow 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
button:hover { background: rgba(128,128,128,0.12); box-shadow: 0 2px 6px rgba(0,0,0,0.12); }
button:active { box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
button.primary { background: var(--reader-link); color: #fff; border-color: var(--reader-link); }
.view-btn { font-size: 0.85rem; }
.view-btn.active { background: var(--reader-link); color: #fff; border-color: var(--reader-link); }
main { flex: 1; display: flex; flex-direction: column; min-height: 0; position: relative; margin: var(--reader-margin); }
.scroll-box { border-radius: 10px; overflow: auto; -webkit-overflow-scrolling: touch; }
.scroll-box::-webkit-scrollbar { width: 10px; height: 10px; }
.scroll-box::-webkit-scrollbar-track { background: rgba(128,128,128,0.1); border-radius: 10px; }
.scroll-box::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.35); border-radius: 10px; }
.scroll-box::-webkit-scrollbar-thumb:hover { background: rgba(128,128,128,0.5); }
#reader-scroll { flex: 1; overflow: auto; -webkit-overflow-scrolling: touch; margin: 0; }
#reader-scroll.scroll-box { padding: var(--reader-margin); }
#reader-paged { flex: 1; overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative; }
#reader-two { flex: 1; overflow: hidden; display: flex; align-items: stretch; }
#reader-infinity-pages { flex: 1; overflow: auto; -webkit-overflow-scrolling: touch; position: relative; scroll-snap-type: y mandatory; }
#reader-infinity-pages .infinity-section { scroll-snap-align: center; scroll-snap-stop: always; min-height: 100vh; min-height: 100dvh; box-sizing: border-box; display: flex; align-items: center; justify-content: center; padding: var(--reader-margin); }
#reader-infinity-pages .infinity-section .reader-content { margin: 0; }
#page-progress { flex: 1; min-width: 0; max-width: 200px; height: 6px; background: rgba(128,128,128,0.2); border-radius: 3px; overflow: hidden; margin: 0 0.5rem; }
#page-progress-fill { height: 100%; background: var(--reader-link); border-radius: 3px; transition: width 0.15s ease; }
.reader-content { padding: 1.5rem 1rem; max-width: 42em; margin: 0 auto; line-height: 1.6; }
.reader-content a { color: var(--reader-link); }
.reader-content.img-rounded img { border-radius: var(--img-radius); }
.page-panel { flex: 1; overflow: hidden; padding: var(--reader-margin); display: flex; align-items: center; justify-content: center; min-height: 0; }
.page-panel .reader-content { margin: 0; max-height: 100%; overflow: hidden; }
.two-page { width: 50%; overflow: hidden; padding: var(--reader-margin); display: flex; align-items: center; justify-content: center; box-sizing: border-box; min-height: 0; }
.two-page .reader-content { margin: 0; max-width: 100%; max-height: 100%; overflow: hidden; }
.two-page:first-child { border-right: 1px solid rgba(128,128,128,0.2); }
.nav-group { display: flex; align-items: center; gap: 0.5rem; }
.nav-group.position-below { position: absolute; bottom: var(--reader-margin); left: 50%; transform: translateX(-50%); }
.nav-group.position-above { position: absolute; top: var(--reader-margin); left: 50%; transform: translateX(-50%); }
.nav-group.position-sides { position: absolute; left: var(--reader-margin); right: var(--reader-margin); top: 50%; transform: translateY(-50%); display: flex; justify-content: space-between; pointer-events: none; }
.nav-group.position-sides button { pointer-events: auto; }
.click-zone { position: absolute; top: 0; bottom: 0; width: 25%; z-index: 5; cursor: pointer; }
.click-zone.left { left: 0; }
.click-zone.right { right: 0; }
.click-zone.hidden { display: none !important; }
.cover-page { display: flex; align-items: center; justify-content: center; min-height: 200px; padding: 2rem; text-align: center; }
.cover-page h2 { margin: 0; font-size: 1.5rem; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
.modal { background: var(--reader-bg); color: var(--reader-text); border-radius: 16px; max-width: 420px; width: 100%; max-height: 90vh; overflow: auto; box-shadow: 0 8px 32px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1); }
.modal.glass { background: var(--glass-bg); backdrop-filter: blur(var(--glass-blur)); -webkit-backdrop-filter: blur(var(--glass-blur)); border: 1px solid rgba(255,255,255,0.2); }
.modal h3 { margin: 0 0 1rem; padding: 1rem 1rem 0; }
.modal section { padding: 0 1rem 1rem; }
.modal .settings-grid { display: grid; grid-template-columns: auto 1fr; gap: 0.4rem 1rem; align-items: center; max-width: 360px; }
.modal .settings-grid label { margin: 0; font-size: 0.9rem; justify-self: end; }
.modal .settings-grid input[type="number"] { width: 4rem; margin: 0; }
.modal .settings-grid input[type="range"] { width: 100%; margin: 0; }
.modal label { display: block; margin-bottom: 0.25rem; font-size: 0.9rem; }
.modal input, .modal select { padding: 0.5rem; font: inherit; border-radius: 6px; border: 1px solid rgba(128,128,128,0.4); background: inherit; color: inherit; }
.modal-actions { padding: 1rem; display: flex; justify-content: flex-end; gap: 0.5rem; flex-wrap: wrap; }
.toolbar-expand-btn { display: none; }
header.toolbar-minimal .toolbar-expand-btn { display: inline-flex; }
#view-two.landscape-hidden { display: none !important; }
#toc-drawer { position: fixed; top: 0; left: 0; bottom: 0; width: min(320px, 85vw); background: var(--reader-bg); border-radius: 0 12px 12px 0; box-shadow: 4px 0 24px rgba(0,0,0,0.15); z-index: 50; transform: translateX(-100%); transition: transform 0.2s; overflow: auto; }
#toc-drawer.glass { background: var(--glass-bg); backdrop-filter: blur(var(--glass-blur)); -webkit-backdrop-filter: blur(var(--glass-blur)); border-right: 1px solid rgba(255,255,255,0.2); }
#toc-drawer.open { transform: translateX(0); }
#toc-drawer .toc-drawer-header { padding: 0 1rem; margin: 0; border-bottom: 1px solid rgba(128,128,128,0.2); }
#toc-drawer h3 { padding: 1rem 0; margin: 0; }
#toc-drawer ul { list-style: none; padding: 0; margin: 0; }
#toc-drawer li { border-bottom: 1px solid rgba(128,128,128,0.1); }
#toc-drawer a { display: block; padding: 0.6rem 1rem; color: inherit; text-decoration: none; }
#toc-drawer a:hover { background: rgba(128,128,128,0.1); }
.hidden { display: none !important; }
@media (max-width: 768px) {
  header { padding: 0.5rem 0.75rem; }
  .header-center { max-width: 120px; }
  #page-progress { max-width: 80px; }
  button { padding: 0.6rem 0.75rem; min-height: 44px; }
  main { margin: 8px; }
  .click-zone { width: 30%; }
}
{{CONTENT_CSS}}
${READER_LAYOUT_CSS}
</style>
</head>
<body>
<div id="app">
  <header id="header">
    <div class="header-left">
      <button type="button" id="toc-btn" aria-label="TOC">&#9776;</button>
      <span id="view-group">
        <button type="button" class="view-btn" data-view="scroll" id="view-scroll">Scroll</button>
        <button type="button" class="view-btn" data-view="one" id="view-one">One</button>
        <button type="button" class="view-btn" data-view="two" id="view-two">Two</button>
        <button type="button" class="view-btn" data-view="infinity" id="view-infinity">&#8734;</button>
      </span>
    </div>
    <div class="header-center">
      <div class="nav-group" id="header-nav">
        <button type="button" id="prev-btn">&#8249;</button>
        <span id="page-indicator"></span>
        <button type="button" id="next-btn">&#8250;</button>
      </div>
      <div id="page-progress" class="hidden"><div id="page-progress-fill" style="width: 0%;"></div></div>
    </div>
    <div class="header-right">
      <button type="button" id="options-btn">&#9881;</button>
      <button type="button" id="toolbar-expand-btn" class="toolbar-expand-btn" aria-label="Show toolbar">&#9662;</button>
    </div>
  </header>
  <main id="main-content">
    <div id="reader-scroll" class="reader-view scroll-box"><div class="reader-content" id="scroll-content"></div></div>
    <div id="reader-paged" class="reader-view hidden">
      <div class="click-zone left" id="click-zone-paged-left"></div>
      <div class="click-zone right" id="click-zone-paged-right"></div>
      <div class="nav-group position-below hidden" id="paged-nav">
        <button type="button" id="prev-btn-paged">&#8249;</button>
        <span id="page-indicator-paged"></span>
        <button type="button" id="next-btn-paged">&#8250;</button>
      </div>
      <div class="page-panel"><div class="reader-content" id="one-content"></div></div>
    </div>
    <div id="reader-two" class="reader-view hidden">
      <div class="click-zone left" id="click-zone-two-left"></div>
      <div class="click-zone right" id="click-zone-two-right"></div>
      <div class="nav-group position-below hidden" id="paged-nav-two">
        <button type="button" id="prev-btn-paged-two">&#8249;</button>
        <span id="page-indicator-paged-two"></span>
        <button type="button" id="next-btn-paged-two">&#8250;</button>
      </div>
      <div class="two-page" id="two-left"></div>
      <div class="two-page" id="two-right"></div>
    </div>
    <div id="reader-infinity-pages" class="reader-view hidden">
      <div class="click-zone left" id="click-zone-infinity-left"></div>
      <div class="click-zone right" id="click-zone-infinity-right"></div>
      <div id="infinity-inner"></div>
    </div>
  </main>
</div>
<div id="toc-drawer">
  <div class="toc-drawer-header" style="display: flex; align-items: center; justify-content: space-between;">
    <h3 id="toc-title">TOC</h3>
    <button type="button" id="toc-close" aria-label="Close" style="font-size: 1.2rem; padding: 0.25rem 0.5rem;">&#215;</button>
  </div>
  <ul id="toc-list"></ul>
</div>
<div id="modal-overlay" class="modal-overlay hidden">
  <div class="modal" id="settings-modal">
    <h3 id="modal-title">Settings</h3>
    <section>
      <div class="settings-grid" id="settings-grid">
        <label id="lbl-language">Language</label>
        <select id="setting-language"></select>
        <label id="lbl-font">Font</label>
        <select id="setting-font"></select>
        <label id="lbl-font-size">Font size</label>
        <div><input type="range" id="setting-font-size" min="12" max="32" value="16"><span id="font-size-value"></span></div>
        <label id="lbl-theme">Theme</label>
        <select id="setting-theme">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="sepia">Sepia</option>
          <option value="nord">Nord</option>
          <option value="dracula">Dracula</option>
        </select>
        <label id="lbl-toolbar-position">Toolbar</label>
        <select id="setting-toolbar-position"><option value="top">Top</option><option value="bottom">Bottom</option></select>
        <label id="lbl-nav-position">Nav buttons</label>
        <select id="setting-nav-position"><option value="header">Header</option><option value="below">Below</option><option value="above">Above</option><option value="sides">Sides</option></select>
        <label id="lbl-margin">Margin</label>
        <input type="number" id="setting-margin" min="0" max="48" value="12">
        <label id="lbl-rounded-images">Rounded images</label>
        <input type="checkbox" id="setting-rounded-images">
        <label id="lbl-show-toolbar">Show toolbar</label>
        <input type="checkbox" id="setting-show-toolbar" checked>
        <label id="lbl-click-zones">Click zones</label>
        <input type="checkbox" id="setting-click-zones" checked>
        <label id="lbl-text-color">Text color</label>
        <input type="color" id="setting-text-color" value="#1a1a1a">
        <label id="lbl-bg-color">Background</label>
        <input type="color" id="setting-bg-color" value="#f5f0e8">
        <label id="lbl-link-color">Link color</label>
        <input type="color" id="setting-link-color" value="#2563eb">
        <label id="lbl-glass">Glassmorphism</label>
        <select id="setting-glass"><option value="off">Off</option><option value="on">On</option></select>
        <label id="lbl-blur">Blur</label>
        <input type="range" id="setting-blur" min="0" max="30" value="12">
        <label id="lbl-opacity">Opacity</label>
        <input type="range" id="setting-opacity" min="0" max="100" value="25">
      </div>
    </section>
    <section>
      <button type="button" id="export-settings-btn">Export settings</button>
      <button type="button" id="load-settings-btn">Load settings</button>
      <button type="button" id="restore-defaults-btn">Restore defaults</button>
    </section>
    <div class="modal-actions">
      <button type="button" id="modal-close">Close</button>
    </div>
  </div>
</div>
<script type="application/json" id="book-data">{{BOOK_DATA_JSON}}</script>
<script type="application/json" id="i18n-data">{{I18N_JSON}}</script>
<script type="application/json" id="config-data">{{CONFIG_JSON}}</script>
<script>
(function() {
  function parseJson(id) {
    var el = document.getElementById(id);
    return el ? JSON.parse(el.textContent) : null;
  }
  var book = parseJson('book-data');
  var i18n = parseJson('i18n-data') || {};
  var config = parseJson('config-data') || { initialLocale: 'en', chapterNewPage: true };

  var FONTS = ${JSON.stringify(GOOGLE_FONTS)};
  var currentLocale = localStorage.getItem('epubx-locale') || config.initialLocale || 'en';
  var t = function(key) { var loc = i18n[currentLocale]; return (loc && loc[key]) || (i18n['en'] && i18n['en'][key]) || key; };

  var chapters = book.chapters || [];
  var toc = book.toc || [];
  var metadata = book.metadata || {};
  var images = book.images || {};
  var chapterNewPage = !!config.chapterNewPage;

  function chapterContent(ch) {
    if (ch.content) return ch.content;
    if (ch.file) return '';
    return '';
  }

  function resolveImage(id) {
    var img = images[id];
    return img && img.url ? img.url : '';
  }

  function renderChapterHtml(ch) {
    var html = chapterContent(ch);
    if (!html) return '';
    return html.replace(/\\$\\{\\{([^}]+)\\}\\}/g, function(_, id) {
      var url = resolveImage(id.trim());
      return url ? '<img src="' + url.replace(/"/g, '&quot;') + '" alt="">' : '';
    });
  }

  function buildPages() {
    var pages = [];
    for (var i = 0; i < chapters.length; i++) {
      var ch = chapters[i];
      var html = renderChapterHtml(ch);
      if (chapterNewPage && i > 0) pages.push({ type: 'break' });
      pages.push({ type: 'chapter', chapterIndex: i, title: ch.title, html: html });
    }
    return pages;
  }

  var pages = buildPages();
  var pagedChunks = null;
  var currentView = localStorage.getItem('epubx-view') || 'scroll';
  var currentPageIndex = Math.max(0, Math.min(parseInt(localStorage.getItem('epubx-page') || '0', 10), Math.max(0, pages.length - 1)));
  var scrollTop = parseInt(localStorage.getItem('epubx-scroll') || '0', 10);

  function buildPagedChunks() {
    var chunks = [];
    var BLOCKS_PER_PAGE = 5;
    for (var c = 0; c < pages.length; c++) {
      var p = pages[c];
      if (p.type === 'break') continue;
      var html = (p.title ? '<h2>' + p.title + '</h2>' : '') + p.html;
      var div = document.createElement('div');
      div.innerHTML = html;
      var blocks = Array.from(div.children).filter(function(n) { return n.nodeType === 1; });
      for (var i = 0; i < blocks.length; i += BLOCKS_PER_PAGE) {
        var slice = blocks.slice(i, i + BLOCKS_PER_PAGE);
        var chunkHtml = slice.map(function(n) { return n.outerHTML || ''; }).join('');
        if (chunkHtml) chunks.push({ html: chunkHtml, title: p.title || '', chapterIndex: c });
      }
      if (blocks.length === 0 && html) chunks.push({ html: html, title: p.title || '', chapterIndex: c });
    }
    return chunks.length ? chunks : [{ html: '', title: '', chapterIndex: 0 }];
  }

  var scrollContent = document.getElementById('scroll-content');
  var oneContent = document.getElementById('one-content');
  var twoLeft = document.getElementById('two-left');
  var twoRight = document.getElementById('two-right');
  var infinityInner = document.getElementById('infinity-inner');

  function applySettings() {
    var font = localStorage.getItem('epubx-font') || 'Helvetica';
    var fontSize = localStorage.getItem('epubx-fontSize') || '16';
    var theme = localStorage.getItem('epubx-theme') || 'light';
    var textColor = localStorage.getItem('epubx-textColor') || '#1a1a1a';
    var bgColor = localStorage.getItem('epubx-bgColor') || '#f5f0e8';
    var linkColor = localStorage.getItem('epubx-linkColor') || '#2563eb';
    var glass = localStorage.getItem('epubx-glass') === 'on';
    var blur = localStorage.getItem('epubx-blur') || '12';
    var opacity = localStorage.getItem('epubx-opacity') || '25';
    var margin = localStorage.getItem('epubx-margin');
    document.documentElement.style.setProperty('--reader-margin', (margin !== null && margin !== '' ? margin : '12') + 'px');
    var rounded = localStorage.getItem('epubx-roundedImages') === 'on';
    document.documentElement.style.setProperty('--img-radius', rounded ? '8px' : '0');
    var toolbarPos = localStorage.getItem('epubx-toolbarPosition') || 'top';
    document.getElementById('app').classList.toggle('toolbar-bottom', toolbarPos === 'bottom');
    var showToolbar = localStorage.getItem('epubx-showToolbar') !== 'off';
    document.getElementById('header').classList.toggle('toolbar-minimal', !showToolbar);
    var fontValue = font === 'preserve' ? 'inherit' : (font === 'system-ui' || font === 'Georgia' || font === 'Arial' || font === 'Helvetica' ? font : '"' + font + '", Georgia, serif');
    document.documentElement.style.setProperty('--reader-font', fontValue);
    document.documentElement.style.setProperty('--reader-font-size', fontSize + 'px');
    document.documentElement.style.setProperty('--reader-text', textColor);
    document.documentElement.style.setProperty('--reader-bg', bgColor);
    document.documentElement.style.setProperty('--reader-link', linkColor);
    document.documentElement.style.setProperty('--glass-blur', blur + 'px');
    document.documentElement.style.setProperty('--glass-bg', 'rgba(128,128,128,' + (parseInt(opacity, 10) / 100) + ')');
    document.body.setAttribute('data-theme', theme);
    var header = document.getElementById('header');
    if (glass) header.classList.add('glass'); else header.classList.remove('glass');
    var modal = document.getElementById('settings-modal');
    if (glass) modal.classList.add('glass'); else modal.classList.remove('glass');
    var tocDrawer = document.getElementById('toc-drawer');
    if (glass) tocDrawer.classList.add('glass'); else tocDrawer.classList.remove('glass');
    document.querySelectorAll('.reader-content').forEach(function(el) {
      if (rounded) el.classList.add('img-rounded'); else el.classList.remove('img-rounded');
    });
    updateNavVisibility();
    updateClickZones();
  }

  function updateNavVisibility() {
    var navPos = localStorage.getItem('epubx-navPosition') || 'header';
    var headerNav = document.getElementById('header-nav');
    var pagedNav = document.getElementById('paged-nav');
    var pagedNavTwo = document.getElementById('paged-nav-two');
    var showPaged = (currentView === 'one' || currentView === 'two') && navPos !== 'header';
    if (headerNav) headerNav.classList.toggle('hidden', showPaged);
    if (pagedNav) {
      pagedNav.classList.toggle('hidden', !showPaged || currentView !== 'one');
      pagedNav.classList.remove('position-below', 'position-above', 'position-sides');
      if (showPaged && currentView === 'one') pagedNav.classList.add('position-' + navPos);
    }
    if (pagedNavTwo) {
      pagedNavTwo.classList.toggle('hidden', !showPaged || currentView !== 'two');
      pagedNavTwo.classList.remove('position-below', 'position-above', 'position-sides');
      if (showPaged && currentView === 'two') pagedNavTwo.classList.add('position-' + navPos);
    }
  }

  function loadFont(font) {
    if (font === 'preserve' || font === 'system-ui' || font === 'Georgia' || font === 'Arial' || font === 'Helvetica') return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(font).replace(/%20/g, '+') + ':wght@400;600&display=swap';
    document.head.appendChild(link);
  }

  function renderScrollView() {
    var html = '';
    for (var i = 0; i < pages.length; i++) {
      var p = pages[i];
      if (p.type === 'break') html += '<div class="page-break" style="height: 50vh;"></div>';
      else html += '<section class="reader-section" data-page="' + i + '">' + (p.title ? '<h2>' + p.title + '</h2>' : '') + p.html + '</section>';
    }
    scrollContent.innerHTML = html;
  }

  function renderOneView() {
    if (!pagedChunks || pagedChunks.length === 0) { oneContent.innerHTML = ''; return; }
    var idx = Math.min(currentPageIndex, pagedChunks.length - 1);
    var chunk = pagedChunks[idx];
    var roundedClass = localStorage.getItem('epubx-roundedImages') === 'on' ? ' reader-content img-rounded' : ' reader-content';
    oneContent.innerHTML = '<div class="' + roundedClass.trim() + '">' + (chunk.title && idx === 0 ? '<h2>' + chunk.title + '</h2>' : '') + chunk.html + '</div>';
  }

  function renderTwoView() {
    if (!pagedChunks || pagedChunks.length === 0) return;
    var roundedClass = localStorage.getItem('epubx-roundedImages') === 'on' ? ' reader-content img-rounded' : ' reader-content';
    var wrap = function(html, title) { return '<div class="' + roundedClass.trim() + '">' + (title ? '<h2>' + title + '</h2>' : '') + html + '</div>'; };
    var rightChunk = currentPageIndex < pagedChunks.length ? pagedChunks[currentPageIndex] : null;
    var leftChunk = currentPageIndex > 0 ? pagedChunks[currentPageIndex - 1] : null;
    twoLeft.innerHTML = currentPageIndex === 0 && chapters[0] ? '<div class="cover-page"><h2>' + t('cover_page') + '</h2></div>' : (leftChunk ? wrap(leftChunk.html, leftChunk.title) : '');
    twoRight.innerHTML = currentPageIndex === 0 && chapters[0] ? '<div class="cover-page"><h2>' + (metadata.title || '') + '</h2></div>' : (rightChunk ? wrap(rightChunk.html, rightChunk.title) : '');
  }

  function renderInfinityPagesView() {
    var html = '';
    for (var i = 0; i < pages.length; i++) {
      var p = pages[i];
      if (p.type === 'break') html += '<div class="page-break" style="min-height: 100vh;"></div>';
      else html += '<section class="infinity-section reader-section" data-page="' + i + '"><div class="reader-content' + (localStorage.getItem('epubx-roundedImages') === 'on' ? ' img-rounded' : '') + '">' + (p.title ? '<h2>' + p.title + '</h2>' : '') + p.html + '</div></section>';
    }
    infinityInner.innerHTML = html;
  }

  function onInfinityScroll() {
    var container = document.getElementById('reader-infinity-pages');
    if (!container || currentView !== 'infinity') return;
    var sections = container.querySelectorAll('.infinity-section');
    var mid = container.scrollTop + container.clientHeight / 2;
    for (var i = sections.length - 1; i >= 0; i--) {
      var rect = sections[i].getBoundingClientRect();
      var top = rect.top + container.scrollTop;
      if (top <= mid) {
        var idx = parseInt(sections[i].getAttribute('data-page'), 10);
        if (idx !== currentPageIndex) {
          currentPageIndex = idx;
          localStorage.setItem('epubx-page', String(idx));
          updatePageIndicator();
        }
        break;
      }
    }
  }

  function showView(name) {
    document.querySelectorAll('.reader-view').forEach(function(el) { el.classList.add('hidden'); });
    var target = document.getElementById('reader-' + (name === 'scroll' ? 'scroll' : name === 'one' ? 'paged' : name === 'two' ? 'two' : 'infinity-pages'));
    if (target) target.classList.remove('hidden');
    document.querySelectorAll('.view-btn').forEach(function(btn) { btn.classList.remove('active'); if (btn.dataset.view === name) btn.classList.add('active'); });
    currentView = name;
    localStorage.setItem('epubx-view', name);
    if (name === 'one' || name === 'two') {
      if (!pagedChunks) pagedChunks = buildPagedChunks();
      currentPageIndex = Math.min(currentPageIndex, Math.max(0, pagedChunks.length - 1));
      localStorage.setItem('epubx-page', String(currentPageIndex));
    }
    updatePageIndicator();
    updateNavVisibility();
    updateClickZones();
    if (name === 'scroll') { renderScrollView(); setTimeout(function() { document.getElementById('reader-scroll').scrollTop = scrollTop; }, 0); }
    if (name === 'one') { renderOneView(); }
    if (name === 'two') { renderTwoView(); }
    if (name === 'infinity') { renderInfinityPagesView(); scrollToInfinityPage(); }
  }

  function scrollToInfinityPage() {
    var section = infinityInner.querySelector('[data-page="' + currentPageIndex + '"]');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function getTotalPages() {
    if (currentView === 'one' || currentView === 'two') return (pagedChunks && pagedChunks.length) ? pagedChunks.length : 1;
    if (currentView === 'infinity') return pages.filter(function(p) { return p.type !== 'break'; }).length;
    return 0;
  }

  function updatePageIndicator() {
    var total = getTotalPages();
    var text = '';
    if (currentView !== 'scroll' && total > 0) {
      var pageNum = Math.min(currentPageIndex + 1, total);
      text = t('page') + ' ' + pageNum + ' ' + t('of') + ' ' + total;
    }
    ['page-indicator', 'page-indicator-paged', 'page-indicator-paged-two'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.textContent = text;
    });
    var progressWrap = document.getElementById('page-progress');
    var progressFill = document.getElementById('page-progress-fill');
    if (progressWrap && progressFill) {
      if (currentView === 'scroll' || total <= 0) {
        progressWrap.classList.add('hidden');
      } else {
        progressWrap.classList.remove('hidden');
        progressFill.style.width = (total > 0 ? ((currentPageIndex + 1) / total * 100) : 0) + '%';
      }
    }
  }

  function goPrev() {
    if (currentPageIndex <= 0) return;
    currentPageIndex--;
    localStorage.setItem('epubx-page', String(currentPageIndex));
    if (currentView === 'one') renderOneView();
    if (currentView === 'two') renderTwoView();
    if (currentView === 'infinity') scrollToInfinityPage();
    updatePageIndicator();
  }

  function goNext() {
    var total = getTotalPages();
    if (currentView === 'one' || currentView === 'two') { if (currentPageIndex >= total - 1) return; }
    else if (currentView === 'infinity') { if (currentPageIndex >= pages.length - 1) return; }
    currentPageIndex++;
    localStorage.setItem('epubx-page', String(currentPageIndex));
    if (currentView === 'one') renderOneView();
    if (currentView === 'two') renderTwoView();
    if (currentView === 'infinity') scrollToInfinityPage();
    updatePageIndicator();
  }

  function updateClickZones() {
    var on = localStorage.getItem('epubx-clickZones') !== 'off' && (currentView === 'one' || currentView === 'two' || currentView === 'infinity');
    ['click-zone-paged-left', 'click-zone-paged-right', 'click-zone-two-left', 'click-zone-two-right', 'click-zone-infinity-left', 'click-zone-infinity-right'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.classList.toggle('hidden', !on);
    });
  }

  function applyLandscapeTwoPage() {
    var landscape = window.matchMedia('(orientation: landscape)').matches;
    var viewTwo = document.getElementById('view-two');
    if (viewTwo) viewTwo.classList.toggle('landscape-hidden', landscape);
    if (landscape && currentView === 'two') {
      currentPageIndex = Math.min(currentPageIndex, Math.max(0, (pagedChunks && pagedChunks.length) ? pagedChunks.length - 1 : 0));
      showView('one');
    }
  }

  function persistScroll() {
    var el = document.getElementById('reader-scroll');
    if (el) { scrollTop = el.scrollTop; localStorage.setItem('epubx-scroll', String(scrollTop)); }
  }

  document.getElementById('toc-btn').onclick = function() {
    document.getElementById('toc-drawer').classList.toggle('open');
  };
  var toolbarExpand = document.getElementById('toolbar-expand-btn');
  if (toolbarExpand) toolbarExpand.onclick = function() {
    localStorage.setItem('epubx-showToolbar', 'on');
    applySettings();
  };
  document.getElementById('toc-close').onclick = function() {
    document.getElementById('toc-drawer').classList.remove('open');
  };

  document.querySelectorAll('.view-btn').forEach(function(btn) {
    btn.onclick = function() { showView(btn.dataset.view); };
  });

  document.getElementById('prev-btn').onclick = goPrev;
  document.getElementById('next-btn').onclick = goNext;
  var pagedPrev = document.getElementById('prev-btn-paged');
  var pagedNext = document.getElementById('next-btn-paged');
  if (pagedPrev) pagedPrev.onclick = goPrev;
  if (pagedNext) pagedNext.onclick = goNext;
  var pagedPrevTwo = document.getElementById('prev-btn-paged-two');
  var pagedNextTwo = document.getElementById('next-btn-paged-two');
  if (pagedPrevTwo) pagedPrevTwo.onclick = goPrev;
  if (pagedNextTwo) pagedNextTwo.onclick = goNext;

  document.getElementById('reader-scroll').onscroll = persistScroll;
  var infinityContainer = document.getElementById('reader-infinity-pages');
  if (infinityContainer) infinityContainer.onscroll = onInfinityScroll;

  document.addEventListener('keydown', function(e) {
    if (document.getElementById('modal-overlay') && !document.getElementById('modal-overlay').classList.contains('hidden')) return;
    var tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    var key = e.key;
    if (key === 'ArrowLeft' || key === 'h' || key === 'k') { e.preventDefault(); goPrev(); }
    else if (key === 'ArrowRight' || key === 'l' || key === 'j') { e.preventDefault(); goNext(); }
  });

  ['click-zone-paged-left', 'click-zone-two-left', 'click-zone-infinity-left'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.onclick = goPrev;
  });
  ['click-zone-paged-right', 'click-zone-two-right', 'click-zone-infinity-right'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.onclick = goNext;
  });

  document.getElementById('options-btn').onclick = function() {
    document.getElementById('modal-overlay').classList.remove('hidden');
    document.getElementById('modal-title').textContent = t('settings');
    document.getElementById('lbl-language').textContent = t('language');
    document.getElementById('lbl-font').textContent = t('font_family');
    document.getElementById('lbl-font-size').textContent = t('font_size');
    document.getElementById('lbl-theme').textContent = t('theme');
    document.getElementById('lbl-text-color').textContent = t('text_color');
    document.getElementById('lbl-bg-color').textContent = t('bg_color');
    document.getElementById('lbl-link-color').textContent = t('link_color');
    document.getElementById('lbl-glass').textContent = t('glassmorphism');
    document.getElementById('lbl-blur').textContent = t('blur');
    document.getElementById('lbl-opacity').textContent = t('opacity');
    document.getElementById('lbl-toolbar-position').textContent = t('toolbar_position');
    document.getElementById('lbl-nav-position').textContent = t('nav_position');
    document.getElementById('lbl-margin').textContent = t('reader_margin');
    document.getElementById('lbl-rounded-images').textContent = t('images_rounded');
    document.getElementById('lbl-show-toolbar').textContent = t('show_toolbar');
    document.getElementById('lbl-click-zones').textContent = t('click_zones');
    document.getElementById('export-settings-btn').textContent = t('export_settings');
    document.getElementById('load-settings-btn').textContent = t('load_settings');
    document.getElementById('restore-defaults-btn').textContent = t('restore_defaults');
    document.getElementById('modal-close').textContent = t('close');
    var langSelect = document.getElementById('setting-language');
    langSelect.innerHTML = '';
    var locales = ['en','pl','de','fr','es','it','pt','ru','zh','ja'];
    var names = { en: 'English', pl: 'Polski', de: 'Deutsch', fr: 'Français', es: 'Español', it: 'Italiano', pt: 'Português', ru: 'Русский', zh: '中文', ja: '日本語' };
    locales.forEach(function(loc) {
      var opt = document.createElement('option');
      opt.value = loc;
      opt.textContent = names[loc] || loc;
      if (loc === currentLocale) opt.selected = true;
      langSelect.appendChild(opt);
    });
    langSelect.onchange = function() { currentLocale = this.value; localStorage.setItem('epubx-locale', currentLocale); document.getElementById('modal-title').textContent = t('settings'); };
    var fontSelect = document.getElementById('setting-font');
    fontSelect.innerHTML = '';
    var currentFont = localStorage.getItem('epubx-font') || 'Helvetica';
    FONTS.forEach(function(f) {
      var opt = document.createElement('option');
      opt.value = f;
      opt.textContent = f === 'preserve' ? t('font_preserve_original') : f;
      if (f === currentFont) opt.selected = true;
      fontSelect.appendChild(opt);
    });
    fontSelect.onchange = function() { localStorage.setItem('epubx-font', this.value); loadFont(this.value); applySettings(); };
    var fontSizeEl = document.getElementById('setting-font-size');
    fontSizeEl.value = localStorage.getItem('epubx-fontSize') || '16';
    document.getElementById('font-size-value').textContent = fontSizeEl.value + 'px';
    fontSizeEl.oninput = function() { localStorage.setItem('epubx-fontSize', this.value); document.getElementById('font-size-value').textContent = this.value + 'px'; applySettings(); };
    document.getElementById('setting-theme').value = localStorage.getItem('epubx-theme') || 'light';
    document.getElementById('setting-theme').onchange = function() { localStorage.setItem('epubx-theme', this.value); applySettings(); };
    document.getElementById('setting-text-color').value = localStorage.getItem('epubx-textColor') || '#1a1a1a';
    document.getElementById('setting-text-color').onchange = function() { localStorage.setItem('epubx-textColor', this.value); applySettings(); };
    document.getElementById('setting-bg-color').value = localStorage.getItem('epubx-bgColor') || '#f5f0e8';
    document.getElementById('setting-bg-color').onchange = function() { localStorage.setItem('epubx-bgColor', this.value); applySettings(); };
    document.getElementById('setting-link-color').value = localStorage.getItem('epubx-linkColor') || '#2563eb';
    document.getElementById('setting-link-color').onchange = function() { localStorage.setItem('epubx-linkColor', this.value); applySettings(); };
    document.getElementById('setting-glass').value = localStorage.getItem('epubx-glass') === 'on' ? 'on' : 'off';
    document.getElementById('setting-glass').onchange = function() { localStorage.setItem('epubx-glass', this.value); applySettings(); };
    document.getElementById('setting-blur').value = localStorage.getItem('epubx-blur') || '12';
    document.getElementById('setting-blur').oninput = function() { localStorage.setItem('epubx-blur', this.value); applySettings(); };
    document.getElementById('setting-opacity').value = localStorage.getItem('epubx-opacity') || '25';
    document.getElementById('setting-opacity').oninput = function() { localStorage.setItem('epubx-opacity', this.value); applySettings(); };
    document.getElementById('setting-toolbar-position').value = localStorage.getItem('epubx-toolbarPosition') || 'top';
    document.getElementById('setting-toolbar-position').onchange = function() { localStorage.setItem('epubx-toolbarPosition', this.value); applySettings(); };
    document.getElementById('setting-nav-position').value = localStorage.getItem('epubx-navPosition') || 'header';
    document.getElementById('setting-nav-position').onchange = function() { localStorage.setItem('epubx-navPosition', this.value); applySettings(); };
    var marginInput = document.getElementById('setting-margin');
    marginInput.value = localStorage.getItem('epubx-margin') || '12';
    marginInput.onchange = function() { var v = this.value; localStorage.setItem('epubx-margin', v); if (v !== null && v !== '') document.documentElement.style.setProperty('--reader-margin', v + 'px'); };
    document.getElementById('setting-rounded-images').checked = localStorage.getItem('epubx-roundedImages') === 'on';
    document.getElementById('setting-rounded-images').onchange = function() { localStorage.setItem('epubx-roundedImages', this.checked ? 'on' : 'off'); applySettings(); };
    document.getElementById('setting-show-toolbar').checked = localStorage.getItem('epubx-showToolbar') !== 'off';
    document.getElementById('setting-show-toolbar').onchange = function() { localStorage.setItem('epubx-showToolbar', this.checked ? 'on' : 'off'); applySettings(); };
    document.getElementById('setting-click-zones').checked = localStorage.getItem('epubx-clickZones') !== 'off';
    document.getElementById('setting-click-zones').onchange = function() { localStorage.setItem('epubx-clickZones', this.checked ? 'on' : 'off'); updateClickZones(); };
  };

  document.getElementById('export-settings-btn').onclick = function() {
    var obj = {};
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.indexOf('epubx-') === 0) obj[key] = localStorage.getItem(key);
    }
    var blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'epub-x-reader-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  document.getElementById('load-settings-btn').onclick = function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = function() {
      var f = input.files && input.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function() {
        try {
          var obj = JSON.parse(r.result);
          for (var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k) && k.indexOf('epubx-') === 0) localStorage.setItem(k, String(obj[k])); }
          applySettings();
          document.getElementById('modal-overlay').classList.add('hidden');
        } catch (e) {}
      };
      r.readAsText(f);
    };
    input.click();
  };

  var DEFAULT_SETTINGS = { 'epubx-font': 'Helvetica', 'epubx-fontSize': '16', 'epubx-theme': 'light', 'epubx-textColor': '#1a1a1a', 'epubx-bgColor': '#f5f0e8', 'epubx-linkColor': '#2563eb', 'epubx-glass': 'off', 'epubx-blur': '12', 'epubx-opacity': '25', 'epubx-toolbarPosition': 'top', 'epubx-navPosition': 'header', 'epubx-margin': '12', 'epubx-roundedImages': 'off', 'epubx-showToolbar': 'on', 'epubx-clickZones': 'on' };
  document.getElementById('restore-defaults-btn').onclick = function() {
    for (var key in DEFAULT_SETTINGS) localStorage.setItem(key, DEFAULT_SETTINGS[key]);
    applySettings();
    document.getElementById('modal-overlay').classList.add('hidden');
  };

  document.getElementById('modal-close').onclick = function() {
    document.getElementById('modal-overlay').classList.add('hidden');
  };
  document.getElementById('modal-overlay').onclick = function(e) {
    if (e.target === this) this.classList.add('hidden');
  };

  var tocList = document.getElementById('toc-list');
  tocList.innerHTML = '';
  document.getElementById('toc-title').textContent = t('toc_title');
  document.querySelectorAll('.view-btn').forEach(function(btn) {
    btn.textContent = btn.dataset.view === 'scroll' ? t('view_infinity_scroll') : btn.dataset.view === 'one' ? t('view_one_side') : btn.dataset.view === 'two' ? t('view_two_sides') : t('view_infinity_pages');
  });
  document.getElementById('prev-btn').title = t('prev');
  document.getElementById('next-btn').title = t('next');

  for (var i = 0; i < pages.length; i++) {
    if (pages[i].type === 'break') continue;
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#';
    a.textContent = pages[i].title || (t('page') + ' ' + (i + 1));
    a.onclick = function(chapterIdx) { return function(e) {
      e.preventDefault();
      if (currentView === 'one' || currentView === 'two') {
        if (pagedChunks) {
          for (var c = 0; c < pagedChunks.length; c++) {
            if (pagedChunks[c].chapterIndex === chapterIdx) { currentPageIndex = c; break; }
          }
        } else currentPageIndex = chapterIdx;
      } else currentPageIndex = chapterIdx;
      localStorage.setItem('epubx-page', String(currentPageIndex));
      showView(currentView);
      document.getElementById('toc-drawer').classList.remove('open');
    }; }(i);
    li.appendChild(a);
    tocList.appendChild(li);
  }

  loadFont(localStorage.getItem('epubx-font') || 'Helvetica');
  applySettings();
  showView(currentView);
  applyLandscapeTwoPage();
  window.addEventListener('orientationchange', applyLandscapeTwoPage);
  window.addEventListener('resize', applyLandscapeTwoPage);
  if (metadata.title) document.title = metadata.title;
})();
</script>
</body>
</html>`;
