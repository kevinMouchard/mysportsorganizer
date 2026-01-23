import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const ThemePreset = definePreset(Aura, {
  components: {
    menubar: {
      root: {
        background: '#4d4d4d',
        borderColor: 'none'
      }
    },
    card: {
      root: {
        background: '#4d4d4d'
      }
    },
    accordion: {
      panel: {
        // borderColor: '#c3c141'
      },
      header: {
        background: '#897f41',
        activeBackground: '#897f41'
      }
    }
  }
});

export default ThemePreset;
