#!/bin/bash
# Absolute path to this script, e.g. /home/user/bin/foo.sh
#SCRIPT=$(readlink -f "$0")
# Absolute path this script is in, thus /home/user/bin
#SCRIPTPATH=$(dirname "$SCRIPT")

## Agregado para funcionar con paquete deb
SCRIPT="/usr/local/bin/$0"
SCRIPTPATH="/usr/local/etc/raboms"

rutas=$SCRIPTPATH/rutas.cfg
acttext="rutas actuales"
echo "configuración de raboms"
echo "actual rutas.cfg:"
cat $rutas
echo "---"

while :
do
    zentext=`sed 's/&/&amp;/g' $rutas`
    echo $zentext
    case $(zenity --list --width="600" --height="400" --text="${acttext} \n${zentext}\n\nRecuerda: No es necesario poner cada carpeta aqui. subcarpetas estan buscado igual. \nSi /home/yo/musica esta como ruta, no tiene sentido poner /home/yo/musica/temas. \nLes recomiendo no buscar directo en su carpeta home como eso necesita mucho tiempo." --title="configuración de raboms" --column="opciones" "Añadir nueva ruta" "Borrar ruta" "Iniciar Raboms" "Iniciar Raboms (re)construyendo base id3")  in
    "Añadir nueva ruta")
        echo "añadir nueva ruta"
        nuevaruta=$(zenity --file-selection --directory)
        echo "añando ruta ${nuevaruta}"
        echo $nuevaruta >> $rutas  
        nuevalimpiaruta=`echo $nuevaruta | sed 's/&/&amp;/g'`
        acttext="ruta ${nuevalimpiaruta} añandado. \nRutas actuales:"
        echo $acttext
        cat $rutas
        ;;
    "Borrar ruta")
        echo "borrar ruta"
        rutapaborar=$(cat $rutas | zenity --list --width="600" --height="400" --text="elige ruta para borrar" --column="ruta")
        echo "borrando ruta ${rutapaborar}"
            mv $rutas ${rutas}.old
            cat ${rutas}.old | while read line
                do
                    echo $line
                    echo $rutapaborar
                    if [ "$line" = "$rutapaborar" ]; then
                        echo "linea borrada${line}"
                    else
                        echo $line >> $rutas
                    fi
                done
            echo "ruta ${rutapaborar} borrado"
            limpborado= `echo $rutapaborar | sed 's/&/&amp;/g'`
            acttext="ruta ${limpborado} borrado. \nrutas actuales:\n"
            rm $rutas.old
        ;;
    "Iniciar Raboms")
        sh $SCRIPTPATH/raboms.sh
        break
        ;;
    "Iniciar Raboms (re)construyendo base id3")
        sh $SCRIPTPATH/raboms-scanid3.sh
        break
        ;;

    *) 
        break
        ;;
    esac 
done
echo "raboms configurado"
