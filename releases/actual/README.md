# raboms
raboms - radio buttons made simple / radio botonero muy simple

![](src/images/logosmall.png)

raboms es una botonera para radios, creado para la comunidad de radio-y-software-libre, hecho simple con html5 y javascript.

El gól de ese programa es facilitar a radios comunitarias para hacer programa en vivo con una botonera a tener una opción facil y liviano. 
Primero intentamos hasta donde podemos llegar asi no más con puro html y javascript, en el futuro quiza usar *electron* para unas configuraciones mas avancadas y evitar las problemas de Javascript con datos locales.

En [liberaturadio.org](liberaturadio.org) hay un [primer tutorial](https://liberaturadio.org/raboms-nueva-botonera-para-la-radio/) a base de raboms 0.6 

Versión actual esta en 0.8

# como instalar

## linux -> git / con filemanager
Abre un terminal y ponga 
```
git clone https://github.com/gaenseklein/raboms
```
eso copia todo el projecto del repositorio a la carpeta "raboms" en tu directorio de home.

Despues pongas 
```
sh raboms/install.sh
```
eso abre el script de instalación, que te copia una entrada a tu menu del desktop para abrir el programa directamente de alli y usar el filemanager para eligir tus archivos. 
despues de eso puedes eligir si quieres abrir la configuración para configurar las carpetas en donde tiene que buscar el script de inicio del filemanager para buscar tus mp3 y ogg.

## linux -> deb

Gracias a Javier Obregon hay una versión de paquete .deb que se puede instalar en cualquier sistema a base de debian/devuan como debian, ubuntu, linux mint y obviamente con lo recomendado para radios: gnu-etertics. 
La siguiente versión de gnu-etertics ya viene con raboms pre-instalado. 
Todos demás pueden eligir la versión más reciente en .deb e instalarlo directo en su sistema desde la carpeta [releases](releases/). 

## todos demas / sin filemanager
Se puede instalar tambien con git en sistemas de windows y mac para tener la versión dev - que es recomendado, como es lo más actual. 
Además hay releases en la carpeta "releases", si algo no funciona y quieres ver si una versión anterior te sirve mejor. 

En la carpeta "releases" estan las ultimas versiones. Guarda la version ultima en tu compu, extraelo adonde quieres y ya lo puedes usar directamente en abrir "raboms.html" con tu navegador preferido. 

último release: [raboms version 0.8](releases/0.8.zip)

# como actualizar

Si instalaste raboms por git (como abajo "linux -> git / con filemanager) es facil de actualizarlo:
Abre un terminal y ponga las dos lineas siguientes
```
cd raboms
git pull
```

Listo. Puedes cerrar el terminal. Despues abre tu raboms como lo estas acostumbrado.

Si no instalaste raboms por git, pero guardando el archivo, simplemente reemplaza tu directorio con el nuevo archivo. 

# el filemanager de raboms (solo linux?)
El camino de programar raboms con javascript solo tiene una desventaja grande: Javascript - o mejor el navegador - no tiene accesso completo a tu sistema de archivos. Por eso en la version sin filemanager (todos no usuarios de linux) lo tienes que escribir la ruta completa a la carpeta donde esta el archivo que quieres usar para un boton. 
El filemanager es la solución para tod@s usuarios de linux, porque el script de inicio busca todos mp3 y ogg para el javascript y les pasa ese información. Asi en el navegador/javascript se puede eligir casi como lo estas acostumbrado y ya contiene toda la información.

El problema de eso es que el proceso de inicio se puede tardar mucho. Si no configuras en la instalación se busca en tu carpeta "home" y en la carpeta "media" para discos externos. 
Si yo inicio así no mas con mi disco externo de 2TB se tarda casi 2 minutos o más para arancar. Eso es normal, tambien que no te dice nada en ese tiempo cuando esta buscando. Hay que esperar. 

Pero el proceso del inicio se puede hacer mucho más rapido cuando configuras el filemanager para que solo busca en rutas que de verdad contienen tus mp3s. Por ejemplo si tu musica esta en /home/usuario/musica - eliges este carpeta para buscarlo. Si tus efectos estan en /home/usuario/efectos añadis ese carpeta tambien. Es posible tener más que una ruta de inicio - que es muy util si quieres conectar un disco duro externo o algo similar. 

## configurar el filemanager
Se puede configurar de dos formas:
1. con el script "config"
2. editando el archivo "rutas.cfg" con un editor de texto como xed, pluma, leaf, nano o que te gusta. 

### el script config
Si instalaste con el script install.sh solo elige "configuracion de rambos" de tu menu. 
Si no hay la entrada en tu menu abre un terminal y ponga 
```
sh raboms/config.sh
```

El Script de configuración te ayuda en el proceso de editar el archivo *rutas.cfg*. puedes eligir si quieres borrar o añadir una nueva ruta. 
Si eliges añadir una ruta, se abre una ventana de eligir archivos. En ese ventana eliges la carpeta que quieres asumar al proceso de busqueda y ya. 
Si eliges borrar se abre una nueva ventana en que eliges la ruta que no quieres buscar más.
Cuando estas listo puedes salir del script o eligier a iniciar raboms

### archivo rutas.cfg
Si quieres editar las rutas por tu mismo es facil igual. Solo abre el archivo rutas.cfg y ponga las carpetas que quieres usar por alli. Por cada carpeta pongas una linea. Si quieres buscar por ejemplo en /home/usuario/musica y /home/usuario/entrevistas el archivo parece asi:
```
/home/usuario/musica/
/home/usuario/entrevistas/ 
```

## tags de id3

Desde version 0.8 el filemanager de raboms contiene la capacidad de obtener las informaciones meta de los tags de id3 y elegir/buscar archivos por este camino. Para que eso funciona tienes que tener instalado el programa "mediainfo". 
Como incorporar esas informaciones de archivos es más lento todavia no construimos la base de datos cada vez que aranca raboms (en cambio para incorporar archivos en general si, es cada vez). Eso significa que
1. para usar esa opción tienes que arancar raboms una vez construiendo la base de datos id3. Elige la ultima opción de raboms-config.sh o aranca el script raboms-scanid3.sh desde tu terminal (si instalaste un deb: en terminal "raboms-scanid3". si instalaste por git ponga "sh raboms/raboms-scanid3.sh" 
2. si quieres incorporar cambios (cambiaste/ordenaste los tags de tus archivos con otra aplicación) o archivos nuevos hay que reconstruir esta base de datos. 
3. una vez construido no es necesario reconstruir la base de datos cada vez, solo si hay nuevos archivos o cambios de los tags que quieres incorporar a raboms. 

Para decir un numero: si incorporo una carpeta con 500 archivos mp3 y ogg la construcción de la base de datos me endura como 25 segundos. (o decir mas o menos mil archivos por minuto)

# idioma/language

Lo hacemos en dos idiomas - ingles como idioma internacional y castellano porque es el idioma principal de nuestra comunidad. Si quieres añadir otro idioma - bienvenido :)
Como el desarrollo es para linux y mas para la comunidad de radios y software libre, los scripts de instalación y tal estan solo en castellano. Lo siento, pero hacer siempre dos versiones me cuesta y shellscript no es tan comodo para desarrollar como en javascript. 

# Eligir salida / placa de audio

Aunque ya esta instalado parece dificil lograrlo. La documentación no esta claro por alli. 
Lo que encontré que dicen es: 

## Firefox:

Abrir el "about:config", buscar por "sinkid" y activar el "media.setsinkid.enabled" (cambiarlo a true). 
A mi no cambió nada por mala suerte... no me deja leer los dispositivos/enumerarles...
Pero otros de la comunidad tenían ya exito con eso - por lo menos podrian cambiarlo una vez a usar la placa que querían, pero despues no pueden cambiarlo más. 
Como no tengo un compu con dos placas de audio es dificil para mi desarrollarlo. 
Si quieren que ese opción es más desarrollado: yo necesito personas que me quieren apoyar como usuario con el desarrollo. Tenemos que hacer un curso chiquito sobre el terminal de firefox y 
lo podemos desarrollar junto mejor. Y claro que necesitas un compu con más que una placa de audio...

## Chromium:

El chromium se ve mis salidas/dispositivos, pero cuando lo quiero cambiar me da un error que faltan permisos para hacerlo. No encontré ninguna documentación sobre eso. Si saben más o encuentran documentaciónes especificos sobre este tema - avisanme porfavor!

## conclusión:

Si alguien encuentra una solución como activarlo por favor escribanme y lo pongo por aqui como lograrlo.

# FAQ / Preguntas frequentes:

## Donde esta el .deb o el repositorio para instalar raboms?

Todavia no hago .deb ni tengo un repositorio para instalar y actualizar raboms. Usamos *git* para hacerlo. Como es tan liviano hasta ahora no veo ningun problema con eso. Es facil. Mire en "como instalar". No necesitas "root" para instalar raboms tampoco. 

## Como puedo desinstalarlo? 

Como no usamos ni apt ni otro gestionador de paquetes no hay un proceso especifico de desinstalación. Borra la carpeta de raboms y las entradas de tu menú y ya esta borrado totalmente. 
Si instalaste con git como esta escrito arriba en la sección de instalación, la carpeta de raboms esta en tu home. 

## Se puede usar raboms en 32 bit o solo 64 bit?

raboms esta escrito en javascript y html. Así es agnostico a tu sistema operativo. Si tienes un navegador moderno y actualizado raboms funciona. Entonces - si, se puede usar en 32 bit igual. 

## Cuales son los requisitos necesarios para usar raboms? Unas dependencias?

raboms por su mismo debe funcionar en cualquier navegador que suporte javascript actual. Si quieres usar raboms con el script de filemanager necesitas tener un sistema que suporte todas las programas del script. Como son programas basicos de linux debe funcionar en cualquier distribución de linux. Si quieres incorporar las informaciones meta tienes que instalar *mediainfo*. Para las dudas, las programas que usa el script son:
1. find
2. grep
3. echo
4. navegador moderno (firefox o chromium)
5. git (solo para actualizar e instalar desde zero) 
6. zenity (para el script de instalación y configuración) 
7. mediainfo (para incorporar informaciones de id3)

## Lo abrí el raboms, pero no pasa nada. Ni puedo cerrar la ventana de ayuda inicial

Asegurate que javascript esta permitido en tu navegador. Si usas *NoScript* o un bloqueador de javascript similar hay que configurarlo que permite el javascript de raboms. 

## Me gusta el raboms, pero me falta una función

Entra al chat de la comunidad - el grupo de telegram - y describe que te falta. Quiza lo puedo incorporar en la proxima versión de raboms :)
O - mejor todavia - crea un "issue" aqui en raboms. 

## Quiero desarrollar para raboms. Como puedo ayudar?

Si quieres desarrollar haga un fork de raboms, edita lo que quieres, subelo a git y haga un pull-request. Lo voy a revisar tu codigo y si esta bien lo incorporo. 

## Quiero ayudar al desarrollo para raboms, pero no puedo programar. Que puedo hacer?

Puedes hacer unas cosas: 
1. Imágenes: Falta un icono lindo para raboms en el menú y tal. 
2. Documentación: La documentación es siempre un parte importante del desarrollo. Haga un tutorial para liberaturadio.org si quieres sobre como usar raboms, como instalar raboms etc. Muchas gracias a clara robayo de liberaturadio.org para el primer tutorial :)
3. Corregir idioma: Ni castellano ni ingles son mis idiomas maternales. Asi seguramente hago errores. Si encuentras un error o si piensas que puedes escribirlo de una forma más sencillo - por favor mandame un mensaje y lo corrigo 
4. Probar y buscar errores: Nadien esta perfecto, ni raboms lo es. Si encuentras un error o algo te parece raro - escribame y voy a ver si lo puedo corregir. 
5. Dar ideas: Soy desarrollador y no radialista. Así si tienes una idea como mejorar raboms aunque no sabes como programarlo - tus ideas estan bienvenido. De verdad todo raboms llegó de un debate en el chat sobre que si existe un programa o una aplicación de este tipo para linux. Como no había (o por lo menos nadie lo conoce) llegó la idea de desarrollar raboms. 

# Roadmap e ideas: que voy a incorporar en las proximas versiones

1. poder cambiar los nombres del botón de forma manual para evitar problemas con nombres de archivos cripticos o muy largos
2. buscar medios por su duración en el menú de informaciones meta
3. eligir el sorteo de los canciones en el menú de informaciones meta (actualmente esta siempre sorteado por primero artista, segundo titulo - sea bien sortear tambien por duración, disco etc.) 

# Disfrutalo no más :)

raboms es un projecto de gaenseklein.net para la comunidad. Espero que tienen tanta alegria hacer radio con raboms como yo tengo desarollarlo.

