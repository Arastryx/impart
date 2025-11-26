import empty1 from './NoItemsFound1.png'
import empty2 from './NoItemsFound2.png'
import empty3 from './NoItemsFound3.png'
import empty4 from './NoItemsFound4.png'
import empty5 from './NoItemsFound5.png'
import secret from './NoItemsFoundSECRET.png'

interface EmptyImage {
  src: string
  chance?: number
  minViews?: number
}

export const emptyImages: EmptyImage[] = [
  { src: empty1 },
  { src: empty2 },
  { src: empty3 },
  { src: empty4 },
  { src: empty5, chance: 0.1, minViews: 10 },
  { src: secret, chance: 0.01, minViews: 100 }
]
