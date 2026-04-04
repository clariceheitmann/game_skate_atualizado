let canvas = document.getElementById('des')
console.log(canvas)

const fonte = new FontFace('QuinqueFive', 'url(./fonts/QuinqueFive.ttf)');
    fonte.load().then(function(font){
        document.fonts.add(font);
    });

let des = canvas.getContext('2d')
console.log(des)

let fundo1 = new Image()
fundo1.src = './imgs/fundo1.png'

let fundo2 = new Image()
fundo2.src = './imgs/fundo2.png'

let fundo3 = new Image()
fundo3.src = './imgs/fundo3.png'

let fundo4 = new Image()
fundo4.src = './imgs/fundo4.png'

let fundo5 = new Image()
fundo5.src = './imgs/fundo5.png'

let fundo = fundo1

let imgWin = new Image()
imgWin.src = './imgs/trofeu.png'

let imgGameOver = new Image()
imgGameOver.src = './imgs/game_over.png'

let imgMenu = new Image()
imgMenu.src = './imgs/tela_inicial.png' 

let imgP1Win = new Image()
imgP1Win.src = './imgs/player_1_win.png'

let imgP2Win = new Image()
imgP2Win.src = './imgs/player_2_win.png'

let chao = 600

let cascaBanana = new Inimigos(0, 0, 70, 50, './imgs/cascaBanana.png')
let coneTransito = new Inimigos(0, 0, 90, 90, './imgs/coneTransito.png')
let hidrante = new Inimigos(0, 0, 100, 100, './imgs/hidrante.png')
let lixo = new Inimigos(0, 0, 105, 95, './imgs/lixo.png')
let carrinho = new Inimigos(0, 0, 130, 130, './imgs/carrinho.png' )

let inimigos = [cascaBanana, coneTransito, hidrante, lixo, carrinho]

let skatistaM = new GarotoSkatista(100, 180, 180, 160, './imgs/skatista_parado_M.png', "M")
let skatistaF = new GarotoSkatista(300, 180, 180, 160, './imgs/skatista_parado_F.png', "F")

let coracao = new Coracao(0, 0, 65, 65, './imgs/coracao.png')

let playerAtual = skatistaM

let t1 = new Text()
let t2 = new Text()
let fase_txt = new Text()

let botaoComoJogar = {}
let botaoSobre = {}

let botaoPause = {
    x: 1100,
    y: 20,
    w: 60,
    h: 40
}

let estado = "menu"
let modo = ""
let personagemEscolhido = "M"

let particulas = []
let textosFlutuantes = []

let mensagemFase = ""
let tempoMensagemFase = 0

let pausado = false
let contagem = 3
let iniciou = false
let tempoContagem = 0

let mouseX = 0
let mouseY = 0

let musicaFundo = new Audio('./imgs/musica_fundo.mp3')
let somAndar = new Audio('./imgs/som_skate_andando.mp3')
let somPulo = new Audio('./imgs/som_skate_pulando.mp3')
let somBatida = new Audio('./imgs/metal_pipe.mp3')
let somGameOver = new Audio('./imgs/som_gameover.mp3')
let somVitoria = new Audio('./imgs/som_vitoria.mp3')

musicaFundo.loop = true
somAndar.loop = true

musicaFundo.volume = 0.05
somAndar.volume = 0.3
somPulo.volume = 0.3
somBatida.volume = 0.2
somGameOver.volume = 0.4
somVitoria.volume = 0.4

let jogar = true
let fase = 1

let maxInimigos = 1
let distanciaMinima = 400

let imagensPreload = []

