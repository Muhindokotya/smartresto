<script setup>
// PAGE PROVISOIRE. Propriétaire : Tresor (module Plats). Remplacez ce fichier.
useHead({ title: 'Plats' })
</script>

<template>
  <section>
    <h1 class="text-3xl font-bold">Plats</h1>
    <p class="mt-2 text-gris">Page provisoire (Tresor) : la liste des plats s'affichera ici.</p>
  </section>
</template>




<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Gestion des Plats</h1>
      <NuxtLink to="/plats/nouveau" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        + Nouveau Plat
      </NuxtLink>
    </div>

    <!-- Barre de recherche et filtres -->
    <div class="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-lg">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par nom..."
        class="border p-2 rounded w-full md:w-1/3"
      />

      <select v-model="selectedCategory" class="border p-2 rounded w-full md:w-1/3">
        <option value="">Toutes les catégories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.nom }}
        </option>
      </select>

      <label class="flex items-center gap-2 cursor-pointer">
        <input v-model="onlyAvailable" type="checkbox" class="rounded" />
        <span>Disponibles seulement</span>
      </label>
    </div>

    <!-- Rendu conditionnel : chargement, erreur, liste vide -->
    <div v-if="pending" class="text-center py-8">Chargement des plats...</div>
    <div v-else-if="error" class="text-red-500 text-center py-8">Erreur de chargement des données.</div>
    <div v-else-if="filteredPlats.length === 0" class="text-gray-500 text-center py-8">Aucun plat trouvé.</div>

    <!-- Cartes des plats -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="plat in filteredPlats" :key="plat.id" class="border rounded-xl p-4 shadow-sm bg-white space-y-3">
        <img :src="plat.imageUrl || '/placeholder.png'" :alt="plat.nom" class="h-40 w-full object-cover rounded-md" />
        
        <div class="flex justify-between items-start">
          <h2 class="font-semibold text-lg">{{ plat.nom }}</h2>
          <span class="text-blue-600 font-bold">{{ formaterPrix(plat.prix) }}</span>
        </div>

        <p class="text-gray-600 text-sm line-clamp-2">{{ plat.description }}</p>

        <div class="flex justify-between items-center pt-2 border-t">
          <button
            @click="toggleDisponibilite(plat)"
            :class="plat.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            class="px-3 py-1 rounded-full text-xs font-semibold"
          >
            {{ plat.disponible ? 'Disponible' : 'Indisponible' }}
          </button>

          <div class="flex gap-2">
            <NuxtLink :to="`/plats/${plat.id}`" class="text-gray-600 hover:text-blue-600 text-sm">
              Éditer
            </NuxtLink>
            <button @click="handleDelete(plat.id)" class="text-red-600 hover:text-red-800 text-sm">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formaterPrix } from '~/utils/format' // Utilitaire du socle

const { getPlats, updatePlat, deletePlat } = usePlats()
const { data: categories } = await useFetch('/api/categories')

const searchQuery = ref('')
const selectedCategory = ref('')
const onlyAvailable = ref(false)

const { data: plats, pending, error, refresh } = await useAsyncData('plats', () => getPlats())

// Filtrage combiné (Computed)
const filteredPlats = computed(() => {
  if (!plats.value) return []
  return plats.value.filter(plat => {
    const matchesSearch = plat.nom.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || plat.categorieId === Number(selectedCategory.value)
    const matchesAvailability = !onlyAvailable.value || plat.disponible
    return matchesSearch && matchesCategory && matchesAvailability
  })
})

// Bascule rapide de disponibilité
const toggleDisponibilite = async (plat) => {
  try {
    await updatePlat(plat.id, { disponible: !plat.disponible })
    plat.disponible = !plat.disponible
  } catch (err) {
    alert('Erreur lors de la modification.')
  }
}

// Handler de suppression sécurisé
const handleDelete = async (id) => {
  if (!confirm('Voulez-vous vraiment supprimer ce plat ?')) return
  try {
    const res = await deletePlat(id)
    alert(res.message)
    refresh()
  } catch (err) {
    alert('Une erreur est survenue.')
  }
}
</script>
