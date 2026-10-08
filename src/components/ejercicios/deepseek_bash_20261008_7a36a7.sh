cd ~/Escritorio/EstudioFernanda/web-educativa

# Si aún no existe la carpeta lecciones
mkdir -p src/data/materias/matematicas/lecciones

# Mover el archivo (si lo creaste en ejercicios/)
mv src/data/materias/matematicas/ejercicios/division-problemas.json \
   src/data/materias/matematicas/lecciones/division-problemas.json

# Eliminar la carpeta vacía (opcional)
rmdir src/data/materias/matematicas/ejercicios 2>/dev/null || true