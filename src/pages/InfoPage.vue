<script setup lang="ts">
import { mdiHelp, mdiInformation, mdiScriptText } from '@mdi/js'
import { useRouter } from 'vue-router'
import CodeOfConduct from '@/components/CodeOfConduct.vue'

defineProps<{ page: 'about-us' | 'code-of-conduct' | 'help' }>()

const router = useRouter()
</script>

<template>
  <v-navigation-drawer permanent rail expand-on-hover>
    <v-list nav density="compact">
      <v-list-item
        link
        :prepend-icon="mdiInformation"
        :active="page == 'about-us'"
        @click="router.push('/info/about-us')"
        >About&nbsp;Us</v-list-item
      >
      <v-list-item
        link
        :prepend-icon="mdiScriptText"
        :active="page == 'code-of-conduct'"
        @click="router.push('/info/code-of-conduct')"
        >Code&nbsp;of&nbsp;Conduct</v-list-item
      >
      <v-list-item
        link
        :prepend-icon="mdiHelp"
        :active="page == 'help'"
        @click="router.push('/info/help')"
        >Help</v-list-item
      >
    </v-list>
  </v-navigation-drawer>

  <CodeOfConduct v-if="page == 'code-of-conduct'"></CodeOfConduct>
</template>

<style scoped></style>
