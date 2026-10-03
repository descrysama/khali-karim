# Site immobilier — Altayssir (Tunisie)

Site vitrine d'agence immobilière : consultation d'annonces (vente / location), pas de compte utilisateur, pas d'espace propriétaire. Lead = appel téléphonique à l'agence.

## Stack

- **Next.js** (App Router, TypeScript) — Server Components par défaut, `"use client"` seulement pour l'interactif (filtres, carrousel, modal).
- **TanStack Query** pour tout le data-fetching client : listing paginé (`useInfiniteQuery`), fiche bien, biens similaires. `queryKey` = `["listings", filters]`.
- **Tailwind CSS + shadcn/ui** pour l'UI. Aucun CSS ad hoc si un composant shadcn existe.

## Code couleur — à respecter strictement

| Rôle | Valeur |
|---|---|
| Primaire / accent | `#002D45` |
| Primaire hover | `#0B4466` |
| Fond sombre (hero, lightbox) | `#001A29` |
| Texte principal | `#10202B` |
| Texte secondaire | `#3B4A55` |
| Texte tertiaire / labels | `#5E6D78` |
| Texte discret | `#8A98A2` |
| Bordures | `#E6ECF0` |
| Bordures inputs | `#D8E1E7` |
| Fond neutre / placeholder | `#F1F5F8` |
| Surface | `#FFFFFF` |

À déclarer en variables CSS shadcn (`--primary`, `--border`, `--muted-foreground`…) dans `globals.css`, jamais de hex en dur dans les composants — toujours `bg-primary`, `text-muted-foreground`, etc.

## Conventions UI

- Typo : **DM Sans** (texte), **DM Mono** (labels, compteurs, réfs, mentions légales — uppercase, letter-spacing ~0.14em, 10–11px).
- Boutons et filtres : pilules (`rounded-full`). Cartes et modals : `rounded-2xl`.
- Segmented control Vente/Location : conteneur blanc, item actif `bg-primary text-white`, item inactif blanc.
- Filtres = `Popover` shadcn avec coche sur l'option active (pas de `<select>` natif). Bouton « Tous les filtres » avec badge compteur → `Dialog` contenant cartes de type, groupes de chips, `Switch` pour Extérieur / Ascenseur.
- Carrousel fiche : `Dialog` plein écran, fond `rgba(0,0,0,0.82)` sans blur, flèches rondes 40px, bande de miniatures, navigation clavier ←/→ et Échap.
- Cartes d'annonce sans bordure ni ombre : photo `rounded-2xl` puis texte en dessous.

## Modèle de données (bien)

`id, type, kindLabel, transaction (vente|location), city, gov, zone, surface, rooms, bedrooms, price, exterior, elevator, floor, floorTotal, photos[], isNew, year, charges`

Filtres supportés : localisation (texte + gouvernorat), transaction, type, budget max, pièces min, surface min, extérieur, ascenseur. Tri : récent, prix ↑/↓, surface ↓.

## Règles métier

- Prix en **DT**, formatés avec espace fine (`1 200 000 DT`), location suffixée `/ mois`.
- **Terrain** : vente uniquement, pas d'étage/ascenseur/chambres.
- **Parking** : pas de pièces.
- **Immeuble** : les « pièces » s'affichent comme *lots* ; **Local commercial** : *espaces*. Pas de « chambres » hors résidentiel.
- Gouvernorats couverts : Tunis, Ariana, Ben Arous, Nabeul, Sousse, Monastir, Sfax, Médenine.

## Contenu

Textes en français. Photos = images réelles par type de bien ; les terrains restent en placeholder tant que l'agence n'a pas fourni ses visuels. Pas d'emoji.
