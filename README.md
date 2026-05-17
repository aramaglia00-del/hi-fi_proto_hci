# ServizioPA — Prototipo HCI

Prototipo hi-fi per il corso di **Human-Computer Interaction (HCIP)** — A.A. 2025/2026.

Simula l'interazione **dual-device** tra un **totem pubblico** (es. ASL / sportello PA) e il **telefono personale dell'utente** che funge da assistente guidato passo-passo. L'obiettivo è rendere accessibile la fruizione di servizi della PA (pagamento PagoPA, prenotazione CUP) anche a utenti con scarsa familiarità digitale, anziani o con difficoltà visive.

## Demo online (PWA)

Il prototipo è deployato come PWA su Vercel:

➡️ **https://hi-fiprotohci.vercel.app**

Si apre direttamente in browser, è pensato per essere visualizzato su tablet o desktop (design 1180×820, scala automatica al viewport).

## Flusso utente

1. **Accessibility** — Scelta dimensione testo (Normale / Grande / Più grande) sul totem.
2. **Pairing** — Connessione del telefono al totem tramite QR code simulato.
3. **Home** — Scelta servizio: *Prenotiamo una Visita* (CUP) o *Paghiamo un Avviso* (PagoPA).
4. **CUP** — Sanità pubblica → Prenotazioni → Form NRE/CF → Selezione struttura → Conferma.
5. **PagoPA** — Inquadra QR bollettino → Dati pagamento → Email → Metodo pagamento → Dati carta → Riepilogo → Conferma.

In ogni schermata interattiva, il telefono mostra un **assistente coaching** con overlay spotlight sull'elemento corrente, sincronizzato con lo stato del totem.

## Stack

- **React 19** + **Vite** (build tool)
- **lucide-react** per icone
- CSS-in-JS inline (no framework esterno)
- Context API per stato globale (form, scroll, accessibility settings)
- PWA-ready via build Vite

## Eseguire in locale

### Requisiti

- **Node.js** ≥ 18 (consigliato 20+)
- **npm** ≥ 9 (o equivalente: pnpm, yarn)

### Installazione

Dal terminale, nella cartella del progetto:

```bash
npm install
```

### Avvio in dev mode

```bash
npm run dev
```

Vite avvia il server su `http://localhost:5173` (HMR attivo). Apri in browser.

### Build di produzione

```bash
npm run build
```

Output statico in `dist/`. Puoi servirlo con:

```bash
npm run preview
```

## Note

- Pensato per **viewport orizzontale ≥ 1180×820**. Su schermi più piccoli scala in proporzione.
- Tutti i dati (bollettini, carte, ospedali) sono **simulati** — nessuna integrazione reale con sistemi PA.
- Lo stato è **in-memory** (Context API): al refresh della pagina ritorna alla schermata iniziale di accessibility/pairing.

## Autori

Progetto sviluppato per corso HCIP, Politecnico di Torino, A.A. 2025/2026.
