<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow space-y-4">
    <h1 class="text-xl font-bold">Modifier le plat</h1>

    <div v-if="pending">Chargement...</div>
    <form v-else @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block text-sm font-medium">Nom du plat *</label>
        <input v-model="form.nom" type="text" required class="border p-2 w-full rounded" />
      </div>

      <div>
        <label class="block text-sm font-medium">Catégorie *</label>
        <select v-model.number="form.categorieId" required class="border p-2 w-full rounded">
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.nom }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium">Prix ($ USD) *</label>
        <input v-model.number="form.prix" type="number" step="0.01" min="0.01" required class="border p-2 w-full rounded" />
      </div>

      <div>
        <label class="block text-sm font-medium">Temps de préparation (min) *</label>
        <input v-model.number="form.tempsPreparationMin" type="number" min="1" required class="border p-2 w-full rounded" />
      </div>

      <div>
        <label class="block text-sm font-medium">Description</label>
        <textarea v-model="form.description" class="border p-2 w-full rounded" rows="3"></textarea>
      </div>

      <div class="flex gap-4 pt-4">
        <button type="submit" :disabled="loading" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Enregistrer les modifications
        </button>
        <NuxtLink to="/plats" class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Annuler</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { getPlatById, updatePlat } = usePlats()

const { data: categories } = await useFetch('/api/categories')
const { data: plat, pending } = await useAsyncData(`plat-${route.params.id}`, () => getPlatById(route.params.id))

const loading = ref(false)
const form = ref({ ...plat.value })

const submitForm = async () => {
  if (form.value.prix <= 0) {
    alert('Le prix doit être supérieur à 0.')
    return
  }

  loading.value = true
  try {
    await updatePlat(route.params.id, form.value)
    router.push('/plats')
  } catch (err) {
    alert('Erreur lors de la mise à jour.')
  } finally {
    loading.value = false
  }
}
</script>