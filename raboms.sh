#!/bin/bash
# Absolute path to this script, e.g. /home/user/bin/foo.sh
SCRIPT=$(readlink -f "$0")
# Absolute path this script is in, thus /home/user/bin
SCRIPTPATH=$(dirname "$SCRIPT")
echo $SCRIPTPATH
cd $SRIPTPATH

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
#if ! [ -x "$(command -v chromium-browser)" ]; then
#    echo "starting firefox"
#    firefox $SCRIPTPATH/src/raboms.html
#    else
#    echo "starting chromium"
#    chromium-browser $SCRIPTPATH/src/raboms.html         
#fi
chromium $SCRIPTPATH/src/raboms.html || chromium-browser $SCRIPTPATH/src/raboms.html || firefox $SCRIPTPATH/src/raboms.html



