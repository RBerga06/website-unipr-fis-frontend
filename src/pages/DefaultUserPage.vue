<script setup lang="ts">
import { useBackendStore, type User } from '@/stores/backend'
import { useRouter } from 'vue-router'

const backend = useBackendStore()
const router = useRouter()

if (backend.me !== null) {
  router.replace(`/users/@${backend.me.username}`)
}
</script>
