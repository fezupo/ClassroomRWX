# ClassroomRWX

Web presentation do Boteco RWX para a live sobre **Classroom of the Elite**, cobrindo as temporadas 1 e 2.

## Conceito atual

Isto não é um deck de slides e não é um roteiro de instruções para a bancada.

É um **site de apresentação editorial** pensado para ser compartilhado na live. Felipe percorre as partes, lê o texto em voz alta e, quando o contexto pede, o vídeo já está fixo no ponto certo da página.

A conversa com Will, KV e o chat acontece naturalmente fora do texto.

## Navegação

A apresentação é dividida em partes, acessíveis por abas:

1. A escola perfeita demais
2. A Classe D aprende a jogar
3. O teste da ilha
4. Relações viram armas
5. Paper Shuffle
6. Ryuen caça o fantasma

Não há menu fixo. Cada parte é curta o bastante para ser percorrida sem virar uma página infinita.

## Regra dos vídeos

Os vídeos ficam **embutidos dentro do texto**, sem modal ou popup.

Quando uma mesma fonte possui mais de um momento relevante, ela aparece mais de uma vez já posicionada no trecho correspondente. Assim Felipe não precisa procurar timestamp durante a transmissão.

Exemplo: o episódio 1 aparece em dois embeds distintos:
- a apresentação dos 100 mil pontos;
- a revelação de que a Classe D perdeu os pontos.

## Arquivos

- `index.html` - shell da apresentação
- `styles.css` - identidade Boteco RWX + pontos visuais inspirados no anime
- `clips.js` - conteúdo editorial, partes e mídia
- `app.js` - abas, renderização e navegação

## Estado

V2 estruturada em 01/10/2026.

Alguns trechos ainda usam fontes públicas de referência enquanto buscamos ou produzimos a versão PT-BR definitiva.
