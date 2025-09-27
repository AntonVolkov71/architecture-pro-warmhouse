### Build app

docker build -t sockettcp .
Запусти контейнер:

### Start app

docker run -p 11000:8080 sockettcp