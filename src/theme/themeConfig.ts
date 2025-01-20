import { theme, type ThemeConfig } from 'antd';

const myTheme: ThemeConfig = {
  token: {
    fontSize: 14,
    colorPrimary: '#c9a86b',
    colorTextBase: '#ffffff',
    colorBgBase: '#1c1c1e',
  },

  components: {
    Table: {},
    Segmented: {
      itemSelectedBg: '#c9a86b',
      trackBg: '#282828',
    },
  },

  algorithm: theme.darkAlgorithm,
};

export default myTheme;
