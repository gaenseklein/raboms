cp -R src deb/usr/share/raboms/

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

 chown -R ${SUDO_USER}:${SUDO_USER} deb
 chmod -R u+rwX deb
