import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const ThemePreset = definePreset(Aura, {
  components: {
    menubar: {
      root: {
        background: '#292929',
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
    },
    datatable: {
      header: {
        color: '#6c4b4b',
      },
      headerCell: {
        background: '#34d399',
      }
    }
  }
});

export default ThemePreset;
