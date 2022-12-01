import { extendTheme } from "@chakra-ui/react";
import { withKnobs } from "@storybook/addon-knobs";
import { addDecorator } from "@storybook/react";

export const theme = extendTheme({
  fonts: {
    body: "Inter, system-ui, sans-serif",
    heading: "Work Sans, system-ui, sans-serif",
  },
  colors: {
    primary: {
      "50": "#e5e7f9",
      "100": "#bec4ef",
      "200": "#929ce4",
      "300": "#6674d9",
      "400": "#4657d1",
      "500": "#2539c9",
      "600": "#2133c3",
      "700": "#1b2cbc",
      "800": "#1624b5",
      "900": "#0d17a9",
    },
  },
  breakPoints: {
    sm: "360px",
    md: "414px",
    lg: "768px",
    // lg: "85em",
    // xl: "96em",
  },
  shadows: {
    largeSoft: "rgba(60, 64, 67, 0.15) 0px 2px 10px 6px;",
  },
  styles: {
    global: {
      "html, #__next": {
        height: "100%",
      },
      "#__next": {
        display: "flex",
        flexDirection: "column",
      },
      ".body": {
        // todo check how to do this without breaking the site
        // height: '100%', // Push footer to bottom
        overflowY: "scroll", // Always show scrollbar to avoid flickering
      },
      html: {
        scrollBehavior: "smooth",
      },
      "#nprogress": {
        pointerEvents: "none",
      },
      "#nprogress .bar": {
        background: "green.200",
        position: "fixed",
        zIndex: "1031",
        top: 0,
        left: 0,
        width: "100%",
        height: "2px",
      },
    },
  },
});

export const parameters = {
  chakra: {
    theme,
  },
  viewport: {
    //👇 https://gs.statcounter.com/screen-resolution-stats
    viewports: {
      "mobile-sm": {
        name: "mobile(sm)",
        styles: {
          width: "360px",
          height: "800px",
        },
      },
      "mobile-lg": {
        name: "mobile(lg)",
        styles: {
          width: "414px",
          height: "896px",
        },
      },
      table: {
        name: "table",
        styles: {
          width: "768px",
          height: "1024px",
        },
      },
      // "desktop-sm": {
      //   name: "desktop(sm)",
      //   styles: {
      //     width: "1366px",
      //     height: "768px",
      //   },
      // },
      // "desktop-md": {
      //   name: "desktop(md)",
      //   styles: {
      //     width: "1536px",
      //     height: "964px",
      //   },
      // },
    },
  },
};

addDecorator(withKnobs);
