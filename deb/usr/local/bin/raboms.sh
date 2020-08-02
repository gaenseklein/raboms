#!/bin/bash
# Absolute path to this script, e.g. /home/user/bin/foo.sh
#SCRIPT=$(readlink -f "$0")
# Absolute path this script is in, thus /home/user/bin
#SCRIPTPATH=$(dirname "$SCRIPT")

## Agregado para funcionar con paquete deb
SCRIPT="/usr/local/bin/$0"
SCRIPTPATH="/usr/local/etc/raboms"


echo generando base de datos
echo "//nueva base de datos" > $SCRIPTPATH/database.js
echo leyendo rutas

cat $SCRIPTPATH/rutas.cfg | while read line
    do 
        echo 'importString = `' >> $SCRIPTPATH/database.js 
        echo "buscando mp3 en ${line}"
        find "$line" -iname "*.mp3" -printf "%8s \t%p\n" > $SCRIPTPATH/database.raw
        echo "mp3s con nombres invalidos:"
        cat $SCRIPTPATH/database.raw | grep \` 
        cat $SCRIPTPATH/database.raw | grep '\\'
        cat $SCRIPTPATH/database.raw | grep -v \` | grep -v '\\' >> $SCRIPTPATH/database.js
        echo "buscando ogg en ${line}"
        find "$line" -iname "*.ogg" -printf "%8s \t%p\n" > $SCRIPTPATH/database.raw
        echo "oggs con nombres invalidos:"
        cat $SCRIPTPATH/database.raw | grep \` 
        cat $SCRIPTPATH/database.raw | grep '\\'
        cat $SCRIPTPATH/database.raw | grep -v \` | grep -v '\\' >> $SCRIPTPATH/database.js
        
        echo '`;' >> $SCRIPTPATH/database.js
        echo "fileManager.importFs(\"$line\",importString);" >> $SCRIPTPATH/database.js
        echo listo.        
    done
rm $SCRIPTPATH/database.raw
echo "done. starting firefox or chromium"
# chromium $SCRIPTPATH/src/raboms.html || chromium-browser $SCRIPTPATH/src/raboms.html || firefox $SCRIPTPATH/src/raboms.html || x-www-browser $SCRIPTPATH/src/raboms.html

## Agregado para funcionar con paquete deb
# Pregunta por la existencia de navegadores compatibles en orden de prioridad:
# chromium
# chromium-browser
# firefox-esr
# firefox
#
# Podría usarse el navegador predeterminado x-www-browser
#
NAVEGADOR=$(which chromium)
if [ -z $NAVEGADOR ]; then
    NAVEGADOR=$(which chromium-browser)
    if [ -z $NAVEGADOR ]; then
        NAVEGADOR=$(which firefox-esr)
        if [ -z $NAVEGADOR ]; then
            NAVEGADOR=$(which firefox)
            if [ -z $NAVEGADOR ]; then
                echo " No hay navegador compatible!!!"
                NAVEGADOR="x-www-browser"
            fi
        fi
    fi
fi
if [ ! -z $NAVEGADOR ]; then
    $NAVEGADOR $SCRIPTPATH/src/raboms.html
fi



