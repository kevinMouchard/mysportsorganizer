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
    }
  }
});

export default ThemePreset;
