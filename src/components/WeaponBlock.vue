<template>
  <div class="row-stretch weapon" style="flex-grow: 0">
    <div class="weapon-label">{{ weapon.name }}</div>
    <div class="column">
      <div class="row-stretch">
        <div class="line" style="flex-grow: 0.5">
          <div class="underlined weapon-info">{{ weapon.attack }}</div>
          <div class="labello">Attack</div>
        </div>
        <div class="line">
          <div class="underlined weapon-info">
            {{ weapon.damage }}
          </div>
          <div class="labello">Damage</div>
        </div>
        <div class="line" style="flex-grow: 0.5">
          <div class="underlined weapon-info">{{ weapon.hands }}</div>
          <div class="labello">Hands</div>
        </div>
        <div class="line" v-if="weapon.range">
          <div class="underlined weapon-info">{{ weapon.range }} ft.</div>
          <div class="labello">Range</div>
        </div>
        <div class="line" v-if="weapon.reload">
          <div class="underlined weapon-info">{{ weapon.reload }}</div>
          <div class="labello">Reload</div>
        </div>
        <div class="line">
          <div class="underlined weapon-traits bounded-line" data-max="1.6">
            {{ weapon.traits.join(', ') }}
          </div>
          <div class="labello">Traits</div>
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