function preloadImagens(){
    let lista = [
        // andando M
        './imgs/animacao_andando_1_M.png',
        './imgs/animacao_andando_2_M.png',
        './imgs/animacao_andando_3_M.png',

        // pulando M
        './imgs/animacao_pulando_1_M.png',
        './imgs/animacao_pulando_2_M.png',
        './imgs/animacao_pulando_3_M.png',
        './imgs/animacao_pulando_4_M.png',

        // caindo M
        './imgs/animacao_caindo_1_M.png',
        './imgs/animacao_caindo_2_M.png',

        // andando F
        './imgs/animacao_andando_1_F.png',
        './imgs/animacao_andando_2_F.png',
        './imgs/animacao_andando_3_F.png',

        // pulando F
        './imgs/animacao_pulando_1_F.png',
        './imgs/animacao_pulando_2_F.png',
        './imgs/animacao_pulando_3_F.png',
        './imgs/animacao_pulando_4_F.png',

        // caindo F
        './imgs/animacao_caindo_1_F.png',
        './imgs/animacao_caindo_2_F.png'
    ]

    lista.forEach(src => {
        let img = new Image()
        img.src = src
        imagensPreload.push(img)
    })
}

document.addEventListener('keydown', (e) => {

   if((e.key === "Escape" || e.key === " ") && estado === "jogo"){
    pausado = !pausado
}
    // ===== MENU PRINCIPAL =====
    if (estado === "menu") {
        if (e.key === "1") {
            modo = "single";
            estado = "menu_personagem";
        }

        if (e.key === "2") {
            modo = "multi";
            estado = "jogo";
            skatistaM.x = 100;
            skatistaF.x = 300;
            playerAtual = null;
        }

        if (e.key === "3") { estado = "como_jogar"; }
        if (e.key === "4") { estado = "sobre"; }

        return; 
    }

    if (estado === "menu_personagem") {
        if (e.key === "1") {
            personagemEscolhido = "M";
            playerAtual = skatistaM;
            estado = "jogo";
        }

        if (e.key === "2") {
            personagemEscolhido = "F";
            playerAtual = skatistaF;
            estado = "jogo";
        }

        if (e.key === "Escape") {
            estado = "menu";
        }

        return; 
    }

    if (estado === "jogo" && jogar) {

        if (e.key === 'ArrowLeft') skatistaM.velX = -5;
        if (e.key === 'ArrowRight') skatistaM.velX = 5;
        if (e.key === 'ArrowUp' && !skatistaM.pulando) {
            for(let i=0;i<6;i++){
            particulas.push({
            x: skatistaM.x + skatistaM.w/2,
            y: skatistaM.y + skatistaM.h,
            vx: Math.random()*4-2,
            vy: Math.random()*-3,
            vida: 30
    })
}
            skatistaM.velY = -18;
            skatistaM.pulando = true;
            somPulo.currentTime = 0;
            somPulo.play();
        }

        if (e.key === 'a') skatistaF.velX = -5;
        if (e.key === 'd') skatistaF.velX = 5;
        if (e.key === 'w' && !skatistaF.pulando) {
            skatistaF.velY = -18;
            skatistaF.pulando = true;
            somPulo.currentTime = 0;
            somPulo.play();
        }

        if (['ArrowLeft','ArrowRight','a','d'].includes(e.key)) {
            if (somAndar.paused) somAndar.play();
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (estado === "jogo") {
        if (['ArrowLeft','ArrowRight'].includes(e.key)) skatistaM.velX = 0;
        if (['a','d'].includes(e.key)) skatistaF.velX = 0;

        if (['ArrowLeft','ArrowRight','a','d'].includes(e.key)) {
            somAndar.pause();
            somAndar.currentTime = 0;
        }
    }
});

document.addEventListener('click', (e) => {
    let x = e.offsetX;
    let y = e.offsetY;

    // ===== CLIQUE NO BOTÃO PAUSE =====
if(estado === "jogo"){
    if(
        x > botaoPause.x &&
        x < botaoPause.x + botaoPause.w &&
        y > botaoPause.y &&
        y < botaoPause.y + botaoPause.h
    ){
        pausado = !pausado
        return
    }
}

// ===== MENU PAUSE =====
if(pausado){

    // CONTINUAR
    if(x > 500 && x < 700 && y > 300 && y < 340){
        pausado = false
        return
    }

    // REINICIAR
    if(x > 500 && x < 700 && y > 360 && y < 400){
        reiniciarJogo()
        return
    }

    // MENU
    if(x > 500 && x < 700 && y > 420 && y < 460){
        estado = "menu"
        pausado = false
        jogar = true
        return
    }
}

    if (musicaFundo.paused) musicaFundo.play();

    if (!jogar) { reiniciarJogo(); return; }

    if (estado === "menu") {

    if (x > 450 && x < 750 && y > 280 && y < 320) { 
        modo = "single"; 
        estado = "menu_personagem"; 
        return;
    }

    if (x > 450 && x < 750 && y > 340 && y < 380) { 
        modo = "multi"; 
        estado = "jogo"; 
        skatistaM.x = 100; 
        skatistaF.x = 300; 
        playerAtual = null;
        return;
    }

    if (x > botaoComoJogar.x && x < botaoComoJogar.x + botaoComoJogar.w &&
        y > botaoComoJogar.y && y < botaoComoJogar.y + botaoComoJogar.h) { 
        estado = "como_jogar"; 
        return; 
    }

    if (x > botaoSobre.x && x < botaoSobre.x + botaoSobre.w &&
        y > botaoSobre.y && y < botaoSobre.y + botaoSobre.h) { 
        estado = "sobre"; 
        return; 
    }
}

    if (estado === "menu_personagem") {
    if (x > 450 && x < 750 && y > 320 && y < 370) { 
        personagemEscolhido = "M"; 
        playerAtual = skatistaM; 
        estado = "jogo"; 
        return; // 🔥
    }
    else if (x > 450 && x < 750 && y > 390 && y < 440) { 
        personagemEscolhido = "F"; 
        playerAtual = skatistaF; 
        estado = "jogo"; 
        return; // 🔥
    }

    else if (x > 40 && x < 150 && y > 20 && y < 60) {
        estado = "menu";
        return; // 🔥
    }
}

    if (estado === "como_jogar" || estado === "sobre") {
        if (x > 40 && x < 150 && y > 20 && y < 60) {
            estado = "menu";
        }
    }
});

document.addEventListener('mousemove', (e)=>{
    mouseX = e.offsetX
    mouseY = e.offsetY
})

function spawnInimigo(){
    let ativos = inimigos.filter(i => i.ativo)

    if(ativos.length < maxInimigos){
        let inativos = inimigos.filter(i => !i.ativo)

        if(inativos.length > 0){
            let podeSpawnar = true

            ativos.forEach(i => {
                if(i.x > 1300 - distanciaMinima){
                    podeSpawnar = false
                }
            })

            if(podeSpawnar){
                let aleatorio = inativos[Math.floor(Math.random() * inativos.length)]
                aleatorio.recomeca()
            }
        }
    }
}

function spawnCoracao(){
    if(!coracao.ativo){
        let chance = Math.random()

        if(chance < 0.0002){ // 🔥 controla raridade
            coracao.spawn()
        }
    }
}

let vencedor = ""

function game_over() {

    if(modo === "single"){

        if(playerAtual.pontos >= 150){
            jogar = false
            vencedor = "WIN"
        }

        if(playerAtual.vida <= 0){
            jogar = false
            vencedor = "LOSE"
        }
    }

    if(modo === "multi"){

    if(skatistaM.vida <= 0){
    jogar = false
    vencedor = "PLAYER 2 VENCEU!"
}

if(skatistaF.vida <= 0){
    jogar = false
    vencedor = "PLAYER 1 VENCEU!"
}
}

    if(!jogar){

        musicaFundo.pause()
        musicaFundo.currentTime = 0

        somAndar.pause()
        somAndar.currentTime = 0

        somPulo.pause()
        somPulo.currentTime = 0

        somBatida.pause()
        somBatida.currentTime = 0

        if(modo === "single"){
            if(vencedor === "LOSE" && somGameOver.paused){
                somGameOver.currentTime = 0
                somGameOver.play()
            }

            if(vencedor === "WIN" && somVitoria.paused){
                somVitoria.currentTime = 0
                somVitoria.play()
            }
        }

        if(modo === "multi"){
            if(somVitoria.paused){
                somVitoria.currentTime = 0
                somVitoria.play()
            }
        }
    }
}


function ver_fase() { 
    let pontosRef = (modo === "single") ? playerAtual.pontos : skatistaM.pontos

    if (pontosRef > 20 && fase === 1) {
    fase = 2
    tempoMensagemFase = 120
    mensagemFase = "FASE 2"
    maxInimigos = 2
    inimigos.forEach(i => i.vel = 7)
    fundo = fundo2
}

else if (pontosRef > 50 && fase === 2) {
    fase = 3
    tempoMensagemFase = 120
    mensagemFase = "FASE 3"
    maxInimigos = 3
    inimigos.forEach(i => i.vel = 8)
    fundo = fundo3
}

else if (pontosRef > 80 && fase === 3) {
    fase = 3
    tempoMensagemFase = 120
    mensagemFase = "FASE 3"
    maxInimigos = 3
    inimigos.forEach(i => i.vel = 9)
    fundo = fundo4
}

else if (pontosRef > 110 && fase === 4) {
    fase = 5
    tempoMensagemFase = 120
    mensagemFase = "FASE 5"
    maxInimigos = 4
    inimigos.forEach(i => i.vel = 10)
    fundo = fundo5
    }
}

function colisao() {

    // ===== COLISÃO COM INIMIGOS =====
    inimigos.forEach(i => {

        // PLAYER 1 (M)
        if(i.ativo && skatistaM.colid(i) && skatistaM.invencivel <= 0){
            somBatida.play()
            i.ativo = false
            skatistaM.vida -= 1

            textosFlutuantes.push({
                x: skatistaM.x,
                y: skatistaM.y,
                texto: "-1 VIDA",
                cor: "#ff4d4d",
                vida: 60
            })
        }

        // PLAYER 2 (F)
        if(i.ativo && skatistaF.colid(i) && skatistaF.invencivel <= 0){
            somBatida.play()
            i.ativo = false
            skatistaF.vida -= 1

            textosFlutuantes.push({
                x: skatistaF.x,
                y: skatistaF.y,
                texto: "-1 VIDA",
                cor: "#ff4d4d",
                vida: 60
            })
        }

    })


    // ===== CORAÇÃO SINGLEPLAYER =====
    if(modo === "single" && coracao.ativo && playerAtual.colid(coracao)){
        coracao.ativo = false
        playerAtual.vida += 1

        textosFlutuantes.push({
            x: playerAtual.x,
            y: playerAtual.y,
            texto: "+1 VIDA",
            cor: "#6eff6e",
            vida: 60
        })
    }


    // ===== CORAÇÃO MULTIPLAYER =====
    if(modo === "multi"){

        if(coracao.ativo && skatistaM.colid(coracao)){
            coracao.ativo = false
            skatistaM.vida += 1

            textosFlutuantes.push({
                x: skatistaM.x,
                y: skatistaM.y,
                texto: "+1 VIDA",
                cor: "#6eff6e",
                vida: 60
            })
        }

        if(coracao.ativo && skatistaF.colid(coracao)){
            coracao.ativo = false
            skatistaF.vida += 1

            textosFlutuantes.push({
                x: skatistaF.x,
                y: skatistaF.y,
                texto: "+1 VIDA",
                cor: "#6eff6e",
                vida: 60
            })
        }

    }
}

function pontuacao() {
    inimigos.forEach(i => {

        if(i.ativo && !i.pontuado){

            if(skatistaM.x > i.x + i.w){
                skatistaM.pontos += 5

                textosFlutuantes.push({
                x: i.x,
                y: i.y,
                texto: "+5",
                cor: "#ffdae7",
                vida: 60
        })
                i.pontuado = true
            }

            if(skatistaF.x > i.x + i.w){
    skatistaF.pontos += 5

    textosFlutuantes.push({
        x: i.x,
        y: i.y,
        texto: "+5",
        cor: "#ffdae7",
        vida: 60
    })

    i.pontuado = true
}

        }
    })
}

function desenhaMenu(){
    if(imgMenu.complete){
        des.drawImage(imgMenu, 0, 0, 1200, 700)
    }

    botaoSobre.x = 450
    botaoSobre.y = 540
    botaoSobre.w = 300
    botaoSobre.h = 40

    des.textAlign = "center"

    t1.des_text('PIXEL SKATE', 600, 100, '#000000', '55px QuinqueFive', '#ffdae7')

    des.textAlign = "start"

    let corSingle = "#ffdae7"

if(mouseX > 450 && mouseX < 750 && mouseY > 280 && mouseY < 320){
    corSingle = "#ffffff"
}



t1.des_text('1 - Singleplayer', 450, 300, '#000000', '20px QuinqueFive', corSingle)

    let corMulti = "#ffdae7"

if(mouseX > 450 && mouseX < 750 && mouseY > 340 && mouseY < 380){
    corMulti = "#ffffff"
}

t1.des_text('2 - Multiplayer', 450, 360, '#000000', '20px QuinqueFive', corMulti)



    let corComo = "#ffdae7"

if(mouseX > 450 && mouseX < 750 && mouseY > 400 && mouseY < 440){
    corComo = "#ffffff"
}

t1.des_text('3 - Como Jogar', 450, 420, '#000000', '20px QuinqueFive', corComo)



    let corSobre = "#ffdae7"

if(mouseX > 450 && mouseX < 750 && mouseY > 460 && mouseY < 500){
    corSobre = "#ffffff"
}

t1.des_text('4 - Desenvolvedor', 450, 480, '#000000', '20px QuinqueFive', corSobre)




    let larguraTexto = des.measureText('3 - Como Jogar').width
    botaoComoJogar = { x: 450 - larguraTexto / 2, y: 400 - 20, w: larguraTexto, h: 30 }

    botaoSobre = { x: 450, y: 460, w: 300, h: 40 }
}

function desenhaEscolha(){

    if(imgMenu.complete){
        des.drawImage(imgMenu, 0, 0, 1200, 700)
    }

    des.textAlign = "center"

    t1.des_text(
        'Escolha seu personagem',
        600,
        100,
        '#000000',
        '32px QuinqueFive',
        '#ffdae7'
    )

    let corM = "#ffdae7"
let sizeM = "22px QuinqueFive"

if(mouseX > 450 && mouseX < 750 && mouseY > 320 && mouseY < 370){
    corM = "#ffffff"
    sizeM = "26px QuinqueFive"
}

t1.des_text('1 - Player 1', 600, 350, '#000000', sizeM, corM)




    let corF = "#ffdae7"
let sizeF = "22px QuinqueFive"

if(mouseX > 450 && mouseX < 750 && mouseY > 390 && mouseY < 440){
    corF = "#ffffff"
    sizeF = "26px QuinqueFive"
}

t1.des_text('2 - Player 2', 600, 420, '#000000', sizeF, corF)

    des.textAlign = "start"


    let corVoltar = "#ffdae7"
let sizeVoltar = "16px QuinqueFive"

if(mouseX > 40 && mouseX < 150 && mouseY > 20 && mouseY < 60){
    corVoltar = "#ffffff"
    sizeVoltar = "20px QuinqueFive"
}

t1.des_text('← Voltar', 50, 50, '#000000', sizeVoltar, corVoltar)
}

function desenhaComoJogar(){

    if(imgMenu.complete){
        des.drawImage(imgMenu, 0, 0, 1200, 700)
    }

    des.fillStyle = "rgba(0,0,0,0.4)"
    des.fillRect(0, 0, 1200, 700)

    des.textAlign = "center"

    t1.des_text(
        'Como jogar',
        600,
        100,
        '#000000',
        '32px QuinqueFive',
        '#ffdae7'
    )

    t1.des_text(
        'Desvie dos inimigos pulando ou se movendo!',
        600,
        250,
        '#000000',
        '16px QuinqueFive',
        '#ffdae7'
    )

    t1.des_text(
        'Ganhe 5 ponto ao passar pelos inimigos!',
        600,
        300,
        '#000000',
        '16px QuinqueFive',
        '#ffdae7'
    )

    t1.des_text(
        'O jogo acaba quando se perde todas as vidas',
        600,
        350,
        '#000000',
        '16px QuinqueFive',
        '#ffdae7'
    )

    t1.des_text(
        'Perde o jogador que primeiro morrer',
        600,
        400,
        '#000000',
        '16px QuinqueFive',
        '#ffdae7'
    )

    t1.des_text(
        'Player 1: Setas',
        600,
        450,
        '#000000',
        '16px QuinqueFive',
        '#a2b8e6'
    )

    t1.des_text(
        'Player 2: WASD',
        600,
        490,
        '#000000',
        '16px QuinqueFive',
        '#dea5e6'
    )

    des.textAlign = "start"

    let corVoltar = "#ffdae7"
let sizeVoltar = "16px QuinqueFive"

if(mouseX > 40 && mouseX < 150 && mouseY > 20 && mouseY < 60){
    corVoltar = "#ffffff"
    sizeVoltar = "20px QuinqueFive"
}

t1.des_text('← Voltar', 50, 50, '#000000', sizeVoltar, corVoltar)
}

function desenhaSobre(){

    if(imgMenu.complete){
        des.drawImage(imgMenu, 0, 0, 1200, 700)
    }

    des.fillStyle = "rgba(0,0,0,0.4)"
    des.fillRect(0, 0, 1200, 700)

    des.textAlign = "center"

    t1.des_text(
        'Sobre o Desenvolvedor',
        600,
        100,
        '#000000',
        '32px QuinqueFive',
        '#ffdae7'
    )

    t1.des_text(
        'Desenvolvido por Clarice',
        600,
        250,
        '#000000',
        '22px QuinqueFive',
        '#ffdae7'
    )

    t1.des_text(
        'Email: clarice_h_santos@estudante.sesisenai.org.br',
        600,
        300,
        '#000000',
        '18px QuinqueFive',
        '#ffdae7'
    )

    t1.des_text(
        'GitHub: github.com/clariceheitmann',
        600,
        350,
        '#000000',
        '18px QuinqueFive',
        '#ffdae7'
    )

    des.textAlign = "start"

    let corVoltar = "#ffdae7"
let sizeVoltar = "16px QuinqueFive"

if(mouseX > 40 && mouseX < 150 && mouseY > 20 && mouseY < 60){
    corVoltar = "#ffffff"
    sizeVoltar = "20px QuinqueFive"
}

t1.des_text('← Voltar', 50, 50, '#000000', sizeVoltar, corVoltar)
}

function reiniciarJogo(){

    skatistaM.invencivel = 60
    skatistaF.invencivel = 60
    
    // estado do jogo
    jogar = true
    pausado = false
    iniciou = false
    contagem = 3
    tempoContagem = 0

    // fase
    fase = 1
    maxInimigos = 1
    mensagemFase = ""
    tempoMensagemFase = 0
    fundo = fundo1

    // reset players
    skatistaM.x = 100
    skatistaM.y = 180
    skatistaM.vida = 5
    skatistaM.pontos = 0

    skatistaF.x = 300
    skatistaF.y = 180
    skatistaF.vida = 5
    skatistaF.pontos = 0

    // inimigos
    inimigos.forEach(i => {
        i.ativo = false
        i.pontuado = false
    })

    // coração
    coracao.ativo = false

    // efeitos
    particulas = []
    textosFlutuantes = []

    // som
    musicaFundo.currentTime = 0
    musicaFundo.play()

    // volta pro jogo direto
    estado = "jogo"
}

function desenha() {

    // ===== CONTAGEM INICIAL =====
    if(estado === "jogo" && !iniciou){
        tempoContagem++

        if(tempoContagem % 90 === 0){
            contagem--
        }

        if(contagem <= 0){
            iniciou = true
        }

        if (fundo.complete) {
            des.drawImage(fundo, 0, 0, 1200, 700)
        }

        t1.des_text(contagem, 600, 350, "#ffffff", "60px QuinqueFive", "#ffdae7")
        t1.des_text(
    contagem,
    600,
    350,
    "#ffdae7", // rosa
    "60px QuinqueFive",
    "#000000"  // contorno preto
)
        return

        
    }

    // ===== TELAS =====
    if(estado === "como_jogar"){
        desenhaComoJogar()
        return
    }

    if(estado === "sobre"){
        desenhaSobre()
        return
    }

    if(estado === "menu"){
        desenhaMenu()
        return
    }

    if(estado === "menu_personagem"){
        desenhaEscolha()
        return
    }

    // ===== FUNDO =====
    if (fundo.complete) {
        des.drawImage(fundo, 0, 0, 1200, 700)
    }

    // ===== PAUSE (ANTES DE TUDO) =====
    if(pausado){
    des.fillStyle = "rgba(0,0,0,0.7)"
    des.fillRect(0,0,1200,700)

    des.textAlign = "center"

    t1.des_text("PAUSADO", 600, 200, "#ffdae7", "40px QuinqueFive", "#000000")

    t1.des_text("Continuar", 600, 320, "#ffdae7", "20px QuinqueFive", "#000000")
    t1.des_text("Reiniciar", 600, 380, "#ffdae7", "20px QuinqueFive", "#000000")
    t1.des_text("Menu", 600, 440, "#ffdae7", "20px QuinqueFive", "#000000")

    des.textAlign = "start"

    return
}

    // ===== JOGO =====
    if (jogar) {

        // ===== BOTÃO PAUSE =====
        des.fillStyle = "#000000aa"
        des.fillRect(botaoPause.x, botaoPause.y, botaoPause.w, botaoPause.h)

        des.fillStyle = "#ffffff"
        des.font = "20px QuinqueFive"
        des.textAlign = "center"
        des.fillText("II", botaoPause.x + botaoPause.w/2, botaoPause.y + 28)

des.textAlign = "start"

        // PARTÍCULAS
        particulas.forEach(p => {
            des.fillStyle = "#ffffff"
            des.fillRect(p.x, p.y, 4, 4)
        })

        // INIMIGOS
        inimigos.forEach(i => {
            if(i.ativo) i.des_carro()
        })

        // CORAÇÃO
        if(coracao.ativo){
            coracao.des_carro()
        }

        // PLAYER SINGLE
        if(modo === "single" && playerAtual){
            playerAtual.drawComDano()

            t1.des_text('Pontos: ' + playerAtual.pontos, 900, 40, '#000000', '16px QuinqueFive', '#ffdae7')
            t2.des_text('Vida: ' + playerAtual.vida, 40, 40, '#000000', '16px QuinqueFive', '#ffdae7')
        }

        // MULTIPLAYER
        if(modo === "multi"){
            skatistaM.drawComDano()
            skatistaF.drawComDano()

            t1.des_text('P1: ' + skatistaM.pontos + ' | ❤ ' + skatistaM.vida, 40, 40, '#000', '16px QuinqueFive', '#a2b8e6')

t1.des_text('P2: ' + skatistaF.pontos + ' | ❤ ' + skatistaF.vida, 40, 80, '#000', '16px QuinqueFive', '#dea5e6')
        }

        // ===== MENSAGEM DE FASE (POR CIMA) =====
        if(tempoMensagemFase > 0){
            des.textAlign = "center"

            t1.des_text(
                mensagemFase,
                600,
                200,
                "#ffdae7",
                "40px QuinqueFive",
                "#000000"
            )

            des.textAlign = "start"
        }

        // HUD
        fase_txt.des_text('Fase: ' + fase, 550, 40, '#000000', '16px QuinqueFive', '#ffdae7')

    } 
    else {

        // ===== GAME OVER =====
        des.filter = "blur(8px) brightness(0.6)"
        des.fillStyle = "rgba(0, 0, 0, 0.7)"
        des.fillRect(300, 80, 600, 540)

        if (fundo.complete) {
            des.drawImage(fundo, 0, 0, 1200, 700)
        }

        des.filter = "none"

        des.fillStyle = "rgba(0,0,0,0.5)"
        des.fillRect(0, 0, 1200, 700)

        if(modo === "single"){

            let larguraImg = 500
            let alturaImg = 500
            let xCentro = (1200 / 2) - (larguraImg / 2)
            let yCentro = 80

            if(vencedor === "LOSE" && imgGameOver.complete){
                des.drawImage(imgGameOver, xCentro, yCentro, larguraImg, alturaImg)
            }

            if(vencedor === "WIN" && imgWin.complete){
                des.drawImage(imgWin, xCentro, yCentro, larguraImg, alturaImg)
            }

            des.textAlign = "center"

            t1.des_text(
                'Pontos: ' + playerAtual.pontos,
                600,
                yCentro + alturaImg - 20,
                '#000000',
                '25px QuinqueFive',
                '#ffdae7'
            )

            t1.des_text(
                'Tentar outra vez',
                600,
                600,
                '#000000',
                '16px QuinqueFive',
                '#ffdae7'
            )

            des.textAlign = "start"
        }

        else if(modo === "multi"){

            let larguraImg = 500
            let alturaImg = 400
            let xCentro = (1200 / 2) - (larguraImg / 2)
            let yCentro = 120

            if(vencedor === "PLAYER 1 VENCEU!" && imgP1Win.complete){
                des.drawImage(imgP1Win, xCentro, yCentro, larguraImg, alturaImg)
            }

            if(vencedor === "PLAYER 2 VENCEU!" && imgP2Win.complete){
                des.drawImage(imgP2Win, xCentro, yCentro, larguraImg, alturaImg)
            }

            des.textAlign = "center"

            t1.des_text(
                'Pontos player 1: ' + skatistaM.pontos,
                600,
                yCentro + alturaImg + 60,
                '#000000',
                '22px QuinqueFive',
                '#ffdae7'
            )

            t1.des_text(
                'Pontos player 2: ' + skatistaF.pontos,
                600,
                yCentro + alturaImg + 100,
                '#000000',
                '22px QuinqueFive',
                '#ffdae7'
            )

            t1.des_text(
                'Tentar outra vez',
                600,
                680,
                '#000000',
                '16px QuinqueFive',
                '#ffdae7'
            )

            des.textAlign = "start"
        }
    }

    // ===== TEXTOS FLUTUANTES =====
    textosFlutuantes.forEach(t=>{
        t1.des_text(t.texto, t.x, t.y, t.cor, '16px QuinqueFive', '#000000')
    })
}

function atualiza() {
    if(pausado) return

    if(tempoMensagemFase > 0){
    tempoMensagemFase--
}

    if (!jogar || estado !== "jogo") return;

    if(modo === "single"){
        if(!playerAtual) return; // garante que playerAtual existe
        playerAtual.mov_car()
        playerAtual.atualizaAnimacao()
    }

    if(modo === "multi"){
        skatistaM.mov_car()
        skatistaM.atualizaAnimacao()
        skatistaF.mov_car()
        skatistaF.atualizaAnimacao()
    }

    textosFlutuantes.forEach(t=>{
    t.y -= 1
    t.vida--
})
textosFlutuantes = textosFlutuantes.filter(t=>t.vida>0)

particulas.forEach(p=>{
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.2
    p.vida--
})
particulas = particulas.filter(p=>p.vida>0)



    inimigos.forEach(i => i.mov_car())
    spawnInimigo()
    colisao()
    pontuacao()
    game_over()
    ver_fase()
    coracao.mov()
    spawnCoracao()
}

preloadImagens()
requestAnimationFrame(main)

let ultimoTempo = 0
let intervalo = 1000 / 200 // 60 FPS (pode mudar depois)

function main(tempoAtual) {

    if (tempoAtual - ultimoTempo < intervalo) {
        requestAnimationFrame(main)
        return
    }

    ultimoTempo = tempoAtual

    des.clearRect(0, 0, 1200, 700)

    desenha()

    if (estado === "jogo") {
        atualiza()
    }

    requestAnimationFrame(main)
}

main()