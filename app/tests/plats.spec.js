import { describe, it, expect } from 'vitest'

function validerPrix(prix) {
  return typeof prix === 'number' && prix > 0
}

function filtrerPlats(plats, recherche, categorieId) {
  return plats.filter(p => {
    const matchNom = p.nom.toLowerCase().includes(recherche.toLowerCase())
    const matchCat = !categorieId || p.categorieId === categorieId
    return matchNom && matchCat
  })
}

describe('Tests du module Plats (Trésor)', () => {
  it('doit valider que le prix est strictement positif', () => {
    expect(validerPrix(10)).toBe(true)
    expect(validerPrix(0)).toBe(false)
    expect(validerPrix(-2)).toBe(false)
  })

  it('doit filtrer la liste selon le nom et la catégorie', () => {
    const mockPlats = [
      { id: 1, nom: 'Pizza', categorieId: 1 },
      { id: 2, nom: 'Jus', categorieId: 2 }
    ]
    const resultat = filtrerPlats(mockPlats, 'Pizza', 1)
    expect(resultat).toHaveLength(1)
    expect(resultat[0].nom).toBe('Pizza')
  })
})