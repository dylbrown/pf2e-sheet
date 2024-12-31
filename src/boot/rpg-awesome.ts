import { defineBoot } from '#q-app/wrappers';
import { IconSet } from 'quasar';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(async (/* { app, router, ... } */) => {
  IconSet.iconMapFn = (iconName) => {
    // iconName is the content of QIcon "name" prop (or related icon prop of other Quasar components)

    // can be any logic you want, but for this example:
    if (iconName.startsWith('ra-') === true) {
      return {
        cls: 'ra ' + iconName,
      };
    }

    // when we don't return anything from our iconMapFn,
    // the default Quasar icon mapping takes over
  };
});
