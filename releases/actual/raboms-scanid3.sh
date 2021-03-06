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
# echo -n "" > $SCRIPTPATH/scanforid3tags.list 
cat $SCRIPTPATH/rutas.cfg | while read line
    do 
        echo 'importString = `' >> $SCRIPTPATH/database.js 
        echo "buscando mp3 en ${line}"
        find "$line" -iname "*.mp3" -printf "%8s \t%p\n" > $SCRIPTPATH/database.raw
        echo "mp3s con nombres invalidos:"
        cat $SCRIPTPATH/database.raw | grep \` 
        cat $SCRIPTPATH/database.raw | grep '\\'
        cat $SCRIPTPATH/database.raw | grep -v \` | grep -v '\\' >> $SCRIPTPATH/database.js
#        cat $SCRIPTPATH/database.raw | grep -v \` | grep -v '\\' >> $SCRIPTPATH/scanforid3tags.list 

        echo "buscando ogg en ${line}"
        find "$line" -iname "*.ogg" -printf "%8s \t%p\n" > $SCRIPTPATH/database.raw
        echo "oggs con nombres invalidos:"
        cat $SCRIPTPATH/database.raw | grep \` 
        cat $SCRIPTPATH/database.raw | grep '\\'
        cat $SCRIPTPATH/database.raw | grep -v \` | grep -v '\\' >> $SCRIPTPATH/database.js
        
        echo '`;//end of string' >> $SCRIPTPATH/database.js
        echo "fileManager.importFs(\"$line\",importString);" >> $SCRIPTPATH/database.js
        echo listo.        
    done
rm $SCRIPTPATH/database.raw
echo "creando base de datos de informaciones id3 (artista, disco etc)" #"building id3-tag-base"
STARTTIME=$(date +%s)
cat $SCRIPTPATH/database.js | grep -v 'fileManager' | grep -v \` | grep -v '//'| sed 's/^[ ]*[0-9]*.\t//' > $SCRIPTPATH/idtags.raw

echo "//id3-tags de archivos" > $SCRIPTPATH/databaseid3.js
echo 'var id3tagString =`' >> $SCRIPTPATH/databaseid3.js 

echo -n "scanning ids from files:"
# wc -l $SCRIPTPATH/scanforid3tags.list
# TODO:  only scan new ones (changed size)
# cat $SCRIPTPATH/database.js |  grep -v \` | grep -v '//'| sed 's/^[ ]*[0-9]*.\t//' > $SCRIPTPATH/idtags.old
# cat idtags.old >> $SCRIPTPATH/databaseid3.raw
# 
# cat $SCRIPTPATH/scanforid3tags.list | grep -F -v -f $SCRIPTPATH/mediainfo.list > $SCRIPTPATH/scanforid3tags.raw
#cat $SCRIPTPATH/mediainfo.list | while read line
#    do        
#        cat $SCRIPTPATH/scanforid3tags.list | grep -v "${line}" > $SCRIPTPATH/scanforid3tags.list
#    done
echo -n "cantidad de archivos en total:" 
cat $SCRIPTPATH/idtags.raw | wc -l
# wc -l $SCRIPTPATH/scanforid3tags.list
# cat $SCRIPTPATH/scanforid3tags.raw >> $SCRIPTPATH/mediainfo.list
# cat $SCRIPTPATH/scanforid3tags.raw | sed 's/^[ ]*[0-9]*.\t//' > $SCRIPTPATH/scanforid3tags.list
echo "mediainfo" > $SCRIPTPATH/databaseid3.raw
#echo "id3tool" > $SCRIPTPATH/databaseid3.raw
loopnr=0
#cat $SCRIPTPATH/scanforid3tags.list | while read line
cat $SCRIPTPATH/idtags.raw | while read line
    do
        loopnr=$((loopnr + 1))
#        printf "\rscanning file # ${loopnr}" # file: ${line}\r"; 
         echo -n "leyendo informaciones de archivo nmero ${loopnr} \r"       
         mediainfo --Inform="General;file:///$SCRIPTPATH/mediainfo.cfg" "${line}" >>$SCRIPTPATH/databaseid3.raw     
#        id3tool "${line}" >> $SCRIPTPATH/databaseid3.raw
    done
echo "."
echo "limpiando tags de formato malo" #'cleaning up malformed id3-tags:'
cat $SCRIPTPATH/databaseid3.raw | grep -v '\\' | grep -v \` >> $SCRIPTPATH/databaseid3.js  
echo '`;' >> $SCRIPTPATH/databaseid3.js
echo 'fileManager.buildId3Database();' >> $SCRIPTPATH/databaseid3.js 
ENDTIME=$(date +%s)
echo "$(($ENDTIME - $STARTTIME)) segundos eran necesario para crear base de datos de informaciones id3"
#clean up old files:
rm $SCRIPTPATH/idtags.raw
rm $SCRIPTPATH/databaseid3.raw  
echo "listo."
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
echo "arancar raboms con navegador ${NAVEGADOR}"
if [ ! -z $NAVEGADOR ]; then
    $NAVEGADOR $SCRIPTPATH/src/raboms.html
fi
