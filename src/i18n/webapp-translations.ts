import type { LocaleId } from "./types.js";
import { SUPPORTED_LOCALES } from "./types.js";

export interface WebAppTranslations {
  view_infinity_scroll: string;
  view_one_side: string;
  view_two_sides: string;
  view_infinity_pages: string;
  toc_title: string;
  prev: string;
  next: string;
  page: string;
  of: string;
  options: string;
  settings: string;
  close: string;
  font_family: string;
  font_size: string;
  theme: string;
  text_color: string;
  bg_color: string;
  link_color: string;
  glassmorphism: string;
  blur: string;
  opacity: string;
  language: string;
  cover_page: string;
  font_preserve_original: string;
  toolbar_position: string;
  nav_position: string;
  reader_margin: string;
  images_rounded: string;
  export_settings: string;
  load_settings: string;
  show_toolbar: string;
  restore_defaults: string;
  click_zones: string;
}

const EN: WebAppTranslations = {
  view_infinity_scroll: "Infinity scroll",
  view_one_side: "One page",
  view_two_sides: "Two pages",
  view_infinity_pages: "Infinity pages",
  toc_title: "Table of contents",
  prev: "Previous",
  next: "Next",
  page: "Page",
  of: "of",
  options: "Options",
  settings: "Settings",
  close: "Close",
  font_family: "Font",
  font_size: "Font size",
  theme: "Theme",
  text_color: "Text color",
  bg_color: "Background",
  link_color: "Link color",
  glassmorphism: "Glassmorphism",
  blur: "Blur",
  opacity: "Opacity",
  language: "Language",
  cover_page: "Cover",
  font_preserve_original: "Preserve original",
  toolbar_position: "Toolbar position",
  nav_position: "Nav buttons",
  reader_margin: "Margin",
  images_rounded: "Rounded images",
  export_settings: "Export settings",
  load_settings: "Load settings",
  show_toolbar: "Show toolbar",
  restore_defaults: "Restore defaults",
  click_zones: "Click zones (prev/next)",
};

const PL: WebAppTranslations = {
  ...EN,
  view_infinity_scroll: "Nieskończone przewijanie",
  view_one_side: "Jedna strona",
  view_two_sides: "Dwie strony",
  view_infinity_pages: "Nieskończone strony",
  toc_title: "Spis treści",
  prev: "Poprzedni",
  next: "Następny",
  page: "Strona",
  of: "z",
  options: "Opcje",
  settings: "Ustawienia",
  close: "Zamknij",
  font_family: "Czcionka",
  font_size: "Rozmiar czcionki",
  theme: "Motyw",
  text_color: "Kolor tekstu",
  bg_color: "Tło",
  link_color: "Kolor linku",
  glassmorphism: "Szkłomorfizm",
  blur: "Rozmycie",
  opacity: "Nieprzezroczystość",
  language: "Język",
  cover_page: "Okładka",
  font_preserve_original: "Zachowaj oryginał",
};

const DE: WebAppTranslations = {
  ...EN,
  view_infinity_scroll: "Endloses Scrollen",
  view_one_side: "Eine Seite",
  view_two_sides: "Zwei Seiten",
  view_infinity_pages: "Endlose Seiten",
  toc_title: "Inhaltsverzeichnis",
  prev: "Zurück",
  next: "Weiter",
  page: "Seite",
  of: "von",
  options: "Optionen",
  settings: "Einstellungen",
  close: "Schließen",
  font_family: "Schrift",
  font_size: "Schriftgröße",
  theme: "Thema",
  text_color: "Textfarbe",
  bg_color: "Hintergrund",
  link_color: "Linkfarbe",
  glassmorphism: "Glassmorphismus",
  blur: "Unschärfe",
  opacity: "Deckkraft",
  language: "Sprache",
  cover_page: "Umschlag",
  font_preserve_original: "Original beibehalten",
};

const FR: WebAppTranslations = {
  ...EN,
  view_infinity_scroll: "Défilement infini",
  view_one_side: "Une page",
  view_two_sides: "Deux pages",
  view_infinity_pages: "Pages infinies",
  toc_title: "Table des matières",
  prev: "Précédent",
  next: "Suivant",
  page: "Page",
  of: "sur",
  options: "Options",
  settings: "Paramètres",
  close: "Fermer",
  font_family: "Police",
  font_size: "Taille de police",
  theme: "Thème",
  text_color: "Couleur du texte",
  bg_color: "Arrière-plan",
  link_color: "Couleur des liens",
  glassmorphism: "Glassmorphisme",
  blur: "Flou",
  opacity: "Opacité",
  language: "Langue",
  cover_page: "Couverture",
  font_preserve_original: "Conserver l’original",
};

const ES: WebAppTranslations = {
  ...EN,
  view_infinity_scroll: "Scroll infinito",
  view_one_side: "Una página",
  view_two_sides: "Dos páginas",
  view_infinity_pages: "Páginas infinitas",
  toc_title: "Índice",
  prev: "Anterior",
  next: "Siguiente",
  page: "Página",
  of: "de",
  options: "Opciones",
  settings: "Ajustes",
  close: "Cerrar",
  font_family: "Fuente",
  font_size: "Tamaño de fuente",
  theme: "Tema",
  text_color: "Color del texto",
  bg_color: "Fondo",
  link_color: "Color del enlace",
  glassmorphism: "Glassmorphism",
  blur: "Desenfoque",
  opacity: "Opacidad",
  language: "Idioma",
  cover_page: "Portada",
  font_preserve_original: "Conservar original",
};

