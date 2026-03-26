// let des = document.getElementById('des').getContext('2d')
let canvas = document.getElementById('des')
console.log(canvas)

let des = canvas.getContext('2d')
console.log(des)


let fundo = new Image()
fundo.src = './imgs/fundo1.png'

let imgGameOver = new Image()
imgGameOver.src = './imgs/game_over.png'

let imgP1Win = new Image()
imgP1Win.src = './imgs/player_1_win.png'

let imgP2Win = new Image()
imgP2Win.src = './imgs/player_2_win.png'

let chao = 600

let cascaBanana = new Inimigos(0, 0, 60, 40, './imgs/cascaBanana.png')
let coneTransito = new Inimigos(0, 0, 70, 80, './imgs/coneTransito.png')
let hidrante = new Inimigos(0, 0, 80, 90, './imgs/hidrante.png')
let lixo = new Inimigos(0, 0, 80, 70, './imgs/lixo.png')

let inimigos = [cascaBanana, coneTransito, hidrante, lixo]

let skatistaM = new GarotoSkatista(100, 180, 180, 160, './imgs/skatista_parado_M.png', "M")
let skatistaF = new GarotoSkatista(300, 180, 180, 160, './imgs/skatista_parado_F.png', "F")

// 🔥 PLAYER ATUAL (singleplayer)
let playerAtual = skatistaM

let t1 = new Text()
let t2 = new Text()
let fase_txt = new Text()

// 🔥 MENU
let estado = "menu"
let modo = ""
let personagemEscolhido = "M"

// 🔥 SONS
let somAndar = new Audio('./imgs/som_skate_andando.mp3')
let somPulo = new Audio('./imgs/som_skate_pulando.mp3')
let somBatida = new Audio('./imgs/metal_pipe.mp3')
let somGameOver = new Audio('./imgs/som_gameover.mp3')

somAndar.loop = true
somAndar.volume = 0.3

somPulo.volume = 0.3
somBatida.volume = 0.4
somGameOver.volume = 0.6

let jogar = true
let fase = 1

let maxInimigos = 1
let distanciaMinima = 400

// 🔥 CONTROLES
document.addEventListener('keydown', (e) => {

    if(estado === "menu"){
        if(e.key === "1"){
            modo = "single"
            estado = "menu_personagem"
        }
        if(e.key === "2"){
            modo = "multi"
            estado = "jogo"

            skatistaM.x = 100
            skatistaF.x = 300
        }
        return
    }

    if(estado === "menu_personagem"){
        if(e.key === "1"){
            personagemEscolhido = "M"
            playerAtual = skatistaM
            estado = "jogo"
        }
        if(e.key === "2"){
            personagemEscolhido = "F"
            playerAtual = skatistaF
            estado = "jogo"
        }
        return
    }

    if (
        e.key === 'a' || e.key === 'd' ||
        e.key === 'ArrowLeft' || e.key === 'ArrowRight'
    ){
        if (somAndar.paused) somAndar.play()
    }

    // PLAYER M (setas)
    if (e.key === 'ArrowLeft') skatistaM.velX = -5
    if (e.key === 'ArrowRight') skatistaM.velX = 5

    if (e.key === 'ArrowUp' && !skatistaM.pulando) {
        skatistaM.velY = -18
        skatistaM.pulando = true
        somPulo.currentTime = 0
        somPulo.play()
    }

    // PLAYER F (WASD)
    if (e.key === 'a') skatistaF.velX = -5
    if (e.key === 'd') skatistaF.velX = 5

    if (e.key === 'w' && !skatistaF.pulando) {
        skatistaF.velY = -18
        skatistaF.pulando = true
        somPulo.currentTime = 0
        somPulo.play()
    }
})

document.addEventListener('keyup', (e) => {

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') skatistaM.velX = 0
    if (e.key === 'a' || e.key === 'd') skatistaF.velX = 0

    if (
        e.key === 'a' || e.key === 'd' ||
        e.key === 'ArrowLeft' || e.key === 'ArrowRight'
    ){
        somAndar.pause()
        somAndar.currentTime = 0
    }
})


