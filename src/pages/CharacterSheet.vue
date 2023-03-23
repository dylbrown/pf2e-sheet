<template>
  <div class="page">
    <div class="printBorder"></div>
    <div id="leftThird">
      <div class="column" style="justify-content: stretch">
        <div>PATHFINDER CHARACTER SHEET</div>
        <div class="sectionDivider">
          <hr />
        </div>
        <div class="sectionLabel" style="text-transform: uppercase">
          Ability Scores
        </div>
        <div id="ability-grid">
          <div class="line">
            <div class="inverted numBox rounded" style="font-weight: bold">
              STR
            </div>
            <div class="label invisible">A</div>
          </div>
          <div class="line">
            <div class="underlined-roll">
              {{ abilityMod(character.scores[Score.Strength]) }}
            </div>
            <div class="label">Mod</div>
          </div>
          <div class="line">
            <div class="numBox rounded">
              {{ character.scores[Score.Strength] }}
            </div>
            <div class="label">Score</div>
          </div>
          <div class="line">
            <div class="inverted numBox rounded" style="font-weight: bold">
              INT
            </div>
            <div class="label invisible">A</div>
          </div>
          <div class="line">
            <div class="underlined-roll">
              {{ abilityMod(character.scores[Score.Intelligence]) }}
            </div>
            <div class="label">Mod</div>
          </div>
          <div class="line">
            <div class="numBox rounded">
              {{ character.scores[Score.Intelligence] }}
            </div>
            <div class="label">Score</div>
          </div>
          <div class="line">
            <div class="inverted numBox rounded" style="font-weight: bold">
              DEX
            </div>
            <div class="label invisible">A</div>
          </div>
          <div class="line">
            <div class="underlined-roll">
              {{ abilityMod(character.scores[Score.Dexterity]) }}
            </div>
            <div class="label">Mod</div>
          </div>
          <div class="line">
            <div class="numBox rounded">
              {{ character.scores[Score.Dexterity] }}
            </div>
            <div class="label">Score</div>
          </div>
          <div class="line">
            <div class="inverted numBox rounded" style="font-weight: bold">
              WIS
            </div>
            <div class="label invisible">A</div>
          </div>
          <div class="line">
            <div class="underlined-roll">
              {{ abilityMod(character.scores[Score.Wisdom]) }}
            </div>
            <div class="label">Mod</div>
          </div>
          <div class="line">
            <div class="numBox rounded">
              {{ character.scores[Score.Wisdom] }}
            </div>
            <div class="label">Score</div>
          </div>
          <div class="line">
            <div class="inverted numBox rounded" style="font-weight: bold">
              CON
            </div>
            <div class="label invisible">A</div>
          </div>
          <div class="line">
            <div class="underlined-roll">
              {{ abilityMod(character.scores[Score.Constitution]) }}
            </div>
            <div class="label">Mod</div>
          </div>
          <div class="line">
            <div class="numBox rounded">
              {{ character.scores[Score.Constitution] }}
            </div>
            <div class="label">Score</div>
          </div>
          <div class="line">
            <div class="inverted numBox rounded" style="font-weight: bold">
              CHA
            </div>
            <div class="label invisible">A</div>
          </div>
          <div class="line">
            <div class="underlined-roll">
              {{ abilityMod(character.scores[Score.Charisma]) }}
            </div>
            <div class="label">Mod</div>
          </div>
          <div class="line">
            <div class="numBox rounded">
              {{ character.scores[Score.Charisma] }}
            </div>
            <div class="label">Score</div>
          </div>
        </div>
        <div class="sectionDivider">
          <hr />
        </div>
        <div class="sectionLabel">Misc.</div>
        <div class="row-between">
          <div class="line">
            <div class="numBox rounded">{{ character.speed }} ft.</div>
            <div class="label">Speed</div>
          </div>
          <div class="line">
            <div class="numBox rounded">
              {{ character.classDC }}
            </div>
            <div class="label">Class DC</div>
          </div>
          <div class="line" style="flex-grow: 0">
            <div class="hero-grid">
              <div class="hero-box"></div>
              <div class="hero-box"></div>
              <div class="hero-box"></div>
            </div>
            <div class="label">Hero Points</div>
          </div>
        </div>
        <div class="sectionDivider">
          <hr />
        </div>
        <div class="sectionLabel">Health</div>
        <div class="row-between" style="flex-grow: 2">
          <div class="line" style="flex-grow: 0">
            <div class="numBox rounded">{{ character.hp }}</div>
            <div class="label">Max</div>
          </div>
          <div class="line">
            <div class="numBox"></div>
            <div class="label">Current</div>
          </div>
          <div class="line">
            <div class="numBox"></div>
            <div class="label">Conditions</div>
          </div>
        </div>
        <div class="sectionDivider">
          <hr />
        </div>
        <div class="sectionLabel">Armor Class</div>
        <div id="ac-grid">
          <div class="top-right rollLabel">AC</div>
          <div class="line">
            <div class="underlined-roll">{{ character.ac }}</div>
            <div class="label">Total</div>
          </div>
          <div class="line">
            <div class="numBox rounded" style="border: none">10</div>
            <div class="box-label">Base</div>
          </div>
          <div class="line">
            <div class="numBox rounded">
              {{ abilityMod(character.scores[Score.Dexterity]) }}
            </div>
            <div class="box-label">DEX</div>
          </div>
          <ProficiencyDisplay
            :proficiency="character.combat.armor.proficiency"
            :grid="true"
          />
          <div class="line">
            <div class="numBox">
              {{ nonzero(character.combat.armor.ac) }}
            </div>
            <div class="box-label">Item</div>
          </div>
          <div class="line">
            <div class="numBox dashed"></div>
            <div class="box-label">Temp</div>
          </div>
          <div class="line">
            <div class="numBox" style="border-radius: 40%">
              {{ nonzero(character.combat.shield.ac) }}
            </div>
            <div class="box-label">Shield</div>
          </div>
        </div>
        <div class="sectionDivider">
          <hr />
        </div>
        <div class="sectionLabel">Perception + Saves</div>
        <div id="rolls-grid">
          <div class="center-right rollLabel">PERCEPTION</div>
          <div class="line">
            <div class="underlined-roll">
              {{ signed(character.attributes[Attribute.Perception].total) }}
            </div>
            <div class="label">Mod</div>
          </div>
          <div class="line">
            <div class="numBox rounded">
              {{ abilityMod(character.scores[Score.Wisdom]) }}
            </div>
            <div class="label">WIS</div>
          </div>
          <ProficiencyDisplay
            :proficiency="
              character.attributes[Attribute.Perception].proficiency
            "
            :grid="true"
          />
          <div class="line">
            <div class="numBox">
              {{
                nonzero(character.attributes[Attribute.Perception].itemBonus)
              }}
            </div>
            <div class="label">Item</div>
          </div>
          <div class="line">
            <div class="numBox dashed"></div>
            <div class="label">Temp</div>
          </div>
          <div class="center-right rollLabel">FORTITUDE</div>
          <div class="line">
            <div class="underlined-roll">
              {{ signed(character.attributes[Attribute.Fortitude].total) }}
            </div>
            <div class="label">Mod</div>
          </div>
          <div class="line">
            <div class="numBox rounded">
              {{ abilityMod(character.scores[Score.Constitution]) }}
            </div>
            <div class="label">CON</div>
          </div>
          <ProficiencyDisplay
            :proficiency="character.attributes[Attribute.Fortitude].proficiency"
            :grid="true"
          />
          <div class="line">
            <div class="numBox">
              {{ nonzero(character.attributes[Attribute.Fortitude].itemBonus) }}
            </div>
            <div class="label">Item</div>
          </div>
          <div class="line">
            <div class="numBox dashed"></div>
            <div class="label">Temp</div>
          </div>
          <div class="center-right rollLabel">REFLEX</div>
          <div class="line">
            <div class="underlined-roll">
              {{ signed(character.attributes[Attribute.Reflex].total) }}
            </div>
            <div class="label">Mod</div>
          </div>
          <div class="line">
            <div class="numBox rounded">
              {{ abilityMod(character.scores[Score.Dexterity]) }}
            </div>
            <div class="label">DEX</div>
          </div>
          <ProficiencyDisplay
            :proficiency="character.attributes[Attribute.Reflex].proficiency"
            :grid="true"
          />
          <div class="line">
            <div class="numBox">
              {{ nonzero(character.attributes[Attribute.Reflex].itemBonus) }}
            </div>
            <div class="label">Item</div>
          </div>
          <div class="line">
            <div class="numBox dashed"></div>
            <div class="label">Temp</div>
          </div>
          <div class="center-right rollLabel">WILL</div>
          <div class="line">
            <div class="underlined-roll">
              {{ signed(character.attributes[Attribute.Will].total) }}
            </div>
            <div class="label">Mod</div>
          </div>
          <div class="line">
            <div class="numBox rounded">
              {{ abilityMod(character.scores[Score.Wisdom]) }}
            </div>
            <div class="label">WIS</div>
          </div>
          <ProficiencyDisplay
            :proficiency="character.attributes[Attribute.Will].proficiency"
            :grid="true"
          />
          <div class="line">
            <div class="numBox">
              {{ nonzero(character.attributes[Attribute.Will].itemBonus) }}
            </div>
            <div class="label">Item</div>
          </div>
          <div class="line">
            <div class="numBox dashed"></div>
            <div class="label">Temp</div>
          </div>
        </div>
        <div class="sectionDivider">
          <hr />
        </div>
        <div class="sectionLabel">Weapon & Armor Proficiencies</div>
        <div id="prof-grid">
          <ProficiencyDisplay
            :proficiency="
              character.attributes[Attribute.UnarmedAttacks].proficiency
            "
            :grid="false"
          />
          <ProficiencyDisplay
            :proficiency="
              character.attributes[Attribute.SimpleWeapons].proficiency
            "
            :grid="false"
          />
          <ProficiencyDisplay
            :proficiency="
              character.attributes[Attribute.MartialWeapons].proficiency
            "
            :grid="false"
          />
          <ProficiencyDisplay
            :proficiency="
              character.attributes[Attribute.AdvancedWeapons].proficiency
            "
            :grid="false"
          />
          <div class="label">Unarmed</div>
          <div class="label">Simple</div>
          <div class="label">Martial</div>
          <div class="label">Advanced</div>
          <ProficiencyDisplay
            :proficiency="
              character.attributes[Attribute.UnarmoredDefense].proficiency
            "
            :grid="false"
          />
          <ProficiencyDisplay
            :proficiency="
              character.attributes[Attribute.LightArmor].proficiency
            "
            :grid="false"
          />
          <ProficiencyDisplay
            :proficiency="
              character.attributes[Attribute.MediumArmor].proficiency
            "
            :grid="false"
          />
          <ProficiencyDisplay
            :proficiency="
              character.attributes[Attribute.HeavyArmor].proficiency
            "
            :grid="false"
          />
          <div class="label">Unarmored</div>
          <div class="label">Light</div>
          <div class="label">Medium</div>
          <div class="label">Heavy</div>
        </div>
      </div>
    </div>
    <div id="middleThird">
      <div class="column" style="justify-content: flex-start">
        <div class="sectionDivider">
          <hr />
        </div>
        <div class="sectionLabel">Character Info</div>
        <div id="info-grid">
          <div
            class="line"
            style="grid-row-end: span 2; grid-column-end: span 2"
          >
            <div class="underlined wrap">
              {{ character.name }}
            </div>
            <div class="label">Character Name</div>
          </div>
          <div class="line" style="grid-column-end: span 2; min-height: 2em">
            <div class="underlined">
              {{ character.ancestry }}
            </div>
            <div class="label">Ancestry & Heritage</div>
          </div>
          <div class="line" style="grid-column-end: span 2">
            <div class="underlined">{{ character.background }}</div>
            <div class="label">Background</div>
          </div>
          <div class="line" style="grid-column-end: span 2">
            <div class="underlined">{{ character.player }}</div>
            <div class="label">Player</div>
          </div>
          <div class="line">
            <div class="underlined">
              {{ character.class }}
            </div>
            <div class="label">Class</div>
          </div>
          <div class="line">
            <div class="underlined">{{ character.deity }}</div>
            <div class="label">Deity</div>
          </div>
          <div class="line">
            <div class="underlined">{{ character.alignment }}</div>
            <div class="label">Alignment</div>
          </div>
          <div class="line">
            <div class="underlined">{{ character.size }}</div>
            <div class="label">Size</div>
          </div>
          <div class="line" style="grid-column-end: span 2">
            <div class="underlined">
              {{ character.traits.join(', ') }}
            </div>
            <div class="label">Traits</div>
          </div>
          <div class="line" style="grid-column-end: span 2">
            <div class="underlined">
              {{ character.languages.join(', ') }}
            </div>
            <div class="label">Languages</div>
          </div>
          <div class="line" style="grid-column-end: span 2">
            <div class="underlined">
              {{ character.senses.join(', ') }}
            </div>
            <div class="label">Senses</div>
          </div>
        </div>
        <div class="sectionDivider">
          <hr />
        </div>
        <div class="sectionLabel">Strikes</div>
        <WeaponBlock
          v-for="attack in character.combat.attacks"
          :key="attack.name"
          :weapon="attack"
        />
        <div class="sectionDivider">
          <hr />
        </div>
        <div class="sectionLabel">Actions and Activities</div>
        <div class="column" style="flex-grow: 0">
          <template
            v-for="[index, ability] in Array.from(
              character.abilities.entries()
            ).filter(([_, a]) => a.activity)"
            :key="index"
          >
            <ActionBlock :action="ability" />
            <div class="action-divider" v-if="index > 0"></div>
          </template>
        </div>
        <div id="focus" v-if="character.spells.focusPoints > 0">
          <div class="line">
            <div class="numBox rounded"></div>
            <div class="label">Focus</div>
          </div>
          <div class="line">
            <div class="numBox rounded">
              {{ character.spells.focusPoints }}
            </div>
            <div class="label">Max Focus</div>
          </div>
        </div>
      </div>
    </div>
    <div id="rightThird">
      <div class="column" style="justify-content: stretch">
        <div class="sectionDivider">
          <hr />
        </div>
        <div class="sectionLabel">Skills</div>
        <div id="skills-grid">
          <div class="label">Skill</div>
          <div class="label">Total</div>
          <div class="label">Stat</div>
          <div class="label">Prof</div>
          <div class="label">Item</div>
          <template v-for="skill of skills" :key="skill">
            <div class="skill-label">{{ Attribute[skill] }}</div>
            <div class="line">
              <div class="underlined-roll">
                {{ signed(character.attributes[skill].total) }}
              </div>
            </div>
            <div style="align-self: center; text-transform: uppercase">
              {{ Score[character.attributes[skill].score].substring(0, 3) }}
            </div>
            <ProficiencyDisplay
              :grid="false"
              :proficiency="character.attributes[skill].proficiency"
            />
            <div class="line">
              <div class="numBox">
                <template v-if="character.attributes[skill].itemBonus != 0">{{
                  character.attributes[skill].itemBonus
                }}</template>
              </div>
            </div>
          </template>
          <template
            v-for="[name, lore] of Object.entries(character.lore)"
            :key="name"
          >
            <div class="skill-label lore-label">{{ name }}</div>
            <div class="line">
              <div class="underlined-roll">
                {{ signed(lore.total) }}
              </div>
            </div>
            <div style="align-self: center; text-transform: uppercase">INT</div>
            <ProficiencyDisplay :grid="false" :proficiency="lore.proficiency" />
            <div class="line">
              <div class="numBox">
                <template v-if="lore.itemBonus != 0">{{
                  lore.itemBonus
                }}</template>
              </div>
            </div></template
          >
        </div>
      </div>
    </div>
  </div>
  <div class="page">
    <div class="printBorder"></div>
    <div class="abilities-flex first-page">
      <div class="ability-box ability-section do-not-break">Class Feats</div>
      <AbilityBlock
        v-for="[index, ability] in types(
          character.abilities,
          ['class', 'classFeature'],
          []
        ).entries()"
        :key="index"
        :ability="ability"
      />
      <div class="ability-box ability-section do-not-break">
        General & Skill Feats
      </div>
      <AbilityBlock
        v-for="[index, ability] in types(
          character.abilities,
          [],
          ['ancestry', 'class', 'classFeature']
        ).entries()"
        :key="index"
        :ability="ability"
      />
      <div class="ability-box ability-section do-not-break">Ancestry Feats</div>
      <AbilityBlock
        v-for="[index, ability] in types(
          character.abilities,
          ['ancestry'],
          []
        ).entries()"
        :key="index"
        :ability="ability"
      />
      <div id="inventory-grid">
        <div class="inventory-title col-section-title">Inventory</div>
        <div class="col-section-label">#</div>
        <div class="col-section-label">Item Name</div>
        <div class="col-section-label">Wt.</div>
        <template v-for="item of character.inventory" :key="item">
          <div>{{ item.count }}</div>
          <div>{{ item.name }}</div>
          <div>{{ item.weight }}</div></template
        >
      </div>
      <template v-for="list of character.spells.lists" :key="list.name">
        <PreparedList v-if="list.type == 'Prepared'" :list="list" />
        <SpontaneousList v-if="list.type == 'Spontaneous'" :list="list" />
        <template v-for="level of list.known.slice().reverse()">
          <SpellBlock v-for="spell of level" :key="spell.name" :spell="spell" />
        </template>
      </template>
      <template v-if="character.spells.focusPoints > 0">
        <div
          style="position: absolute; width: calc(100% / 3 - 8px)"
          class="do-not-break"
        >
          <div class="spells-title col-section-title">Focus Spells</div>
        </div>
        <template
          v-for="list of character.spells.lists.filter((l) => l.type == 'None')"
          :key="list.name"
        >
          <div id="focus-rolls" class="do-not-break">
            <div class="spells-title col-section-title">{{ list.name }}</div>
            <div class="spells-stats">
              <div class="rollLabel">Spell Attack</div>
              <div class="numBox rounded">
                {{ signed(list.attack) }}
              </div>
              <div class="rollLabel">Spell DC</div>
              <div class="numBox rounded">
                {{ list.dc }}
              </div>
            </div>
          </div>
          <SpellBlock
            v-for="spell of list.focus"
            :key="spell.name"
            :spell="spell"
          />
        </template>
      </template>
    </div>
  </div>
  <div class="separator" style="top: -3px"></div>
  <div class="height_measure"></div>
