# Architettura del Progetto

Il progetto segue un'architettura modulare Angular con chiara separazione tra logica, componenti e dati.

## ⛓️ Struttura Principale

- **core/** → servizi, modelli, funzioni utilità
- **features/** → moduli funzionali (champions, items, runes)
- **shared/** → componenti riutilizzabili
- **app/** → configurazione principale e root component

## 🧩 app/

### app.ts  
Componente root dell’app.

### app.routes.ts  
Definisce le route principali:
- /champions
- /items
- /runes

### app.config.ts  
Configura router e provider.

## 🔧 core/

### models/  
Modelli TypeScript per tipizzare:
- champions  
- items  
- runes  

### services/  
`lol-api.service.ts` gestisce:
- recupero dati
- normalizzazione
- eventuale caching
- separazione UI/logica

## 🧱 features/

Ogni sezione ha:
- lista
- dettaglio
- servizio dedicato
- test `.spec.ts`

## 🧩 shared/

### navbar/  
Navigazione principale.

### footer/  
Footer globale.

### pipes/  
Pipe personalizzate come `format-ability-text.pipe.ts`.

## 🎯 Principi chiave
- Modularità
- Separation of concerns
- Scalabilità
- Testabilità
