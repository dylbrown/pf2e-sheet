<template>
  <div v-if="!ready" id="load-box">
    <h5>Pathfinder Second Edition Character Sheet<br />for Wanderer's Guide</h5>
    <div style="flex-grow: 1; width: 100%">
      <div style="position: relative; height: 50px; flex-grow: 1">
        <q-linear-progress
          :value="progress"
          style="min-height: 50px; position: absolute"
        />
        <q-toggle
          style="
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          "
          :label="`Generating ${interactiveMode ? 'Interactive' : 'Paper'} Sheet`"
          v-model="interactiveMode"
        />
      </div>
    </div>
    <div class="row" style="gap: 8px; margin-top: 8px">
      <q-card>
        <q-card-section>
          <h6>Load a Saved Character</h6>
          <q-table
            flat
            bordered
            dense
            hide-header
            :hide-bottom="saves.length <= 4"
            v-if="saves.length > 0"
            :rows="saves"
            :rows-per-page-options="[4]"
            :columns="COLUMNS"
            row-key="filename"
          >
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
                <q-th auto-width />
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
                <q-td>
                  <q-btn
                    size="sm"
                    icon="fa-solid fa-right-to-bracket"
                    push
                    v-on:click="loadCached(props.row.filename)"
                  />
                  <q-btn
                    size="sm"
                    icon="fa-regular fa-trash-can"
                    push
                    v-on:click="confirmDelete(props.row.filename)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
      <q-card>
        <q-card-section>
          <h6>Import a New Character</h6>
          <q-file
            v-model="file"
            label="Pick a file"
            accept=".guidechar,.json"
            filled
            style="max-width: 20em; align-self: flex-start"
            :item-aligned="true"
            @update:model-value="loadNew"
          />
        </q-card-section>
      </q-card>
    </div>
  </div>
  <InteractiveSheet v-if="ready && interactiveMode" :character="character" />
  <PaperSheet v-if="ready && !interactiveMode" :character="character" />
  <q-dialog v-model="deletePopup" persistent>
    <q-card>
      <q-card-section
        class="row items-center"
        style="flex-wrap: nowrap; gap: 4px"
      >
        <q-avatar
          icon="fa-regular fa-trash-can"
          color="primary"
          text-color="white"
        />
        <span class="q-ml-sm"
          >Are you sure you want to delete this character from the cache?</span
        >
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn
          push
          label="Delete"
          color="primary"
          v-close-popup
          @click="deleteCharacter"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
#load-box {
  position: fixed;
  left: 50vw;
  transform: translateX(-50%);
  max-width: 1000px;
  width: auto;
  top: 25vh;
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: center;
}
#load-box .q-toggle__label {
  width: 19em;
}
</style>

<script setup lang="ts">
import Character from 'src/character/character';
import InteractiveSheet from 'src/pages/InteractiveSheet.vue';
import PaperSheet from 'src/pages/PaperSheet.vue';
import { Ref, ref, watch } from 'vue';
import * as LS from 'src/pages/localStorage';
import { QTableColumn } from 'quasar';
const file = ref<File | null>(null);
const ready = ref(false);
const interactiveMode = ref(LS.loadGlobalOrDefault(true, 'interactive'));
watch(interactiveMode, (val) => {
  LS.saveGlobal(val, 'interactive');
});

const COLUMNS: QTableColumn[] = [
  {
    name: 'filename',
    required: true,
    label: 'File Name',
    align: 'left',
    field: (row) => row.filename,
    sortable: true,
  },
];

const saveWorker = new Worker('src/character/character-fs.ts');
const saves: Ref<Array<{ filename: string }>> = ref([]);

navigator.storage.getDirectory().then(async (dir) => {
  for await (const key of dir.keys()) {
    saves.value.push({ filename: key });
  }
});

const progress = ref(0);
const character = new Character();

const loadCached = (filename: string) => {
  saveWorker.postMessage({ command: 'load', file: filename });
};
saveWorker.addEventListener('message', (message) => {
  if (message.data.command === 'load') {
    const data: DataView<ArrayBuffer> = message.data.file;
    const enc = new TextDecoder('utf-8');
    loadJSON(enc.decode(data));
  }
});

const deletePopup = ref(false);
const deletingFile = ref('');
const confirmDelete = (filename: string) => {
  deletingFile.value = filename;
  deletePopup.value = true;
};
const deleteCharacter = () => {
  saves.value = saves.value.filter((r) => r.filename != deletingFile.value);
  saveWorker.postMessage({ command: 'delete', file: deletingFile.value });
};

const loadNew = () => {
  if (file.value instanceof File) {
    saveWorker.postMessage({ command: 'save', file: file.value });
    const reader = new FileReader();
    reader.onload = () => loadJSON(reader.result as string);
    reader.readAsText(file.value);
  }
};

const loadJSON = (text: string) => {
  const characterFile = JSON.parse(text);
  const promises = character.load(characterFile);
  Promise.all(promises)
    .then(() => (ready.value = true))
    .catch((a) => {
      console.log(a);
    });
  for (const promise of promises) {
    promise.then(() => {
      progress.value += 1.0 / promises.length;
    });
  }
};
</script>
