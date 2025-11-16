import React from 'react'
import { DirectoryEditor } from './DirectoryEditor'
import { produce } from 'immer'
import { isSubdirectory } from './isSubdirectory'

export interface DirectoryListProps {
  directoryState: Impart.Directory[]
  originalDirectories?: Impart.Directory[]
  onChange: (state: Impart.Directory[]) => void
}

export function DirectoryList({
  directoryState,
  originalDirectories,
  onChange
}: DirectoryListProps) {
  function removeDir(dir: Impart.Directory) {
    return produce(directoryState, (next) => {
      const index = next.findIndex((d) => d.path === dir.path)

      if (index != -1) {
        next?.splice(index, 1)
      }
    })
  }

  function restoreDir(dir: Impart.Directory) {
    return produce(directoryState, (next) => {
      const index = next.findIndex((d) => d.path === dir.path)
      const originalDir = originalDirectories?.find((d) => d.path === dir.path)

      if (index != -1) {
        if (originalDir) {
          next?.splice(index, 1, originalDir)
        } else {
          next.splice(index, 1)
        }
      } else {
        if (originalDir) {
          next.push(originalDir)
        }
      }
    })
  }

  const updateDirectory = (path: string, state: Partial<Impart.Directory>) => {
    onChange(
      produce(directoryState, (next) => {
        const index = next.findIndex((d) => d.path === path)

        if (index != -1) {
          next[index] = { ...next[index], ...state }
        }
      })
    )
  }

  return (
    <>
      {originalDirectories?.map((original) => (
        <DirectoryEditor
          key={original.path}
          directoryState={directoryState.find((state) => state.path === original.path)}
          originalDirectory={original}
          subDirectories={directoryState.filter(
            (ds) => ds.path != original.path && isSubdirectory(ds.path, original.path)
          )}
          onChange={(updatedState) => updateDirectory(original.path, updatedState)}
          onDelete={() => onChange(removeDir(original))}
          onRestore={() => onChange(restoreDir(original))}
        />
      ))}
      {directoryState
        .filter((state) => !originalDirectories?.some((original) => original.path === state.path))
        .map((state) => (
          <DirectoryEditor
            key={state.path}
            directoryState={state}
            subDirectories={directoryState.filter(
              (otherState) =>
                state.path != otherState.path && isSubdirectory(otherState.path, state.path)
            )}
            onChange={(updatedState) => updateDirectory(state.path, updatedState)}
            onDelete={() => onChange(removeDir(state))}
          />
        ))}
    </>
  )
}
