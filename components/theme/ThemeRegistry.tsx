"use client";

import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import createEmotionServer from "@emotion/server/create-instance";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode } from "react";

const cache = createCache({ key: "css", prepend: true });
cache.compat = true;

const { extractCriticalToChunks, constructStyleTagsFromChunks } =
  createEmotionServer(cache);

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#fdc936",
    },
    secondary: {
      main: "#c0e3e5",
    },
    text: {
      primary: "#322625",
    },
    background: {
      default: "#ebebeb",
    },
  },
  typography: {
    fontFamily: '"Neutra Text", sans-serif',
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          color: "#fdc936",
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fdc936",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fdc936",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "#fdc936",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ebebeb !important",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fdc936 !important",
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "#ebebeb",
          "&.Mui-selected": {
            backgroundColor: "#fdc936",
            color: "#322625",
          },
          "&:hover": {
            backgroundColor: "#c0e3e5",
            color: "#322625",
          },
        },
      },
    },

    MuiTableContainer: {
      styleOverrides: {
        root: {
          mt: 2,
          backgroundColor: "#231d1d",
          backgroundImage: "none",
          boxShadow: "none",
          border: "1px solid #5f6368",
          borderRadius: "10px",
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#211b1b",
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          color: "#ebebeb",
        },
      },
    },

    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: "#534241",
        },
      },
    },

    MuiPagination: {
      styleOverrides: {
        root: {
          color: "#ebebeb",
          "& .MuiButtonBase-root": {
            color: "#ebebeb",
          },
          "& .MuiPaginationItem-root":{
            color: "#ebebeb",
          }
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  useServerInsertedHTML(() => {
    const emotionChunks = extractCriticalToChunks(children as string);
    const styles = constructStyleTagsFromChunks(emotionChunks);
    return (
      <style
        data-emotion={`css ${cache.key}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