</template>

<script setup lang="ts">
import { abilityMod, nonzero, signed, types } from 'src/character/util';
import Character from 'src/character/character';
import { Attribute, skills, Score } from 'src/character/model';
import AbilityBlock from 'src/components/AbilityBlock.vue';
import ActionBlock from 'src/components/ActionBlock.vue';
import ProficiencyDisplay from 'src/components/ProficiencyDisplay.vue';
import SpellBlock from 'src/components/SpellBlock.vue';
import WeaponBlock from 'src/components/WeaponBlock.vue';
import PreparedList from 'src/components/PreparedList.vue';
import SpontaneousList from 'src/components/SpontaneousList.vue';
import jQuery from 'jquery';

defineProps<{
  character: Character;
}>();

jQuery(() => {
  function checkRefresh() {
    setTimeout(function () {
      refresh();
    }, 100);
  }
  window.matchMedia('print').addEventListener('change', refresh);
  window.matchMedia('screen').addEventListener('change', refresh);
  window.addEventListener('resize', checkRefresh);

  let inventoryGrid = jQuery('#inventory-grid');
  while (true) {
    inventoryGrid.append(jQuery('<div></div><div></div><div></div>'));
    let bottomItem = inventoryGrid.children().last();
    if (!bottomItem.length) break;
    let bottom =
      bottomItem.position().top + (bottomItem.outerHeight(true) || 0);
    let height = inventoryGrid.parent().outerHeight(true) || 0;
    if (bottom > height) {
      for (let j = 0; j < 3; j++) inventoryGrid.children().last().remove();
      break;
    }
  }

  var oldTableCopy = jQuery('.abilities-flex').first().children().clone();
  var currentLeftIndex = 0;
  var currentLeft = '';
  var currentTop = 0;
  var totalHeight = 0;
  var firstPage = jQuery('.abilities-flex').first();
  var currPage = firstPage;
  var numPages = 1;
  fixRows();

  function refresh() {
    jQuery('.abilities-flex:not(:first)').remove();
    jQuery('.separator:not(:first)').remove();
    jQuery('.abilities-flex').first().empty();
    jQuery('.abilities-flex').first().append(oldTableCopy.clone());
    jQuery('.page').slice(2).remove();
    fixRows();
  }
  function moveLeft() {
    currentLeftIndex += 1;
    switch (currentLeftIndex) {
      case 1:
        currentLeft = 'calc(4px + 100% / 3)';
        break;
      case 2:
        currentLeft = 'calc(4px + 200% / 3)';
        break;
      case 3:
        currentLeftIndex = 0;
        currentLeft = '4px';
        let futurePage = jQuery(
          "<div class='page'><div class='printBorder'></div><div class='abilities-flex'></div></div>"
        ).insertAfter(currPage.parent());
        let size = Math.floor(
          parseFloat(currPage.parent().css('top').replace('px', ''))
        );
        futurePage.css(
          'top',
          'calc(' +
            size +
            'px + ' +
            jQuery('.height_measure').css('height') +
            ')'
        );
        console.log();
        currPage = futurePage.children('.abilities-flex');
        numPages += 1;
        break;
    }
  }
  function binaryHeightSearch(text: JQuery<HTMLElement>, maxHeight: number) {
    let contents = text.html();
    if (contents === null || contents === undefined) return '';
    let start = 0;
    let end = contents.length;
    while (start < end) {
      let middle = contents.indexOf(' ', Math.ceil((start + end) / 2));
      if (middle === -1) middle = end;
      text.html(contents.substring(0, middle));
      if ((text.parent().outerHeight(true) || 0) > maxHeight) {
        end = Math.ceil((start + end) / 2) - 1;
      } else {
        start = middle;
      }
    }
    text.html(contents.substring(0, start));
    if (end < contents.length) text.parent().css('border-bottom', 'none');
    return contents.substring(start);
  }
  function binaryDivHeightSearch(
    original: JQuery<HTMLElement>,
    clone: JQuery<HTMLElement>,
    maxHeight: number
  ) {
    let contents = original.children();
    if (contents === null || contents === undefined) return '';
    let start = 0;
    let end = contents.length;
    while (start < end) {
      let middle = contents.eq(Math.floor((start + end) / 2));
      if (middle.position().top + (middle.outerHeight(true) || 0) > maxHeight) {
        end = Math.floor((start + end) / 2);
      } else {
        start = Math.floor((start + end) / 2) + 1;
      }
    }
    for (let i = contents.length; i >= 0; i--) {
      if (i < start) {
        clone.children().eq(i).remove();
      } else {
        original.children().eq(i).remove();
      }
    }
    if (end < contents.length) original.addClass('no-bottom');
  }
  function fixRows() {
    firstPage = jQuery('.abilities-flex').first();
    currPage = firstPage;
    numPages = 1;
    currentTop = 0;
    currentLeft = '4px';
    currentLeftIndex = 0;
    totalHeight = firstPage.outerHeight(true) || 0;
    firstPage.children().each(function () {
      // Move to a new line if it would overflow and we don't want it to
      if (
        (jQuery(this).attr('id') === 'inventory-grid' ||
          jQuery(this).attr('id') === 'spells-prepared' ||
          jQuery(this).attr('id') === 'spells-spontaneous' ||
          jQuery(this).hasClass('do-not-break')) &&
        totalHeight - currentTop <= (jQuery(this).outerHeight(true) || 0)
      ) {
        moveLeft();
        currentTop = 0;
      }
      // Completely move to next if only small space left
      let descTop = jQuery(this).find('.ability-description');
      let infoHeight = 0;
      if (descTop != null && descTop != undefined && descTop.length > 0) {
        descTop = descTop.first();
        infoHeight = descTop.position().top;
        if (currentTop + infoHeight >= totalHeight) {
          currentTop = 0;
          moveLeft();
        }
      }
      // Place the element
      jQuery(this).css('left', currentLeft);
      jQuery(this).css('top', currentTop);
      if (currPage !== firstPage) jQuery(this).appendTo(currPage);
      currentTop += jQuery(this).outerHeight(true) || 0;

      // If overflows at all, clone remainder to next
      let curr = jQuery(this);
      while (currentTop >= totalHeight) {
        currentTop -= totalHeight;
        moveLeft();
        let clone = curr.clone();
        clone.css('left', currentLeft);
        clone.css('top', 0);
        if (
          curr.attr('id') === 'inventory-grid' ||
          curr.attr('id') === 'spells-prepared' ||
          curr.attr('id') === 'spells-spontaneous'
        ) {
          binaryDivHeightSearch(curr, clone, totalHeight - curr.position().top);
        } else {
          clone
            .children()
            .last()
            .html(
              binaryHeightSearch(descTop, totalHeight - curr.position().top)
            );
          clone.children(':not(:last-child)').remove();
        }
        clone.appendTo(currPage);
        currentTop = clone.outerHeight(true) || 0;
        curr = clone;
        descTop = curr.find('.ability-description');
      }
    });
    for (let i = 1; i <= numPages; i++) {
      jQuery('.separator')
        .last()
        .after(
          jQuery(
            "<div class='separator' style='top: calc(" +
              i +
              "00vh - 3px)'></div>"
          )
        );
    }
  }
});
</script>

<style>
@import '../css/sheet.scss';
</style>
