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

dpkg -b deb/ raboms_nuevaversion_all.deb
md5sum raboms_nuevaversion_all.deb > raboms_nuevaversion_all.md5

 chown -R ${SUDO_USER}:${SUDO_USER} deb
 chown -R ${SUDO_USER}:${SUDO_USER} raboms_nuevaversion_all.deb
 chown -R ${SUDO_USER}:${SUDO_USER} raboms_nuevaversion_all.md5
 chmod -R u+rwX deb
