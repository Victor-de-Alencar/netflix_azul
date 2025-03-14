# Projeto Final Arquitetura e Tecnologias de Sistemas Web UFRR 2025

Site de streaming feito para a materia de Arquitetura Web. Foi-se usado React + Vite, Firebase, Node.js e axios.
A API do TMDB foi utilizada para extrair os dados dos filmes e recomendá-los.

## Instalação

Como utilizar:

Entre no arquivo e utilize o npm para fazer a instalacao das dependencias:
```
  cd Netflix-Azul
  npm install
```
Apos isso, crie um arquivo .env e adicione as chaves da seguinte forma:
```bash
VITE_TMDB_API_KEY
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```
Obs.: o .env deve estar no root do arquivo.

Por fim, execute o seguinte comando:

```bash
npm run dev
```
