<script setup lang="ts">
import { useBackendStore } from '@/stores/backend'
import { useRouter } from 'vue-router'

const backend = useBackendStore()
const router = useRouter()

if (backend.me === null) {
  router.push('/login')
} else {
  router.replace(`/users/@${backend.me.username}`)
}
</script>