// 🔥 👇 COLE AQUI 👇
document.addEventListener('click', (e) => {

    let x = e.offsetX
    let y = e.offsetY

    // MENU
    if(estado === "menu"){

        if(x > 450 && x < 750 && y > 320 && y < 370){
            modo = "single"
            estado = "menu_personagem"
        }

        if(x > 450 && x < 750 && y > 390 && y < 440){
            modo = "multi"
            estado = "jogo"

            skatistaM.x = 100
            skatistaF.x = 300
        }
    }

    // ESCOLHA PERSONAGEM
    else if(estado === "menu_personagem"){

        if(x > 450 && x < 750 && y > 320 && y < 370){
            playerAtual = skatistaM
            estado = "jogo"
        }

        if(x > 450 && x < 750 && y > 390 && y < 440){
            playerAtual = skatistaF
            estado = "jogo"
        }
    }

})

// SPAWN
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
                let aleatorio = inativos[Math.floor(Math.random()*inimigos.length)]
                aleatorio.recomeca()
            }
        }
    }
}

// 🔥 GAME OVER + VENCEDOR
let vencedor = ""

function game_over() {

    if(modo === "single"){
        if(playerAtual.vida <= 0){
            jogar = false
            vencedor = "GAME OVER"
        }
    }

    if(modo === "multi"){
        if(skatistaM.vida <= 0){
            jogar = false
            vencedor = "PLAYER F VENCEU!"
        }

        if(skatistaF.vida <= 0){
            jogar = false
            vencedor = "PLAYER M VENCEU!"
        }
    }

    if(!jogar){
        somAndar.pause()
        somGameOver.currentTime = 0
        somGameOver.play()
    }
}

function ver_fase() { 
    let pontosRef = (modo === "single") ? playerAtual.pontos : skatistaM.pontos

    if (pontosRef > 20 && fase === 1) {
        fase = 2
        maxInimigos = 2
        inimigos.forEach(i => i.vel = 8)
        fundo.src = './imgs/fundo2.png'
    }
    else if (pontosRef > 50 && fase === 2) {
        fase = 3
        maxInimigos = 3
        inimigos.forEach(i => i.vel = 10)
        fundo.src = './imgs/fundo3.png'
    }
    else if (pontosRef > 80 && fase === 3) {
        fase = 4
        maxInimigos = 4
        inimigos.forEach(i => i.vel = 12)
        fundo.src = './imgs/fundo4.png'
    }
}

function colisao() {
    inimigos.forEach(i => {

        if(i.ativo && skatistaM.colid(i)){
            somBatida.play()
            i.ativo = false
            skatistaM.vida -= 1
        }

        if(i.ativo && skatistaF.colid(i)){
            somBatida.play()
            i.ativo = false
            skatistaF.vida -= 1
        }
    })
}

function pontuacao() {
    inimigos.forEach(i => {
        if(i.ativo && skatistaM.point(i)){
            skatistaM.pontos += 5
            i.ativo = false
        }

        if(i.ativo && skatistaF.point(i)){
            skatistaF.pontos += 5
            i.ativo = false
        }
    })
}

// MENUS
function desenhaMenu(){
    des.fillStyle = "black"
    des.fillRect(0, 0, 1200, 700)

    des.fillStyle = "#00FFAA"
    des.font = "60px Impact"
    des.fillText("SKATE GAME", 380, 200)

    des.font = "30px Impact"
    des.fillText("1 - Singleplayer", 450, 350)
    des.fillText("2 - Multiplayer", 450, 420)
}

function desenhaEscolha(){
    des.fillStyle = "black"
    des.fillRect(0, 0, 1200, 700)

    des.fillStyle = "#FF00AA"
    des.font = "50px Impact"
    des.fillText("ESCOLHA O PERSONAGEM", 300, 200)

    des.font = "30px Impact"
    des.fillText("1 - Skatista M", 450, 350)
    des.fillText("2 - Skatista F", 450, 420)
}

