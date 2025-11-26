import { useLocalStorage } from '@renderer/Common/Hooks/useLocalStorage'
import { useState, useEffect } from 'react'
import { emptyImages } from './EmptyImages'

function getRandomEmptyImage(viewCount: number) {
  const randomRoll = Math.random()
  const potentialImages = emptyImages.filter(
    (e) =>
      (e.minViews == null || e.minViews < viewCount) && (e.chance == null || randomRoll < e.chance)
  )
  return potentialImages[Math.floor(Math.random() * potentialImages.length)].src
}

const VIEWED_EMPTY_COUNT_KEY = 'viewedEmptyCount'

export function useRandomEmptyImage(taggableCount: number) {
  const [viewedEmptyCount, setViewedEmptyCount] = useLocalStorage(VIEWED_EMPTY_COUNT_KEY, 0)
  const allowSecret = viewedEmptyCount > 100

  const [emptyImage, setEmptyImage] = useState(() => getRandomEmptyImage(viewedEmptyCount))

  useEffect(() => {
    //To prevent flickering, we only change the image if there ARE taggables
    // rather than if there aren't
    if (taggableCount > 0) {
      setEmptyImage(getRandomEmptyImage(viewedEmptyCount))
    } else {
      setViewedEmptyCount((count) => count + 1)
    }
  }, [taggableCount, allowSecret])

  return emptyImage
}
