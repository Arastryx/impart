import { Box, BoxProps, ClickAwayListener, Paper, PopoverVirtualElement } from '@mui/material'
import React from 'react'
import { useContextMenu } from './useContextMenu'
import { BetterPopper } from '../BetterPopper'
import { useHotkeys } from 'react-hotkeys-hook'
import { ContextMenuList } from './ContextMenuList'

export interface ContextMenuOption {
  label: React.ReactNode
  icon?: React.ReactNode
  shortcut?: string
  disabled?: boolean
  hide?: boolean
  danger?: boolean
  onClick?: () => void
  bold?: boolean
  isChecked?: boolean
}

export interface ContextMenuRenderProps {
  isOpen: boolean
  open: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  close: () => void
}

export interface ContextMenuProps extends Omit<BoxProps, 'children'> {
  options?: (ContextMenuOption | 'divider')[]
  disabled?: boolean
  render: (props: ContextMenuRenderProps) => React.ReactNode
}

export function ContextMenu({ options, render, disabled, ...boxProps }: ContextMenuProps) {
  const { anchorPosition, closeMenu, handleContextMenu, open } = useContextMenu()

  const { left = 0, top = 0 } = { ...anchorPosition }

  useHotkeys('escape', closeMenu)

  return (
    <>
      <Box width="100%" height="100%" {...boxProps}>
        {render({
          isOpen: open,
          open: (e) => {
            if (!disabled) {
              handleContextMenu(e)
            }
          },
          close: closeMenu
        })}
      </Box>
      <BetterPopper
        placement="bottom-start"
        open={open}
        anchorEl={() =>
          ({
            getBoundingClientRect: () => ({
              width: 0,
              height: 0,
              top: top,
              right: left,
              bottom: top,
              left: left,
              x: left,
              y: top,
              toJSON: () => ({})
            }),
            nodeType: 1
          }) satisfies PopoverVirtualElement
        }
      >
        <ClickAwayListener onClickAway={() => closeMenu()}>
          <Paper>
            <ContextMenuList options={options} />
          </Paper>
        </ClickAwayListener>
      </BetterPopper>
    </>
  )
}
