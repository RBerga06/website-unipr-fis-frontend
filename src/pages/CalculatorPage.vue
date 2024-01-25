<script setup lang="ts">
import { mdiDelete, mdiPlus } from '@mdi/js'
import { onUnmounted } from 'vue'
import { onMounted } from 'vue'
import { computed } from 'vue'
import { ref } from 'vue'

const data = ref<{ id: number; title: string; value: number; weight: number }[]>([
  { id: 0, title: 'Title 1', value: 28, weight: 3 }
])

const result = computed(() => {
  if (data.value.length == 0) return 0
  return (
    data.value
      .map((item) => item.value * item.weight)
      .reduce((total, value) => +total + +value, 0) /
    data.value.map((item) => item.weight).reduce((total, value) => +total + +value, 0)
  )
})

function newItem() {
  const length = data.value.length
  data.value.push({ id: length, title: '', value: 18, weight: 3 })
}

function delItem(id: number) {
  const index = data.value.findIndex((x) => x.id == id)
  if (index > -1) {
    data.value.splice(index, 1)
  }
}

const screenDimensions = ref({ width: window.innerWidth, height: window.innerHeight })
function onResize() {
  screenDimensions.value.width = window.innerWidth
  screenDimensions.value.height = window.innerHeight
}
onMounted(async () => {
  window.addEventListener('resize', onResize)
})
onUnmounted(async () => {
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <v-col flex class="pa-0">
    <div class="text-h4 text-center pa-3">Weighted Mean Calculator</div>
    <v-divider></v-divider>
    <v-container fluid class="fill-height"><v-spacer></v-spacer></v-container>
    <v-list
      flex
      class="pa-2 bg-transparent overflow-y-auto"
      :max-height="screenDimensions.height - 280"
    >
      <template v-for="item in data" :key="item.id">
        <v-card elevation="3">
          <v-container fluid class="py-0">
            <v-row>
              <v-col>
                <v-text-field
                  v-model="item.title"
                  variant="underlined"
                  label="Esame"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="item.value"
                  type="number"
                  min="0"
                  max="30"
                  variant="underlined"
                  label="Valutazione"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="item.weight"
                  type="number"
                  min="0"
                  variant="underlined"
                  label="CFU"
                ></v-text-field>
              </v-col>
              <v-col cols="1">
                <v-btn
                  @click="delItem(item.id)"
                  class="ma-2"
                  variant="text"
                  :icon="mdiDelete"
                  color="error"
                ></v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <v-container fluid class="fill-height"><v-spacer></v-spacer></v-container>
      </template>
    </v-list>
    <v-divider></v-divider>
    <v-container fluid class="fill-height">
      <v-row>
        <v-col><v-spacer></v-spacer></v-col>
        <v-col cols="1">
          <v-btn @click="newItem" :icon="mdiPlus" color="primary"></v-btn>
        </v-col>
        <v-col cols="1">
          <div class="text-h4 text-center">
            {{ Math.round(result * 100) / 100 }}
          </div>
        </v-col>
        <v-col><v-spacer></v-spacer></v-col>
      </v-row>
    </v-container>
  </v-col>
</template>

<style scoped></style>
