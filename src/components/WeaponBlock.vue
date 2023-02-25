<template>
  <div class="row-stretch weapon" style="flex-grow: 0">
    <div class="weapon-label">{{ weapon.name }}</div>
    <div class="column">
      <div class="row-stretch">
        <div class="line" style="flex-grow: 0.5">
          <div class="underlined weapon-info">{{ weapon.attack }}</div>
          <div class="label">Attack</div>
        </div>
        <div class="line">
          <div class="underlined weapon-info">
            {{ weapon.damage }}
          </div>
          <div class="label">Damage</div>
        </div>
        <div class="line" style="flex-grow: 0.5">
          <div class="underlined weapon-info"><!--TODO: Hands--></div>
          <div class="label">Hands</div>
        </div>
        <div class="line" v-if="false">
          <div class="underlined weapon-info">
            <!--TODO: Range-->
            ft.
          </div>
          <div class="label">Range</div>
        </div>
        <div class="line">
          <div class="underlined weapon-traits">
            <!--TODO: Traits-->
          </div>
          <div class="label">Traits</div>
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
