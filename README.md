Monster-IA-Frontend
Wymagania
Node.js
npm

Instalacja
Pobranie kodu źródłowego projektu:

git clone https://github.com/Monster-IA-Team/Monster-IA-Frontend.git
cd Monster-IA-Frontend


Instalacja zależności projektowych:

npm install


Konfiguracja zmiennych środowiska:

cp .env.example .env.local


Domyślnie aplikacja jest skonfigurowana do komunikacji z API pod adresem:

VITE_API_URL=http://localhost:8000/api


Uruchomienie
Serwer deweloperski
npm run dev


Aplikacja webowa będzie dostępna pod adresem: http://localhost:5173/

Architektura
Framework: React 19
Routing: React Router 7
Styling: Tailwind CSS 4
Bundler: Vite
Język: TypeScript
Server-Side Rendering: Włączone (SSR)

Zmienne środowiska
Dostępne zmienne środowiska w pliku .env.local:

VITE_API_URL - Adres URL backendu API (domyślnie: http://localhost:8000/api)