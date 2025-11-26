import { createTheme } from '@mui/material'
import NunitoSans from './fonts/NunitoSans.woff2'
import NunitoSansItalic from './fonts/NunitoSans-Italic.woff2'
import Mallanna from './fonts/Mallanna-Regular.woff2'
import ZenOldMincho from './fonts/ZenOldMincho.woff2'

export const theme = createTheme({
  cssVariables: true,
  palette: {
    background: {
      default: '#c6dcd8',
      paper: '#e0f5f1'
    },
    text: {
      primary: '#294541',
      secondary: '#5c7e79'
    },
    primary: {
      main: '#30947b'
    },
    secondary: {
      main: '#a7deda'
    },
    info: {
      main: '#80b5cc'
    },
    success: {
      main: '#56d899'
    },
    warning: {
      main: '#9ac64d'
    },
    error: {
      main: '#c1867e'
    }
  },
  typography: {
    fontFamily: 'NunitoSans, Arial, sans-serif'
  },
  //For some reason, this isn't working, so I guess I just have to
  // manually apply it to everything??
  components: {
    MuiCssBaseline: {
      styleOverrides: `
          @font-face {
            font-family: 'NunitoSans';
            src: url(${NunitoSans});
          }

          @font-face {
            font-family: 'NunitoSans';
            font-style: italic;
            src: url(${NunitoSansItalic});
          }

          @font-face {
            font-family: 'Mallanna';
            src: url(${Mallanna});
          }

          @font-face {
            font-family: 'ZenOldMincho';
            src: url(${ZenOldMincho});
          }

          code {
            background-color: #d6efeaff;
            padding: 0px 2px;
            border-radius: 4px;
            border: 1px dashed #b2d2cbff
          }

          a {
            color: #106751ff
          }
        `
    },

    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-track': {
            opacity: 0.12
          }
        },
        checked: {
          '& .MuiSwitch-track': {
            opacity: 0.38
          }
        }
      }
    },

    MuiChip: {
      styleOverrides: {
        sizeMedium: {
          borderRadius: 12,
          height: 28
        },
        labelMedium: {
          paddingLeft: 10,
          paddingRight: 10
        },
        sizeSmall: {
          borderRadius: 8,
          height: 22
        },
        labelSmall: {
          paddingLeft: 8,
          paddingRight: 8
        }
      }
    },

    MuiTypography: {
      styleOverrides: {
        caption: {
          fontFamily: 'Mallanna, Courier, monospace'
        },
        h5: {
          fontSize: 22
        }
      }
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    },

    MuiList: {
      styleOverrides: {
        root: {
          display: 'flex',
          flexDirection: 'column'
        }
      }
    },

    MuiListItem: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 10,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'secondary.main'
        }
      }
    },

    MuiButton: {
      styleOverrides: {
        sizeSmall: {
          borderRadius: 12,
          paddingLeft: 14,
          paddingRight: 14
        },
        sizeMedium: {
          borderRadius: 16,
          paddingLeft: 24,
          paddingRight: 24
        },
        sizeLarge: {
          borderRadius: 20,
          paddingLeft: 30,
          paddingRight: 30
        }
      }
    },

    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#e0f5f1'
          }
        }
      }
    },

    MuiListSubheader: {
      styleOverrides: {
        root: {
          paddingLeft: 4,
          paddingRight: 4,
          borderRadius: 8,
          backgroundColor: 'primary.light',
          color: 'primary.contrastText',
          marginLeft: 6,
          marginRight: 6,
          height: 24,
          lineHeight: '26px'
        }
      }
    }
  }
})

