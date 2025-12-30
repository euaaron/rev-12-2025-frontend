import { alpha, createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#006ddaff",
    },
    background: {
      default: "#0B0D10",
      paper: alpha("#141821", 0.72),
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
    h4: {
      fontWeight: 700,
      letterSpacing: -0.4,
    },
    h6: {
      fontWeight: 650,
      letterSpacing: -0.2,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        body: {
          backgroundColor: themeParam.palette.background.default,
          backgroundImage: `radial-gradient(1200px 600px at 20% 0%, ${alpha(
            themeParam.palette.primary.main,
            0.18
          )} 0%, transparent 55%), radial-gradient(900px 500px at 90% 10%, ${alpha(
            themeParam.palette.common.white,
            0.06
          )} 0%, transparent 60%)`,
          backgroundAttachment: "fixed",
        },
      }),
    },

    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: "none",
          borderRadius: theme.shape.borderRadius,
        }),
        outlined: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.background.paper, 0.9),
          borderColor: alpha(theme.palette.common.white, 0.10),
          backdropFilter: "blur(14px)",
        }),
      },
    },

    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: "none",
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${alpha(theme.palette.common.white, 0.10)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: "blur(14px)",
        }),
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundImage: "none",
          borderRadius:
            typeof theme.shape.borderRadius === "number"
              ? theme.shape.borderRadius + 6
              : theme.shape.borderRadius,
          border: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.92),
          backdropFilter: "blur(18px)",
        }),
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 999,
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2),
        }),
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          transition: theme.transitions.create(["background-color"], {
            duration: theme.transitions.duration.shorter,
          }),
        }),
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 14,
          backgroundColor: alpha(theme.palette.common.white, 0.04),
        }),
        notchedOutline: ({ theme }) => ({
          borderColor: alpha(theme.palette.common.white, 0.14),
        }),
      },
    },

    MuiSelect: {
      styleOverrides: {
        select: () => ({
          backgroundColor: "transparent",
          opacity: 1,
          borderRadius: 14,
        }),
        icon: () => ({
          opacity: 1,
        }),
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: () => ({
          backgroundColor: "transparent",
          borderRadius: 14,
        }),
      }
    },

    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.common.white, 0.14),
          backdropFilter: "blur(18px)",
          border: `1px solid ${alpha(theme.palette.common.white, 0.06)}`,
          opacity: 1,
        }),
        list: {
          paddingTop: 0,
          paddingBottom: 0,
        }
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          opacity: 1,
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
        }),
      },
    },
  },
});
