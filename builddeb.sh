cp -R src deb/usr/share/raboms/
cp mediainfo.cfg deb/usr/share/raboms/

#TODO: also copy/check start-scripts and patch them

echo -n > deb/DEBIAN/md5sums #limpiar md5sums

chown -R root:root deb
chmod 0755 deb/usr/bin/*
chmod 755 deb/DEBIAN/postinst
chmod 755 deb/DEBIAN/postrm
chmod -R 0644 deb/usr/share
find * -type d -exec chmod 755 {} +

#construye md5-sums:
cd deb
find usr -type f -exec md5sum {} + > DEBIAN/md5sums
cd ..

## Busca versión paquete ##
if [ -f deb/DEBIAN/control ]; then
        RVER=$(cat deb/DEBIAN/control | grep -i version | awk -F":" '{print $2}' | tr -d ' ')
else
        RVER="nuevaversion"
fi

dpkg -b deb/ "raboms_"$RVER"_all.deb"
md5sum "raboms_"$RVER"_all.deb" > "raboms_"$RVER"_all.md5"

 chown -R ${SUDO_USER}:${SUDO_USER} deb
 chown -R ${SUDO_USER}:${SUDO_USER} "raboms_"$RVER"_all.deb"
 chown -R ${SUDO_USER}:${SUDO_USER} "raboms_"$RVER"_all.md5"
 chmod -R u+rwX deb
