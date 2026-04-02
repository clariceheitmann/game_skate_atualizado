# Pixel Skate

![Tela do jogo](./imgs/tela_inicial.png)

---

## Identificação do Projeto

**Nome do Projeto:** Pixel Skate
**Desenvolvedora:** Clarice
**Tipo:** Jogo 2D desenvolvido com JavaScript e Canvas

---

## Visão Geral do Sistema

Pixel Skate é um jogo 2D onde o jogador controla um skatista em uma pista urbana.
O objetivo é desviar de obstáculos, coletar itens e sobreviver o maior tempo possível enquanto a dificuldade aumenta progressivamente.

---

## Objetivo do Jogo

* Desviar dos inimigos
* Coletar corações para recuperar vida ❤️
* Acumular pontos
* Sobreviver às fases com dificuldade crescente

---

## Modos de Jogo

* **Singleplayer:** controle de um personagem
* **Multiplayer:** dois jogadores na mesma partida

---

## Instruções de Jogabilidade

### Player 1:

* ⬅️ ➡️ : movimentar
* ⬆️ : pular

### Player 2:

* A / D : movimentar
* W : pular

---

## Mecânicas do Jogo

* Sistema de vidas
* Sistema de pontuação (+5 por obstáculo desviado)
* Coletáveis (coração → +1 vida)
* Progressão de fases
* Aumento de dificuldade
* Troca de cenário conforme a fase
* Colisão com inimigos reduz vida

---

## Telas do Sistema

* Menu Inicial
* Seleção de personagem
* Tela de jogo
* Tela de "Como Jogar"
* Tela "Sobre o Desenvolvedor"
* Tela de vitória
* Tela de derrota

---

## Tecnologias Utilizadas

* JavaScript (ES6+)
* HTML5
* Canvas API
* Programação Orientada a Objetos (POO)

---

## Requisitos do Sistema

### Funcionais

* Movimentação do personagem
* Sistema de vidas
* Sistema de pontuação
* Itens coletáveis
* Progressão de fases
* Múltiplas telas (menu, jogo, sobre, etc.)

### Não Funcionais

* Execução no navegador
* Interface simples e intuitiva
* Uso de requestAnimationFrame para desempenho
* Código estruturado com POO
* Portabilidade entre diferentes computadores

---

## Estrutura do Projeto

```bash
game_skate/
│
├── index.html
├── index.js
├── style.css
│
├── models/
│   └── Skatista.js
│
├── imgs/
├── fonts/
│
├── UML/
│   ├── caso_de_uso.png
│   ├── diagrama_sequencia.png
│
└── README.md
```

---

##  Como Executar o Projeto

###  1. Clonar o repositório

```bash
git clone https://github.com/clariceheitmann/game_skate_atualizado.git
```

### 2. Abrir a pasta

Abra no VS Code ou outro editor

###  3. Executar

Abra o arquivo:

```bash
index.html
```

---

## 🌐 Link do Projeto em Produção

https://game-skate-atualizado.vercel.app/

---

## Sobre a Desenvolvedora

**Nome:** Clarice Heitmann Santos
**GitHub:** https://github.com/clariceheitmann
**Email:** [clarice_h_santos@estudante.sesisenai.org.br](mailto:clarice_h_santos@estudante.sesisenai.org.br)

---

## Créditos

Projeto desenvolvido como parte da disciplina de Programação Orientada a Objetos.
**Product Owner (Professor):** (coloque o nome do professor aqui)

---

## Considerações Finais

O projeto Pixel Skate foi desenvolvido com o objetivo de aplicar conceitos de lógica de programação, orientação a objetos e desenvolvimento de jogos utilizando JavaScript e Canvas, proporcionando uma experiência interativa e divertida.

---
