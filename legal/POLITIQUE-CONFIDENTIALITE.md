# Politique de confidentialité - Extension Airlock

**Dernière mise à jour : 19 mai 2026**

## Résumé

Airlock stocke tout en local. **Nous n'exploitons aucun serveur, ne collectons rien, et n'avons aucun accès à vos données.** Toutes les informations que vous saisissez (impulsions, focus, tâches terminées) sont stockées exclusivement dans le stockage local de votre navigateur sur votre machine.

**Une fonctionnalité optionnelle fait exception, et elle est inactive tant que vous ne l'installez pas :** le générateur de méthodologie transmet le texte d'une impulsion à Anthropic, via l'outil en ligne de commande Claude Code exécuté sur votre propre machine, sous votre propre compte Anthropic. Voir « Génération de méthodologie » ci-dessous. Si vous n'installez jamais l'hôte natif, aucune donnée ne quitte votre appareil.

## Données collectées

Nous ne collectons **aucune donnée**. L'extension stocke les informations suivantes uniquement sur votre appareil :

- Les textes que vous saisissez comme « impulsions », « focus » ou éléments de la file
- Les horodatages de création et de finalisation des éléments
- Les méthodologies générées et les étapes que vous avez cochées
- Vos préférences (raccourci clavier, options d'affichage)

Ces données sont stockées via l'API Chrome `storage.local` et restent sur votre ordinateur. Elles ne sont jamais transmises à nous ni à un serveur que nous contrôlons — nous n'en avons aucun.

## Génération de méthodologie (optionnelle)

Airlock peut transformer une impulsion en méthodologie numérotée. Cette fonctionnalité n'est **pas active par défaut** : elle exige l'installation séparée d'un hôte de messagerie native sur votre machine, ainsi que [Claude Code](https://claude.com/claude-code).

Lorsque — et uniquement lorsque — vous cliquez sur « Générer la méthodologie » :

- Le texte de **cette seule impulsion** est inséré dans une consigne et transmis à l'outil `claude` exécuté localement sur votre machine
- Cet outil transmet la consigne à **Anthropic**, en utilisant **votre propre compte Anthropic et sa propre authentification**. Airlock n'a ni compte, ni clé d'API, ni serveur dans ce chemin
- Les étapes renvoyées sont stockées en local, comme le reste de vos données

Concrètement :

- Vos autres impulsions, votre file et votre historique ne sont **jamais** transmis — seule l'impulsion sur laquelle vous agissez l'est
- Les données partent chez Anthropic : **la politique de confidentialité et les conditions d'Anthropic s'appliquent à cet échange** : <https://www.anthropic.com/legal/privacy>
- Airlock ne voit ni la consigne ni la réponse. Rien n'est journalisé, et l'hôte natif n'écrit rien sur le disque
- Sans hôte natif installé, cette fonctionnalité est inerte et aucun appel réseau n'a lieu

Si vous souhaitez que l'extension reste strictement locale, il suffit de ne pas installer l'hôte natif.

## Données que nous ne collectons PAS

- Aucune donnée personnelle identifiable
- Aucune adresse IP
- Aucune analyse statistique ni télémétrie
- Aucun cookie
- Aucun partage de données avec des tiers
- Aucune vente de données (nous n'avons aucune donnée à vendre)
- Aucun réseau publicitaire
- Aucun accès à votre historique de navigation
- Aucune lecture ou modification du contenu des sites que vous visitez, à l'exception de l'affichage d'une bannière passive sur les pages claude.ai

## Permissions demandées

L'extension demande les permissions Chrome suivantes :

- **`storage`** : pour enregistrer localement vos impulsions et focus sur votre appareil
- **`nativeMessaging`** : pour joindre l'hôte local optionnel qui exécute le CLI Claude Code lors de la génération de méthodologie. Sans cet hôte installé, cette permission ne fait rien
- **`host_permissions: https://claude.ai/*`** : pour afficher une bannière contextuelle sur les pages claude.ai indiquant votre focus actuel. L'extension ne lit pas, n'enregistre pas et ne transmet aucun contenu de claude.ai

## Vos droits

Étant donné que vos données restent sur votre appareil (hors génération de méthodologie optionnelle décrite ci-dessus) :

- **Droit d'accès** : toutes vos données sont visibles dans le popup de l'extension et dans la page d'options
- **Droit à l'effacement** : cliquez sur « tout vider » dans le popup, ou désinstallez l'extension pour supprimer toutes les données définitivement
- **Droit à la portabilité** : la page d'options permet d'exporter à tout moment toutes vos données en JSON, et de les réimporter
- **Droit de rectification** : éditez ou supprimez n'importe quel élément directement dans l'extension

## Conservation des données

Les données sont conservées sur votre appareil jusqu'à ce que vous les supprimiez manuellement ou désinstalliez l'extension. Aucune conservation côté serveur n'existe puisque nous n'avons pas de serveur.

## Protection des mineurs

L'extension n'est pas destinée aux enfants de moins de 13 ans. Nous ne collectons sciemment aucune information de qui que ce soit, y compris les enfants.

## Sécurité

Vos données sont protégées par l'isolation standard du stockage local de Chrome. Nous recommandons de maintenir à jour votre système d'exploitation et votre navigateur Chrome.

## Modifications de cette politique

Si nous modifions cette politique à l'avenir (par exemple si une future version ajoute une synchronisation cloud optionnelle), nous mettrons à jour ce document et informerons les utilisateurs via les notes de mise à jour de l'extension. Toute synchronisation cloud, si elle est ajoutée un jour, sera **toujours opt-in** (désactivée par défaut).

## Contact

Pour toute question concernant la vie privée :
- Développeur : keyamasabaya
- Email : github@wespify.com
- Site web : https://briake.xyz

## Conformité RGPD

L'extension ne collectant aucune donnée personnelle et ne disposant d'aucun serveur, les obligations RGPD pesant sur le développeur sont minimales. Vous conservez à tout moment le contrôle total de vos données. La base légale du traitement local effectué par l'extension sur votre machine est votre consentement, exprimé par l'installation et l'utilisation de l'extension.

La génération de méthodologie constitue le seul transfert de données hors de votre appareil. Elle est facultative, nécessite une installation délibérée de votre part, et s'effectue sous votre propre compte Anthropic : le responsable de ce traitement est Anthropic, et non le développeur d'Airlock. La base légale en est votre consentement, exprimé par l'installation de l'hôte natif puis par chaque clic sur « Générer la méthodologie ».

En cas de réclamation, vous pouvez contacter la CNIL : https://www.cnil.fr
