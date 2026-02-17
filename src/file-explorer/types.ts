export interface FileExplorerEntry {
  type: "parent" | "directory" | "epub";
  name: string;
  path: string;
}
