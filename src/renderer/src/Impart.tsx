import { Box, Dialog, DialogContent } from '@mui/material'
import { useEffect, useState } from 'react'
import { useTaggables } from './EntityProviders/TaggableProvider'
import { TaggableBrowser } from './TaggableBrowser'
import { IntroSetup } from './IntroSetup'
import { useDirectories } from './EntityProviders/DirectoryProvider'
import { Settings } from './Settings'
import { BulkTag } from './BulkTag'
import { CreateStack } from './CreateStack'
import { ImpartDragAndDropProvider } from './Common/Components/DragAndDrop/ImpartDragAndDropProvider'
import { useHotkeys } from 'react-hotkeys-hook'
import { TaggableSelectionProvider } from './TaggableSelectionProvider'
import { AssociateWithSource } from './AssociateWithSource'
import { isTaggableImage } from './Common/taggable'
import { PatchNotes } from './PatchNotes/PatchNotes'
import { useShowPatchNotes } from './PatchNotes'

type ImpartModal = 'bulkTag' | 'settings' | 'createStack' | 'associateSource'

export interface ImpartProps {}

export function Impart({}: ImpartProps) {
  const { data: directories, startingUp, reload: reloadDirectories } = useDirectories()

  const hasDirectories = directories && directories.length !== 0

  const [currentModal, setCurrentModal] = useState<ImpartModal | null>(null)
  const [selection, setSelection] = useState<Impart.Taggable[]>([])

  const { reload: fetchTaggables } = useTaggables()

  const { show, setShow } = useShowPatchNotes()

  useEffect(() => {
    window.indexApi.indexAll()
  }, [])

  const closeAndRefresh = () => {
    setCurrentModal(null)
    fetchTaggables()
  }

  const renderContent = () => {
    switch (currentModal) {
      case 'settings':
        return (
          <Settings onClose={() => setCurrentModal(null)} onShowPatchNotes={() => setShow(true)} />
        )
      case 'bulkTag':
        return <BulkTag items={selection} onFinish={closeAndRefresh} />
      case 'createStack':
        return <CreateStack items={selection} onFinish={closeAndRefresh} />
      case 'associateSource':
        if (!selection.every(isTaggableImage)) {
          throw new Error('Attempted to associate non-image items with source files')
        }

        return <AssociateWithSource items={selection} onFinish={closeAndRefresh} />
    }
  }

  if (startingUp) {
    return null
  }

  if (!hasDirectories) {
    return <IntroSetup reload={reloadDirectories} />
  }

  return (
    <TaggableSelectionProvider selection={selection} setSelection={setSelection}>
      <ImpartDragAndDropProvider>
        <Box>
          <TaggableBrowser
            onSettingsPressed={() => setCurrentModal('settings')}
            onBulkTag={() => setCurrentModal('bulkTag')}
            onCreateStack={() => setCurrentModal('createStack')}
            onAssociateWithSource={() => setCurrentModal('associateSource')}
          />
          <Dialog open={currentModal != null} onClose={() => setCurrentModal(null)} fullScreen>
            <DialogContent sx={(theme) => ({ bgcolor: theme.palette.background.default })}>
              {renderContent()}
            </DialogContent>
          </Dialog>
        </Box>
        <PatchNotes show={show} onClose={() => setShow(false)} />
      </ImpartDragAndDropProvider>
    </TaggableSelectionProvider>
  )
}

