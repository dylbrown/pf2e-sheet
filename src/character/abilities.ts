import { Ability, AbilityType, Action } from './model';
import * as Wanderer from './wanderers-requests';
import * as Util from './util';

export default class Abilities extends Array<Ability> {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  load(data: any, metaData: any, level: number): Promise<void>[] {
    const promises: Array<Promise<void>> = [];
    /* eslint-enable @typescript-eslint/no-explicit-any */

    // Class Feats
    if (data.build.feats instanceof Array) {
      for (const entry of data.build.feats) {
        const cost: Action = Util.getActions(entry.value?.actions);
        let type = Util.getAbilityType(entry.sourceType);
        if (entry.value?.name.startsWith('Rage')) {
          type = AbilityType.ClassFeature;
        } else {
          switch (entry.value?.genericType) {
            case 'SKILL-FEAT':
              type = AbilityType.SkillFeat;
              break;
            case 'GENERAL-FEAT':
              type = AbilityType.GeneralFeat;
              break;
          }
        }
        const feat: Ability = {
          name: entry.value?.name ?? '',
          id: entry.value?.id ?? -1,
          level: entry.sourceLevel ?? -1,
          type: type,
          source: '',
          description: Util.parseDescription(entry.value?.description),
          activity: cost != Action.None,
          traits: [],
          cost: cost,
          frequency: entry.value?.frequency,
          requirements: entry.value?.requirements,
          trigger: entry.value?.trigger,
        };
        promises.push(Wanderer.loadFeat(feat));
        this.push(feat);
      }
    }
    promises.push(
      Promise.all(promises).then(() => {
        this.sort((a, b) => b.level - a.level);
      })
    );
    return promises;
  }
}
