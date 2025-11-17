export function isTaggableImage(t: Impart.Taggable): t is Impart.TaggableImage {
  return (t as Impart.TaggableImage).dimensions != null
}

export function isTaggableFile(t: Impart.Taggable): t is Impart.TaggableFile {
  return !isTaggableImage(t) && (t as Impart.TaggableFile).fileIndex != null
}

export function isTaggableStack(t: Impart.Taggable): t is Impart.TaggableStack {
  return !isTaggableImage(t) && !isTaggableFile(t)
}
