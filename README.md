# r/place bot swarm

# Jak to działa
Po instalacji, klient łączy się do serwera i dołącza do swarma.

Serwer jest odpowiedzialny za to, aby sprawdzać obecny stan canvasa r/place i rozdzielać piksele do narysowania między połaczonych użytkowników.

Rysowanie pikseli działa przez [puppeteera](https://github.com/puppeteer/puppeteer) - przeglądarki, którą da się sterować za pomocą kodu.

Usługa może jednocześnie rysować nowe obrazki i bronić obecnego terytorium.

# Instalacja

1. Zainstaluj Node.JS (https://nodejs.org)
2. Sklonuj to repozytorium (Code -> Download as zip)
3. Stwórz plik `./placebot/.env` wzorując się na `example.env`:
    ```
    REDDIT_USERNAME=nazwaUzytkownika
    REDDIT_PASSWORD=haslo
    SERVER_URL=http://rplace.cubepotato.eu
    ```

4. Otwórz wiersz poleceń w folderze `./placebot` - otwórz ten folder w eksploratorze plików, wpisz `cmd` w pasku adresu, naciśnij enter
5. Zainstaluj moduły - `npm install`
6. Uruchom - `npm start`
7. Jeśli otworzy się okno chrome, a w po chwili w konsoli wyświetli się `connected to server` - to znaczy, że bot już działa!