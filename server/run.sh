cd ../openai-demos
sh deploy.sh
cd ../server
#rm server
go run .
#docker login
#docker build . -t am8850/openaidemos:d-1000
#docker image push am8850/openaidemos:dev
#docker run --rm -p 3000:3000 --env-file .env am8850/openaidemos:dev
