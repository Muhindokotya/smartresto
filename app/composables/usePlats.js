export function usePlats() {
  const { $fetchApi } = useNuxtApp() // ou votre composable useApi du socle

  // Récupérer tous les plats
  const getPlats = async () => {
    return await $fetchApi('/plats')
  }

  // Récupérer un plat par ID
  const getPlatById = async (id) => {
    return await $fetchApi(`/plats/${id}`)
  }

  // Créer un nouveau plat
  const createPlat = async (platData) => {
    return await $fetchApi('/plats', {
      method: 'POST',
      body: platData
    })
  }

  // Mettre à jour un plat (PATCH pour modifier partiellement, ex: disponibilité)
  const updatePlat = async (id, platData) => {
    return await $fetchApi(`/plats/${id}`, {
      method: 'PATCH',
      body: platData
    })
  }

  // Vérifier si un plat est utilisé dans des lignes de commande avant suppression
  const isPlatInUse = async (platId) => {
    const lignes = await $fetchApi(`/lignesCommande?platId=${platId}`)
    return lignes && lignes.length > 0
  }

  // Supprimer ou passer en indisponible
  const deletePlat = async (platId) => {
    const inUse = await isPlatInUse(platId)
    if (inUse) {

      await updatePlat(platId, { disponible: false })
      return { status: 'soft_deleted', message: 'Le plat ayant déjà été commandé, il a été rendu indisponible.' }
    } else {
      await $fetchApi(`/plats/${platId}`, { method: 'DELETE' })
      return { status: 'deleted', message: 'Plat supprimé avec succès.' }
    }
  }

  return {
    getPlats,
    getPlatById,
    createPlat,
    updatePlat,
    deletePlat
  }
}