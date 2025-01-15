import { theme, type ThemeConfig } from 'antd';

const myTheme: ThemeConfig = {
  token: {
    fontSize: 16,
    colorPrimary: '#c9a86b',
    colorTextBase: '#ffffff',
    colorBgBase: '#000000',
  },

  components: {
    Segmented: {
      itemSelectedBg: '#c9a86b',
      trackBg: '#282828',
    },
  },

  algorithm: theme.darkAlgorithm,
};

export default myTheme;
