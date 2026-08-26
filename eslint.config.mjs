import next from "eslint-config-next";

const config = [
  ...next,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "@next/next/no-html-link-for-pages": "off"
    }
  }
];

export default config;
