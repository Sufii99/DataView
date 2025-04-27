#!/bin/bash

# Ruta al archivo master.key
MASTER_KEY="config/master.key"

# Ruta donde quieres guardar el backup
BACKUP_DIR="$HOME/backups/rails_keys"

# Nombre del zip de backup
BACKUP_FILE="$BACKUP_DIR/$(date '+%Y-%m-%d_%H-%M-%S')_master_key_backup.zip"

# Comprobar si existe master.key
if [ ! -f "$MASTER_KEY" ]; then
  echo "No se encontró config/master.key. Abortando."
  exit 1
fi

# Crear carpeta de backup si no existe
mkdir -p "$BACKUP_DIR"

# Crear el zip cifrado
echo "Creando backup cifrado en: $BACKUP_FILE"
zip --encrypt "$BACKUP_FILE" "$MASTER_KEY"

echo "Backup creado correctamente."
