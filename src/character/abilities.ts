import { Ability } from './model';
import { AbilityType, Action, Source, Trait } from './model';
import * as Wanderer from './wanderers-requests';
import * as Util from './util';
import { capitalize } from 'vue';
import type vm from 'node:vm';

export default class Abilities extends Array<Ability> {
  conditionals: string[] = [];
  excluded: Ability[] = [];

  /* eslint-disable @typescript-eslint/no-explicit-any */
  loadRemaster(feats_features: any, selections: any, context: vm.Context) {
    const type: { [id: number]: AbilityType } = {};
    for (const [key, value] of Object.entries(selections)) {
      const id = value as number;
      if (key.startsWith('ancestry-section')) {
        type[id] = AbilityType.AncestryFeat;
      }
    }
    feats_features.otherFeats.forEach((feature: any) =>
      this.loadFeat(
        feature,
        type[feature.id] ?? AbilityType.ClassFeature,
        context,
      ),
    );
    feats_features.ancestryFeats.forEach((feature: any) =>
      this.loadFeat(feature, AbilityType.AncestryFeat, context),
    );
    feats_features.heritages.forEach((feature: any) =>
      this.loadFeat(feature, AbilityType.AncestryFeat, context),
    );
    feats_features.generalAndSkillFeats.forEach((feature: any) =>
      this.loadFeat(feature, AbilityType.GeneralFeat, context),
    );
    feats_features.classFeats.forEach((feature: any) =>
      this.loadFeat(feature, AbilityType.ClassFeat, context),
    );
    feats_features.classFeatures.forEach((feature: any) =>
      this.loadFeat(feature, AbilityType.ClassFeature, context),
    );
    this.sort((a, b) => b.level - a.level);
  }

  loadFeat(feature: any, type: AbilityType, context: vm.Context) {
    const feat = new Ability(
      feature.name ?? '',
      feature.id ?? -1,
      feature.level ?? -1,
      type,
      feature.actions != null,
      Source.bank.get(feature.content_source_id),
      Trait.bank.map(feature.traits),
      feature.description,
      context,
    );
    if (
      type == AbilityType.GeneralFeat &&
      feature.traits &&
      feature.traits.includes(1438)
    )
      feat.type = AbilityType.SkillFeat;
    if (feat.activity) {
      feat.cost = Util.getActions(feature.actions);
      feat.frequency = feature.frequency;
      feat.requirements = feature.requirements;
      feat.trigger = feature.trigger;
    }
    // TODO: Conditionals
    let exclude = 0;
    if (
      feat.description.match(/You gain your \w+('|&#39;)s [\w ]+<\/p>$/gi) ||
      feat.name.startsWith('Spell Repertoire') ||
      feat.name.startsWith('Signature Spells')
    )
      exclude++;
    for (const entry of feature.operations ?? []) {
      if (
        ['ABILITY_BLOCK', 'SPELL'].includes(entry?.data?.optionType) ||
        [
          'giveAbilityBlock',
          'giveSpellSlot',
          'adjValue',
          'addBonusToValue',
          'giveSpell',
        ].includes(entry.type)
      ) {
        exclude++;
      }
      if (
        entry.type == 'injectText' ||
        entry.data?.trueOperations?.some(
          (entry: any) => entry.type == 'injectText',
        )
      ) {
        exclude -= feature.operations.length;
      }
    }
    const substringExceptions = ['In addition', 'Enhancement'];
    if (
      exclude > 0 &&
      !substringExceptions.some((s) => feat.description.includes(s))
    )
      this.excluded.push(feat);
    else this.push(feat);
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  loadLegacy(data: any, metaData: any, level: number): Promise<void>[] {
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
              feature.code as string,
            ) ||
            (feature.code as string).includes('SET-SPELL-SLOTS') ||
            (feature.name as string) == 'Spell Repertoire'
          )
            continue;

          const feat = new Ability(
            feature.name ?? '',
            feature.id ?? -1,
            feature.level ?? -1,
            AbilityType.ClassFeature,
            false,
            Source.bank.dummy(Util.makeSource(feature.contentSrc)),
            [],
            feature.description,
          );
          feat.code = feature.code ?? '';
          if (feat.code) this.checkConditionals(feat.code);
          this.push(feat);
        }
      }),
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
        const feat = new Ability(
          entry.value?.name ?? '',
          entry.value?.id ?? -1,
          entry.sourceLevel ?? -1,
          type,
          cost != Action.None,
          Source.None,
          [],
          entry.value?.description,
        );
        feat.cost = cost;
        feat.frequency = entry.value?.frequency;
        feat.requirements = entry.value?.requirements;
        feat.trigger = entry.value?.trigger;
        feat.code = entry.value?.code ?? '';
        promises.push(Wanderer.loadFeat(feat));
        if (feat.code) this.checkConditionals(feat.code);
        this.push(feat);
      }
    }
    promises.push(
      Promise.all(promises).then(() => {
        this.sort((a, b) => b.level - a.level);
      }),
    );
    return promises;
  }

  private checkConditionals(code: string) {
    // GIVE-PROF-IN=Intimidation:T\nGIVE-FEAT-NAME=Intimidating Glare\nCONDITIONAL-INCREASE-SKILL_Deception=2~circumstance bonus to Impersonate when pretending to be a tiefling
    for (const line of code.split('\n')) {
      const equals = line.indexOf('=');
      if (equals == -1) continue;
      const key = line.substring(0, equals);
      const subkey = line.substring(0, key.indexOf('_'));
      const subvalue = key.substring(key.indexOf('_') + 1);
      const value = line.substring(equals + 1);

      switch (subkey) {
        case 'CONDITIONAL-INCREASE-SKILL': {
          this.conditionals.push(
            value
              .replaceAll(
                /(\d+)~(\w+) bonus/gi,
                `+$1 $2 to ${capitalize(subvalue.toLowerCase())}`,
              )
              .replaceAll('circumstance', 'circ.'),
          );
          break;
        }
      }
    }
  }
}
