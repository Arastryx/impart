import {
  MenuList,
  Divider,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  MenuItem
} from '@mui/material'
import React from 'react'
import CheckedIcon from '@mui/icons-material/CheckBox'
import UncheckedIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import { ContextMenuOption } from './ContextMenu'

export interface ContextMenuListProps {
  options?: (ContextMenuOption | 'divider')[]
  onClose?: () => void
}

export function ContextMenuList({ options, onClose }: ContextMenuListProps) {
  return (
    <MenuList
      sx={{
        '& .MuiPaper-root': { minWidth: 200 },
        '& .MuiMenuItem-root+.MuiDivider-root': { marginY: 0.5 }
      }}
      dense
    >
      {options
        ?.filter((o) => o === 'divider' || !o.hide)
        //Filter out all sequential dividers
        .filter((o, index, all) => o !== 'divider' || all[index + 1] !== 'divider')
        .map((o, index, list) =>
          o === 'divider' ? (
            index !== 0 && index != list.length - 1 && <Divider key={index} sx={{ margin: 0 }} />
          ) : (
            <MenuItem
              key={index}
              onClick={(e) => {
                o.onClick && o.onClick()
                if (o.isChecked === undefined) {
                  onClose?.()
                }
                e.stopPropagation()
              }}
              disabled={o.disabled}
            >
              {(o.icon || o.isChecked !== undefined) && (
                <ListItemIcon
                  sx={{
                    color: o.danger ? 'error.main' : undefined
                  }}
                >
                  {o.isChecked !== undefined && (o.isChecked ? <CheckedIcon /> : <UncheckedIcon />)}
                  {o.isChecked === undefined && o.icon}
                </ListItemIcon>
              )}
              <ListItemText
                inset={!o.icon && o.isChecked === undefined}
                sx={{
                  color: o.danger ? 'error.dark' : undefined
                }}
                primary={o.label}
                slotProps={{ primary: { fontWeight: o.bold ? 'bold' : undefined } }}
              />

              {o.shortcut && (
                <Box pl={2} sx={{ opacity: 0.6 }}>
                  <Typography
                    variant="body2"
                    fontSize={12}
                    sx={{ color: o.danger ? 'error.light' : 'text.secondary' }}
                  >
                    {o.shortcut}
                  </Typography>
                </Box>
              )}
            </MenuItem>
          )
        )}
    </MenuList>
  )
}
