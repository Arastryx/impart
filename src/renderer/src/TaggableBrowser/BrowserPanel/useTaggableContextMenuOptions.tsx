import { ContextMenuOption } from '@renderer/Common/Components/ContextMenu/ContextMenu'
import FileOpenIcon from '@mui/icons-material/FileOpenRounded'
import FolderIcon from '@mui/icons-material/FolderRounded'
import TagIcon from '@mui/icons-material/LocalOfferRounded'
import BrushIcon from '@mui/icons-material/BrushRounded'
import BookmarksIcon from '@mui/icons-material/BookmarksRounded'
import BurstModeIcon from '@mui/icons-material/BurstModeRounded'
import HideImageIcon from '@mui/icons-material/HideImageRounded'
import ImageIcon from '@mui/icons-material/ImageRounded'
import { useConfirmationDialog } from '@renderer/Common/Components/ConfirmationDialogProvider'
import { useImpartIpcCall } from '@renderer/Common/Hooks/useImpartIpc'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import CancelIcon from '@mui/icons-material/CancelRounded'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutlineRounded'
import AddLinkIcon from '@mui/icons-material/AddLinkRounded'
import { isTaggableImage, isTaggableStack } from '@renderer/Common/taggable'
import LinkOffIcon from '@mui/icons-material/LinkOff'

export interface TaggableGridEvents {
  onAssociateWithSource?: (taggables: Impart.TaggableImage[]) => void
  onEditTags?: (taggable: Impart.Taggable) => void
  onBulkTag?: (taggables: Impart.Taggable[]) => void
  onCreateStack?: (taggables: Impart.Taggable[]) => void
  onOpenStack?: (taggable: Impart.TaggableStack) => void
  onRenameStack?: (taggable: Impart.TaggableStack) => void
  onHide?: (taggable: Impart.Taggable[]) => void
}

export function useTaggableContextMenuOptions(
  selection: Impart.Taggable[],
  {
    onEditTags,
    onBulkTag,
    onCreateStack,
    onOpenStack,
    onHide,
    onRenameStack,
    onAssociateWithSource
  }: TaggableGridEvents
): (ContextMenuOption | 'divider')[] {
  const confirm = useConfirmationDialog()
  const { callIpc: removeStack } = useImpartIpcCall(window.stackApi.remove, [])
  const { callIpc: setCover } = useImpartIpcCall(window.stackApi.setCover, [])
  const { callIpc: detachSourceFile } = useImpartIpcCall(window.taggableApi.detachSourceFile, [])

  const { reload, stackTrail } = useTaggables()

  let selectedImage: Impart.TaggableImage | undefined = undefined

  if (selection.length > 0 && isTaggableImage(selection[0])) {
    selectedImage = selection[0]
  }

  if (selection.length === 0) {
    return []
  }

  return [
    {
      icon: <FileOpenIcon />,
      label: 'Open',
      hide: selection.length > 1,
      onClick: () =>
        selection.length == 1 && isTaggableStack(selection[0])
          ? onOpenStack && onOpenStack(selection[0])
          : window.fileApi.openFile(selection[0].id)
    },
    {
      icon: <FolderIcon />,
      label: 'Open File Location',
      hide: selection.length > 1 || isTaggableStack(selection[0]),
      onClick: () => window.fileApi.openFileLocation(selection[0].id)
    },
    {
      icon: <AddLinkIcon />,
      label: 'Associate With Source File...',
      hide: !selection.every((t) => isTaggableImage(t) && t.source == null),
      onClick: () =>
        onAssociateWithSource &&
        selection.every(isTaggableImage) &&
        onAssociateWithSource(selection)
    },
    {
      icon: <BrushIcon />,
      label: 'Open Source',
      hide: selection.length > 1 || !isTaggableImage(selection[0]) || selection[0].source == null,
      onClick: () => window.fileApi.openFile(selectedImage!.source!.id)
    },
    'divider',
    {
      icon: <TagIcon />,
      label: 'Edit Tags...',
      hide: selection.length > 1,
      shortcut: 'Ctrl + E',
      onClick: () => onEditTags && onEditTags(selection[0])
    },
    {
      icon: <BookmarksIcon />,
      label: 'Bulk Tag...',
      hide: selection.length < 2,
      shortcut: 'Ctrl + E',
      onClick: () => onBulkTag && onBulkTag(selection)
    },
    'divider',
    {
      icon: <BurstModeIcon />,
      label: 'Create Stack...',
      hide: selection.length < 2,
      onClick: () => onCreateStack && onCreateStack(selection)
    },
    {
      icon: <DriveFileRenameOutlineIcon />,
      label: 'Rename Stack...',
      hide: selection.length !== 1 || !isTaggableStack(selection[0]),
      onClick: () => onRenameStack && isTaggableStack(selection[0]) && onRenameStack(selection[0])
    },
    {
      icon: <ImageIcon />,
      label: 'Set as Stack Cover',
      disabled: selection.length > 0 && !isTaggableImage(selection[0]),
      hide: selection.length !== 1 || stackTrail.length === 0,
      onClick: () => setCover(stackTrail[stackTrail.length - 1].id, selection[0].id)
    },
    {
      icon: <CancelIcon />,
      label: 'Explode Stack',
      hide: selection.length !== 1 || !isTaggableStack(selection[0]),
      danger: true,
      onClick: () =>
        confirm(
          {
            title: 'Explode Stack?',
            body: 'All items within the stack will be merged into the current view.',
            confirmIcon: <CancelIcon />,
            danger: true,
            confirmText: 'Explode'
          },
          async () => {
            if (selection.length === 1) {
              await removeStack(selection[0].id)
              reload()
            }
          }
        )
    },
    {
      icon: <LinkOffIcon />,
      label: 'Detach Source File',
      hide: !selection.some(isTaggableImage),
      onClick: async () => {
        await detachSourceFile(selection.filter(isTaggableImage).map((s) => s.id))
        reload()
      }
    },
    'divider',
    {
      icon: <HideImageIcon />,
      label: 'Hide',
      onClick: () => onHide && onHide(selection)
    }
  ]
}
