# Fiche Chrome Web Store — français

Localisation française de la fiche. La fiche principale est
[`DESCRIPTION-EN.md`](DESCRIPTION-EN.md).

> Ce fichier reste en français : c'est le texte destiné aux utilisateurs francophones
> du Store, pas de la documentation projet.

## Nom de l'extension

```
Airlock — Capture & priorise
```

*(45 caractères max au Store ; ici 28)*

---

## Description courte

À coller dans le champ « Description courte ». **132 caractères maximum.**

```
Un sas entre l'impulsion et l'action. Capture l'idée qui arrive au lieu de plonger dedans. 100 % local, zéro télémétrie.
```

*(120 caractères)*

---

## Description détaillée

À coller dans le champ « Description détaillée ». 16 000 caractères maximum.

```
Tu es en train de travailler. Une idée arrive. Tu fonces dedans. Deux heures plus tard, tu réalises que tu as laissé tomber quelque chose de plus urgent.

Airlock intercale un sas entre l'impulsion et l'action.

━━━━━━━━━━━━━━━━━━━━━━━━

COMMENT ÇA MARCHE

Ctrl+Shift+Q depuis n'importe quel onglet. Tu tapes l'impulsion. Entrée.

• Si tu n'as pas de focus en cours, l'impulsion devient ton focus.
• Si tu as déjà un focus, Airlock te pose la seule question qui compte : est-ce que ça passe devant ?

Trois réponses possibles :
→ je switch — la nouvelle impulsion devient le focus, l'ancien part en file d'attente
→ file d'attente — ça attend son tour, ton focus actuel est préservé
→ laisser tomber — jeté, et c'est très bien

Quand tu termines ton focus, un clic sur ✓ l'archive et le premier item de la file prend automatiquement sa place.

━━━━━━━━━━━━━━━━━━━━━━━━

POURQUOI C'EST DIFFÉRENT

La friction, c'est ce qui tue les outils de productivité. Si capturer une pensée demande d'ouvrir une app, choisir un projet, remplir trois champs, tu ne le feras pas. Tu plongeras dans l'impulsion.

Airlock vit dans Chrome, s'ouvre au clavier, et ne demande qu'une chose : le texte de l'impulsion. Pas de projet à choisir, pas de date d'échéance, pas de priorité à assigner, pas de compte à créer.

Ce n'est pas un gestionnaire de tâches. C'est un sas.

━━━━━━━━━━━━━━━━━━━━━━━━

TES DONNÉES NE BOUGENT PAS

• Stockage 100 % local via chrome.storage.local
• Aucun serveur, aucun compte, aucune synchronisation
• Aucune donnée ne quitte ta machine, jamais
• Aucune télémétrie, aucun analytics, aucun tracking — même « anonymisé »
• Une seule permission demandée : « storage »

Une page Options permet d'exporter tes données en JSON à tout moment, et de les réimporter. La sauvegarde reste sous ton contrôle.

━━━━━━━━━━━━━━━━━━━━━━━━

RAPPEL PASSIF SUR CLAUDE.AI

Si tu utilises claude.ai, un bandeau discret te rappelle ton focus en cours quand tu ouvres une nouvelle conversation — le moment précis où le context-switching se produit. Et si tu n'as pas de focus défini, il te suggère d'en poser un avant de plonger.

Fermable d'un clic. Aucune donnée de conversation n'est lue.

━━━━━━━━━━━━━━━━━━━━━━━━

CE QU'AIRLOCK NE FAIT PAS

• Pas de notifications qui t'interrompent
• Pas de gamification, pas de streaks, pas de score
• Pas de suivi du temps
• Pas de rapports de productivité
• Pas d'IA qui réorganise tes priorités à ta place

Les décisions restent les tiennes. Airlock ne fait que t'obliger à en prendre une.

━━━━━━━━━━━━━━━━━━━━━━━━

RACCOURCI

Ctrl+Shift+Q par défaut, modifiable dans chrome://extensions/shortcuts si le raccourci est déjà pris.

━━━━━━━━━━━━━━━━━━━━━━━━

Code source ouvert, licence MIT.
```

---

## Champs de formulaire

| Champ Store | Valeur |
|---|---|
| **Catégorie** | Productivité |
| **Langue** | Français |
| **Objectif unique** (single purpose) | Capturer et prioriser localement des intentions de travail saisies par l'utilisateur, afin de réduire le changement de contexte. |
| **Justification de la permission `storage`** | Sauvegarder localement le focus en cours, la file de priorités et l'historique des items terminés. Aucune donnée n'est transmise. |
| **Justification de l'accès à `claude.ai`** | Afficher un bandeau de rappel du focus en cours lors de l'ouverture d'une nouvelle conversation. Aucun contenu de page n'est lu ni transmis. |
| **Utilisation des données** | Cocher « Cette extension ne collecte pas et n'utilise pas les données utilisateur ». |
| **URL de la politique de confidentialité** | *(à renseigner — voir `airlock-extension/legal/README.md`)* |
