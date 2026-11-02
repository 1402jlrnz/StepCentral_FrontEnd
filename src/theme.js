import { createTheme } from '@mui/material/styles';

// Step Central — sneaker aesthetic: black / white / red
// Mirrors the CSS variables in styles/global.css (design tokens)
// Typography: Montserrat display face (bold, geometric — streetwear/retail)
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ff3b3b',
            light: '#ff5757',
            dark: '#e02525',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#fafafa',
            light: '#ffffff',
            dark: '#e4e4e7',
            contrastText: '#0a0a0a'
        },
        background: {
            default: '#0a0a0a',
            paper: '#141414'
        },
        text: {
            primary: '#fafafa',
            secondary: '#a1a1aa',
            disabled: '#71717a'
        },
        divider: '#262626',
        success: { main: '#22c55e' },
        error: { main: '#ef4444' },
        warning: { main: '#f59e0b' },
        info: { main: '#4285f4' }
    },
    typography: {
        fontFamily: "'Montserrat', 'Amazon Ember', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
        h1: { fontWeight: 800, letterSpacing: '-0.02em' },
        h2: { fontWeight: 800, letterSpacing: '-0.02em' },
        h3: { fontWeight: 700, letterSpacing: '-0.01em' },
        h4: { fontWeight: 700, letterSpacing: '-0.01em' },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 700 },
        button: { fontWeight: 700, letterSpacing: '0.03em' },
        subtitle1: { color: '#a1a1aa' },
        subtitle2: { color: '#a1a1aa' },
        body1: { color: '#fafafa' },
        body2: { color: '#a1a1aa' }
    },
    shape: {
        borderRadius: 12
    },
    components: {
        // Visible focus ring for keyboard navigation (a11y checklist)
        MuiButtonBase: {
            styleOverrides: {
                root: {
                    '&:focus-visible': {
                        outline: '2px solid #ff3b3b',
                        outlineOffset: '2px'
                    }
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 700,
                    padding: '0.6rem 1.5rem',
                    transition: 'all 0.2s ease'
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #ff3b3b 0%, #e02525 100%)',
                    boxShadow: 'none',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #ff5757 0%, #ff3b3b 100%)',
                        boxShadow: '0 8px 25px rgba(255, 59, 59, 0.35)'
                    }
                },
                outlinedPrimary: {
                    borderColor: '#2a2a2a',
                    color: '#fafafa',
                    '&:hover': {
                        borderColor: '#ff3b3b',
                        color: '#ff3b3b',
                        background: 'rgba(255, 59, 59, 0.06)'
                    }
                },
                outlined: {
                    borderColor: '#2a2a2a',
                    color: '#a1a1aa',
                    '&:hover': {
                        borderColor: '#ff3b3b',
                        color: '#ff3b3b'
                    }
                },
                text: {
                    color: '#a1a1aa',
                    '&:hover': { color: '#ff3b3b' }
                }
            }
        },
        MuiTextField: {
            defaultProps: { variant: 'outlined' }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1a1a1a',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2a2a2a'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3a3a3a'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ff3b3b'
                    }
                },
                input: { color: '#fafafa' }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#a1a1aa',
                    '&.Mui-focused': { color: '#ff3b3b' }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(145deg, rgba(28,28,28,0.85) 0%, rgba(20,20,20,0.9) 100%)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid #262626',
                    borderRadius: 16,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
                    transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: { fontWeight: 700 }
            }
        },
        MuiDivider: {
            styleOverrides: { root: { borderColor: '#262626' } }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    background: 'linear-gradient(145deg, rgba(28,28,28,0.85) 0%, rgba(20,20,20,0.9) 100%)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid #262626'
                }
            }
        },
        // Glass dropdown / dialog surfaces
        MuiPopover: {
            styleOverrides: {
                paper: {
                    background: 'linear-gradient(145deg, rgba(28,28,28,0.92) 0%, rgba(20,20,20,0.95) 100%)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid #262626',
                    backgroundImage: 'none'
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderColor: '#262626',
                    color: '#fafafa'
                }
            }
        },
        MuiRating: {
            styleOverrides: {
                iconFilled: { color: '#ff3b3b' },
                iconHover: { color: '#ff5757' }
            }
        }
    }
});

export default theme;