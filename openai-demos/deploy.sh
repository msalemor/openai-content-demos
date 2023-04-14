npm run build
rm -rf ../server/public
mkdir ../server/public
cp -r dist/* ../server/public
