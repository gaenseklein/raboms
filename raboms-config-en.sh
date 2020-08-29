#!/bin/bash
# Absolute path to this script, e.g. /home/user/bin/foo.sh
SCRIPT=$(readlink -f "$0")
# Absolute path this script is in, thus /home/user/bin
SCRIPTPATH=$(dirname "$SCRIPT")

# English version: 

rutas=$SCRIPTPATH/rutas.cfg
acttext="selected directorys"
recuerda="note: all files in directory and all subdirectorys are listed.\n it is not recommend to put simple your /home here, as this needs a long time in startup searching for all mp3s in all home.\n A good starting point could be your music-directory, such as /home/user/music/ or something similar"
echo $recuerda
echo "raboms configuration"
echo "actual rutas.cfg:"
cat $rutas
echo "---"

while :
do
    zentext=`sed 's/&/&amp;/g' $rutas`
    echo $zentext
    case $(zenity --list --width="600" --height="400" --text="${acttext} \n${zentext}\n\n${recuerda}" --title="configuration of raboms" --column="options" "add directory" "remove directory" "Init raboms" "Init raboms (re)building id3-tag database")  in
    "add directory")
        echo "add directory"
        nuevaruta=$(zenity --file-selection --directory)
        echo "adding directory ${nuevaruta}"
        echo $nuevaruta >> $rutas  
        nuevalimpiaruta=`echo $nuevaruta | sed 's/&/&amp;/g'`
        acttext="directory ${nuevalimpiaruta} added. \nselected directorys:"
        echo $acttext
        cat $rutas
        ;;
    "remove directory")
        echo "remove directory"
        rutapaborar=$(cat $rutas | zenity --list --width="600" --height="400" --text="select directory to remove" --column="directory")
        echo "removing directory ${rutapaborar}"
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
            echo "removed directory ${rutapaborar}"
            limpborado= `echo $rutapaborar | sed 's/&/&amp;/g'`
            acttext="removed directory ${limpborado}. \n selected directorys:\n"
            rm $rutas.old
        ;;
    "Init raboms")
        sh $SCRIPTPATH/raboms.sh
        break
        ;;
    "Init raboms (re)building id3-tag database")
        sh $SCRIPTPATH/raboms-scanid3.sh
        break
        ;;

    *) 
        break
        ;;
    esac 
done
echo "raboms configured"
