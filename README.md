# r/place bot

1. Zainstaluj Node.JS (https://nodejs.org)
2. Sklonuj to repozytorium (Code -> Download as zip)
3. Stwórz plik `./placebot/.env` wzorując się na `example.env`:
    ```
    REDDIT_USERNAME=nazwaUzytkownika
    REDDIT_PASSWORD=haslo
    SERVER_URL=http://rplace.cubepotato.eu:3000
    ```

4. Otwórz wiersz poleceń w folderze `./placebot` - otwórz ten folder w eksploratorze plików, wpisz `cmd` w pasku adresu, naciśnij enter
5. Zainstaluj moduły - `npm install`
6. Uruchom - `npm start`
7. Jeśli otworzy się okno chrome, a w po chwili w konsoli wyświetli się `connected to server` - to znaczy, że bot już działa!