To run:
npm i 
docker compose up

If no change after modification:
docker-compose build --no-cache

Update nakama version:
1. Go to https://github.com/heroiclabs/nakama/releases
2. In Dockerfile, edit `FROM heroiclabs/nakama:{version}` (e.g. FROM heroiclabs/nakama:3.21.1)
3. Run docker compose up --build


Default port:
http://127.0.0.1:7351/

pw: admin

password: password
