export function isSubdirectory(childPath: string, parentPath: string) {
  //Seeing as it's a bit cumbersome to check what platform we're currently on, it's easier
  // to just check both file separate types for recursive directories
  return childPath.startsWith(parentPath + '\\') || childPath.startsWith(parentPath + '/')
}
