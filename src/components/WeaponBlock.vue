<template>
  <div class="row-stretch weapon" style="flex-grow: 0">
    <div class="weapon-label bounded-line" data-max="2.4">
      {{ weapon.name }}
    </div>
    <div class="column">
      <div class="row-stretch">
        <div class="line" style="flex-grow: 0.5">
          <div class="underlined weapon-info">{{ weapon.attack }}</div>
          <div class="labello compact">Attack</div>
        </div>
        <div class="line">
          <div class="underlined weapon-info bounded-line" data-max="1.8">
            {{ weapon.damage }}
          </div>
          <div class="labello compact">Damage</div>
        </div>
        <div class="line" style="flex-grow: 0.5">
          <div class="underlined weapon-info">{{ weapon.hands }}</div>
          <div class="labello compact">Hands</div>
        </div>
        <div class="line" v-if="weapon.range">
          <div class="underlined weapon-info">{{ weapon.range }} ft.</div>
          <div class="labello compact">Range</div>
        </div>
        <div class="line" v-if="weapon.reload">
          <div class="underlined weapon-info">{{ weapon.reload }}</div>
          <div class="labello compact">Reload</div>
        </div>
        <div class="line">
          <div
            class="underlined weapon-traits bounded-line second-pass"
            data-max="1.5"
          >
            {{ weapon.traits.map((t) => t.name).join(', ') }}
          </div>
          <div class="labello compact">Traits</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Weapon } from 'src/character/model';

defineProps<{
  weapon: Weapon;
}>();
</script>
