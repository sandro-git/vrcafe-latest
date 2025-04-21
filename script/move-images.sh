#!/bin/zsh

# Création du dossier de destination s'il n'existe pas
mkdir -p src/assets/images/experiences

# Déplacement des images du dossier public vers src/assets
if [ -d "public/images/experiences" ]; then
  echo "Déplacement des images..."
  mv public/images/experiences/* src/assets/images/experiences/
  echo "Images déplacées avec succès!"
else
  echo "Le dossier source public/images/experiences n'existe pas ou est vide"
fi

# Mise à jour des références dans les fichiers markdown
echo "Mise à jour des références dans les fichiers de contenu..."
find src/content/experiences -name "*.md" -type f -exec sed -i 's|/images/experiences/|/src/assets/images/experiences/|g' {} \;
echo "Références mises à jour!"