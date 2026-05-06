# Workflow Git

## Branch
- `main` — branch stabile, non si committa direttamente
- `feature/pagopa` — branch di Riccardo/Andrea per la task PagoPA  
- `feature/cup` — branch del collega per la task CUP

## Regole
1. Ogni sviluppatore lavora SOLO sul proprio branch
2. Per aggiornare il proprio branch con le novità di main: `git merge main`
3. Per portare il proprio lavoro su main: aprire una Pull Request su GitHub
4. Mai fare push direttamente su main

## Come aggiornare il tuo branch da main
git checkout feature/pagopa
git fetch origin
git merge origin/main
