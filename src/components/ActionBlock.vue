<template>
  <div class="row-stretch action" style="flex-grow: 0">
    <div class="action-icon">
      {{ action.cost }}
    </div>
    <div class="action-label">{{ action.name }}</div>
    <div class="column-wrap action-details">
      <div class="line" v-if="action.traits">
        <div class="underlined">
          <template v-for="(trait, index) in action.traits">
            {{ trait
            }}<template v-if="action.traits.length - 1 > index">, </template>
          </template>
        </div>
        <div class="label">Traits</div>
      </div>
      <div class="line" v-if="action.cost == Action.Reaction">
        <div class="underlined">
          {{ action.trigger }}
        </div>
        <div class="label">Trigger</div>
      </div>
      <div class="line" v-if="action.frequency">
        <div class="underlined">
          {{ action.frequency }}
        </div>
        <div class="label">Frequency</div>
      </div>
      <div class="line" v-if="action.requirements">
        <div class="underlined">
          {{ action.requirements }}
        </div>
        <div class="label">Requirements</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ability, Action } from 'src/character/model';

defineProps<{
  action: Ability;
}>();
</script>
