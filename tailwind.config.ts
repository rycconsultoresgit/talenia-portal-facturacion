import { heroui } from "@heroui/react";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#634DAE99",
        darkPurple: "#251D3F",
        purple: "#442F8D",
        pressedPurple: "#302360",
        taleniaBlue: "#6DA7FF",
        lightPurple: "#E9E3FF",
        primaryBlue: "#372AAC",
        customPurple: "#947CE7",

        cardBackground: "#F3EFFF",
        cardText: "#4A4A4A",

        drawerPrimary: "#EAE4FF",
        drawerLightGray: "#776D9D",
        drawerDarkPurple: "#2F2943",

        lightPurple2: "#886CE8",
        lightGray: "#645790",

        divider: "#A89AD7",
        dividerLight: "#FFFF",

        activeTab: "#CBC0F2",
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(90.62deg, #384DF6 0.53%, #987EE6 152.71%)",
      },
    },
  },
  plugins: [heroui()],
};
