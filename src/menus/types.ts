export type OutputFormat = "txt" | "md" | "json" | "html" | "webapp";

export type MainMenuAction = "convert" | "settings" | "howto" | "exit";

export type AfterFileSelectionAction =
  | "extract"
  | "select_formats"
  | "change_settings"
  | "view_selected_files"
  | "back"
  | "cancel";
