#!/bin/bash

# Absolute path to this script, e.g. /home/user/bin/foo.sh
SCRIPT=$(readlink -f "$0")
# Absolute path this script is in, thus /home/user/bin
SCRIPTPATH=$(dirname "$SCRIPT")
echo $SCRIPTPATH
cd $SRIPTPATH

echo "generando raboms.desktop"
echo "[Desktop Entry]
Type=Application
Terminal=true
Name=raboms
Categories=AudioVideo;Player;" > raboms.desktop
echo "Icon=${SCRIPTPATH}/icon.png" >> raboms.desktop
echo "Exec=sh ${SCRIPTPATH}/raboms.sh" >> raboms.desktop
echo ""
echo "raboms.desktop listo:"
cat raboms.desktop
echo ""
echo "mueve raboms.desktop a ~/.local/share/applications/"
mv raboms.desktop $HOME/.local/share/applications/
echo "entrada al menu instalada"
echo ""

echo "generando rabomsConfig.desktop"
echo "[Desktop Entry]
Type=Application
Terminal=true
Name=configuración de raboms
Categories=AudioVideo;Player;" > rabomsConfig.desktop
echo "Icon=${SCRIPTPATH}/icon.png" >> rabomsConfig.desktop
echo "Exec=sh ${SCRIPTPATH}/config.sh" >> rabomsConfig.desktop
echo ""
echo "rabomsConfig.desktop listo:"
cat rabomsConfig.desktop
echo ""
echo "mueve rabomsConfig.desktop a ~/.local/share/applications/"
mv rabomsConfig.desktop $HOME/.local/share/applications/
echo "entrada al menu instalada"
echo ""


echo "generando rutas.cfg"
if zenity --question --width=640 --height=480 --text="Al inicio raboms tiene que buscar todos tus mp3s. Ese proceso puede durar mucho tiempo si buscas en toda la Compu. \nSi quieres puedes eligir en que carpeta tiene que buscar. Eso hace la busqueda mucho mas rapida.\n Lo quieres eligir ahora? Si no puedes cambiarlo despues con un bloqueo de texto, cambiando el archivo rutas.cfg y poner en cada linea un lugar para buscar"
    then
        sh $SCRIPTPATH/config.sh        
    else
        echo $HOME/ > $SCRIPTPATH/rutas.cfg
        echo "/media/" >> $SCRIPTPATH/rutas.cfg
fi
