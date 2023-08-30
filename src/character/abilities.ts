import { Ability, AbilityType, Action } from './model';
import * as Wanderer from './wanderers-requests';
import * as Util from './util';

export default class Abilities extends Array<Ability> {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  load(data: any, metaData: any, level: number): Promise<void>[] {
    const promises: Array<Promise<void>> = [];

    // Class Features
    promises.push(
      Wanderer.loadClass(data.character?.classID).then((player_class) => {
        const selectables: any = {};
        for (let feature of player_class.class_features) {
          if (feature.level > level) break;
          if (feature.selectType == 'SELECT_OPTION') {
            selectables[feature.id] = feature;
            continue;
          } else if (feature.selectType == 'SELECTOR') {
            for (const entry of metaData) {
              const i = entry.value.indexOf(':::');
              const key = parseInt(entry.value.substring(0, i));
              if (feature.id == key) {
                const value = parseInt(entry.value.substring(i + 3));
                if (selectables[value]) {
                  const level = feature.level;
                  feature = selectables[value];
                  feature.level = level;
                } else break;
              }
            }
          }
          // Feat Slot / Ability Boost / Free Feat / Profiency givers // Basic spell stuff
          if (
            /^(GIVE-((\w+-FEAT|ABILITY-BOOST-MULTIPLE)=\d+|FEAT-NAME=[\w ]+|PROF-IN=[\w_]+:\w|SKILL-INCREASE)\n?)+$/.test(
              feature.code as string
            ) ||
            (feature.code as string).includes('SET-SPELL-SLOTS') ||
            (feature.name as string) == 'Spell Repertoire'
          )
            continue;

          const feat: Ability = {
            name: feature.name ?? '',
            id: feature.id ?? -1,
            level: feature.level ?? -1,
            type: AbilityType.ClassFeature,
            source: Util.makeSource(feature.contentSrc),
            description: Util.parseDescription(feature.description),
            activity: false,
            traits: [],
          };
          this.push(feat);
        }
      })
    );
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
          code: entry.value?.code ?? '',
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
