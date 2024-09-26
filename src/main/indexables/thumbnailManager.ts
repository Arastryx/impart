import { app, nativeImage } from 'electron'
import { TaggableImage } from '../database/entities/TaggableImage'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { v4 } from 'uuid'
import { Thumbnail } from '../database/entities/Thumbnail'

class ThumbnailManager {
  public async getThumbnail(taggableImageId: number) {
    const image = await TaggableImage.findOneOrFail({
      where: { id: taggableImageId },
      relations: { thumbnail: true }
    })

    if (!image.thumbnail) {
      image.thumbnail = await this.buildThumbnail(image)
      await image.save()
    }

    return image.thumbnail.path
  }

  private async buildThumbnail(image: TaggableImage) {
    const thumb = await nativeImage.createThumbnailFromPath(
      image.fileIndex.path.replaceAll('/', '\\').replaceAll('%20', ' '),
      {
        width: 400,
        height: 400
      }
    )

    const thumbnailPath = app.isPackaged
      ? `${app.getPath('appData')}/impart/app/thumbnails`
      : `${app.getPath('appData')}/impart/dev/thumbnails`

    if (!existsSync(thumbnailPath)) {
      await mkdir(thumbnailPath)
    }

    const isJpeg =
      image.fileIndex.fileName.endsWith('jpg') || image.fileIndex.fileName.endsWith('jpg')
    const path = `${thumbnailPath}/${v4()}.${isJpeg ? 'jpg' : 'png'}`

    await writeFile(path, isJpeg ? thumb.toJPEG(100) : thumb.toPNG())

    return Thumbnail.create({
      path,
      dimensions: thumb.getSize()
    })
  }
}

export const thumbnailManager = new ThumbnailManager()
