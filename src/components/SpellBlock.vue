<template>
  <div class="spell-box">
    <div class="spell-attrs">
      <div class="spell-title">{{ spell.name }}</div>
      [#assign numBoxes = 0] [#switch spell.castTime?lower_case] [#case "one
      action"] [#case "single action"] [#assign numBoxes = 1] [#break] [#case
      "two actions"] [#assign numBoxes = 2] [#break] [#case "three actions"]
      [#assign numBoxes = 3] [#break] [/#switch] [#if numBoxes &gt; 0]
      <div class="spell-cost">
        <div
          class="[#if numBoxes &gt;= 1] spell-cost-yes[#else]spell-cost-no[/#if]"
        >
          <span>♦</span>
        </div>
        <div
          class="[#if numBoxes &gt;= 2] spell-cost-yes[#else]spell-cost-no[/#if]"
        >
          <span>♦</span>
        </div>
        <div
          class="[#if numBoxes &gt;= 3] spell-cost-yes[#else]spell-cost-no[/#if]"
        >
          <span>♦</span>
        </div>
      </div>
      [#elseif spell.castTime?lower_case?contains(" to ")] [#switch
      spell.castTime?lower_case?keep_before(" to ")] [#case "one"] [#case
      "single action"] [#assign minimumBoxes = 1] [#break] [#case "two"] [#case
      "two actions"] [#assign minimumBoxes = 2] [#break] [/#switch] [#switch
      spell.castTime?lower_case?keep_after(" to ")] [#case "two actions"]
      [#assign maximumBoxes = 2] [#break] [#case "three actions"] [#assign
      maximumBoxes = 3] [#break] [/#switch]
      <div class="spell-cost">
        <div class="spell-cost-yes">
          <span>♦</span>
        </div>
        <div
          class="spell-cost-yes[#if minimumBoxes == 1] spell-cost-optional[/#if]"
        >
          <span>♦</span>
        </div>
        <div
          class="[#if maximumBoxes == 3]spell-cost-yes spell-cost-optional[#else]spell-cost-no[/#if]"
        >
          <span>♦</span>
        </div>
      </div>
      [#else] [@linePart label="Cast Time" content=spell.castTime /] [/#if]
      [#assign components_string = ""] [#list spell.components as component]
      [#if component?is_last] [#assign components_string = components_string +
      component[0..*1]] [#else] [#assign components_string = components_string +
      component[0..*1] + ","] [/#if] [/#list] [@linePart label="Components"
      content=components_string /] [@linePart label="Source"
      content=spell.source /] [@linePart label="Traits"
      content=spell.traits?join(", ") /] [@linePart label="Requirements"
      content=spell.requirements /] [@linePart label="Range" content=spell.range
      /] [@linePart label="Area" content=spell.area /] [@linePart
      label="Targets" content=spell.targets /] [@linePart label="Duration"
      content=spell.duration /] [@linePart label="Save" content=spell.save /]
    </div>
    <div class="ability-description">${spell.description}</div>
  </div>
</template>

<script setup lang="ts">
import { Spell } from 'src/character/model';

defineProps<{
  spell: Spell;
}>();
</script>