// DESENHA
function desenha() {

    const fonte = new FontFace('QuinqueFive', 'url(./fonts/QuinqueFive.ttf)');

    fonte.load().then(function(font){
    document.fonts.add(font);
});

    if (estado === "menu"){
        desenhaMenu()
        return
    }

    des.fillStyle = "red"
    des.fillRect(100,100,100,100)

    if (estado === "menu_personagem"){
        desenhaEscolha()
        return
    }

    if (fundo.complete) {
        des.drawImage(fundo, 0, 0, 1200, 700)
    }

    if (jogar) {

        inimigos.forEach(i => {
            if(i.ativo) i.des_carro()
        })

        if(modo === "single"){
            playerAtual.des_carro()

            t1.des_text('Pontos: ' + playerAtual.pontos, 1000, 40, '#FFFFFF', '28px Impact')
            t2.des_text('Vidas: ' + playerAtual.vida, 40, 40, '#FFFFFF', '28px Impact')
        }

        if(modo === "multi"){
            skatistaM.des_carro()
            skatistaF.des_carro()

            t1.des_text('P1: ' + skatistaM.pontos, 900, 40, '#00FFFF', '24px Impact')
            t2.des_text('P1 Vida: ' + skatistaM.vida, 40, 40, '#00FFFF', '24px Impact')

            t1.des_text('P2: ' + skatistaF.pontos, 900, 80, '#FF00AA', '24px Impact')
            t2.des_text('P2 Vida: ' + skatistaF.vida, 40, 80, '#FF00AA', '24px Impact')
        }

        fase_txt.des_text('Fase: ' + fase, 550, 40, '#FFFFFF', '28px Impact')

    } else {

    // 🔥 DESFOCA O FUNDO
    des.filter = "blur(5px)"
    if (fundo.complete) {
        des.drawImage(fundo, 0, 0, 1200, 700)
    }
    des.filter = "none"

    // 🔥 CAMADA ESCURA
    des.fillStyle = "rgba(0,0,0,0.5)"
    des.fillRect(0, 0, 1200, 700)

    // =========================
    // 🔥 SINGLEPLAYER
    // =========================
    if(modo === "single"){

        let larguraImg = 500
        let alturaImg = 500

        let xCentro = (1200 / 2) - (larguraImg / 2)
        let yCentro = 80

        if(imgGameOver.complete){
            des.drawImage(imgGameOver, xCentro, yCentro, larguraImg, alturaImg)
        }

        des.textAlign = "center"

        t1.des_text(
            'Pontuação final: ' + playerAtual.pontos,
            1200/2,
            yCentro + alturaImg - 20,
            '#000000',
            '25px QuinqueFive',
            '#ffdae7'
        )

        des.textAlign = "start"
    }

    // =========================
    // 🔥 MULTIPLAYER
    // =========================
    else if(modo === "multi"){

        let larguraImg = 500
        let alturaImg = 400

        let xCentro = (1200 / 2) - (larguraImg / 2)
        let yCentro = 120

        // 🔥 IMAGENS DE VITÓRIA
            if(imgP1Win.complete){
                des.drawImage(imgP1Win, xCentro, yCentro, larguraImg, alturaImg)
            }
        
            if(imgP2Win.complete){
                des.drawImage(imgP2Win, xCentro, yCentro, larguraImg, alturaImg)
            }
        

        // 🔥 TEXTO CENTRALIZADO
        des.textAlign = "center"


        // 🔥 PONTUAÇÃO DOS DOIS (ESTILO IGUAL AO SINGLE)
    t1.des_text(
        'Pontuacao Player 1: ' + skatistaM.pontos,
        1200/2,
        yCentro + alturaImg + 80,
        '#000000',
        '25px QuinqueFive',
        '#ffdae7'
)

    t1.des_text(
        'Pontuacao Player 2: ' + skatistaF.pontos,
        1200/2,
        yCentro + alturaImg + 120,
        '#000000',
        '25px QuinqueFive',
        '#ffdae7'
)

        des.textAlign = "start"
        }
    }
}

// ATUALIZA
function atualiza() {
    if (jogar) {

        if(modo === "single"){
            playerAtual.mov_car()
            playerAtual.atualizaAnimacao()
        }

        if(modo === "multi"){
            skatistaM.mov_car()
            skatistaM.atualizaAnimacao()

            skatistaF.mov_car()
            skatistaF.atualizaAnimacao()
        }

        inimigos.forEach(i => i.mov_car())

        spawnInimigo()

        colisao()
        pontuacao()
        game_over()
        ver_fase()
    }
}

// LOOP
function main() {
    console.log("rodando") // 🔥 teste
    des.clearRect(0, 0, 1200, 700)

    desenha()

    if(estado === "jogo"){
        atualiza()
    }

    requestAnimationFrame(main)
}

main()