import { styled, Box, BoxProps } from '@mui/material'

export const GroupDropIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'showIndicator'
})<BoxProps & { showIndicator: boolean }>(({ showIndicator, theme }) =>
  showIndicator
    ? {
        borderTop: `3px solid ${theme.palette.primary.main}`,
        marginTop: '-6px',
        paddingTop: '3px'
      }
    : {}
)