const IT: WebAppTranslations = {
  ...EN,
  view_infinity_scroll: "Scorrimento infinito",
  view_one_side: "Una pagina",
  view_two_sides: "Due pagine",
  view_infinity_pages: "Pagine infinite",
  toc_title: "Sommario",
  prev: "Precedente",
  next: "Successivo",
  page: "Pagina",
  of: "di",
  options: "Opzioni",
  settings: "Impostazioni",
  close: "Chiudi",
  font_family: "Carattere",
  font_size: "Dimensione carattere",
  theme: "Tema",
  text_color: "Colore testo",
  bg_color: "Sfondo",
  link_color: "Colore link",
  glassmorphism: "Glassmorphism",
  blur: "Sfocatura",
  opacity: "Opacità",
  language: "Lingua",
  cover_page: "Copertina",
  font_preserve_original: "Conserva originale",
};

const PT: WebAppTranslations = {
  ...EN,
  view_infinity_scroll: "Rolagem infinita",
  view_one_side: "Uma página",
  view_two_sides: "Duas páginas",
  view_infinity_pages: "Páginas infinitas",
  toc_title: "Índice",
  prev: "Anterior",
  next: "Próximo",
  page: "Página",
  of: "de",
  options: "Opções",
  settings: "Configurações",
  close: "Fechar",
  font_family: "Fonte",
  font_size: "Tamanho da fonte",
  theme: "Tema",
  text_color: "Cor do texto",
  bg_color: "Fundo",
  link_color: "Cor do link",
  glassmorphism: "Glassmorphism",
  blur: "Desfoque",
  opacity: "Opacidade",
  language: "Idioma",
  cover_page: "Capa",
  font_preserve_original: "Preservar original",
};

const RU: WebAppTranslations = {
  ...EN,
  view_infinity_scroll: "Бесконечная прокрутка",
  view_one_side: "Одна страница",
  view_two_sides: "Две страницы",
  view_infinity_pages: "Бесконечные страницы",
  toc_title: "Содержание",
  prev: "Назад",
  next: "Вперёд",
  page: "Стр.",
  of: "из",
  options: "Настройки",
  settings: "Параметры",
  close: "Закрыть",
  font_family: "Шрифт",
  font_size: "Размер шрифта",
  theme: "Тема",
  text_color: "Цвет текста",
  bg_color: "Фон",
  link_color: "Цвет ссылки",
  glassmorphism: "Стекло",
  blur: "Размытие",
  opacity: "Прозрачность",
  language: "Язык",
  cover_page: "Обложка",
  font_preserve_original: "Сохранить оригинал",
};

const ZH: WebAppTranslations = {
  ...EN,
  view_infinity_scroll: "无限滚动",
  view_one_side: "单页",
  view_two_sides: "双页",
  view_infinity_pages: "无限页",
  toc_title: "目录",
  prev: "上一页",
  next: "下一页",
  page: "页",
  of: "共",
  options: "选项",
  settings: "设置",
  close: "关闭",
  font_family: "字体",
  font_size: "字号",
  theme: "主题",
  text_color: "文字颜色",
  bg_color: "背景",
  link_color: "链接颜色",
  glassmorphism: "毛玻璃",
  blur: "模糊",
  opacity: "不透明度",
  language: "语言",
  cover_page: "封面",
  font_preserve_original: "保留原样",
};

const JA: WebAppTranslations = {
  ...EN,
  view_infinity_scroll: "無限スクロール",
  view_one_side: "片面",
  view_two_sides: "見開き",
  view_infinity_pages: "無限ページ",
  toc_title: "目次",
  prev: "前へ",
  next: "次へ",
  page: "ページ",
  of: "/",
  options: "オプション",
  settings: "設定",
  close: "閉じる",
  font_family: "フォント",
  font_size: "フォントサイズ",
  theme: "テーマ",
  text_color: "文字色",
  bg_color: "背景",
  link_color: "リンク色",
  glassmorphism: "ガラスモーフィズム",
  blur: "ぼかし",
  opacity: "不透明度",
  language: "言語",
  cover_page: "表紙",
  font_preserve_original: "元のまま",
};

const BY_LOCALE: Record<LocaleId, WebAppTranslations> = {
  en: EN,
  pl: PL,
  de: DE,
  fr: FR,
  es: ES,
  it: IT,
  pt: PT,
  ru: RU,
  zh: ZH,
  ja: JA,
};

export function getWebAppTranslations(locale: LocaleId): WebAppTranslations {
  return BY_LOCALE[locale] ?? EN;
}

export function getAllWebAppTranslations(): Record<string, WebAppTranslations> {
  const out: Record<string, WebAppTranslations> = {};
  for (const loc of SUPPORTED_LOCALES) {
    out[loc] = BY_LOCALE[loc];
  }
  return out;
}
