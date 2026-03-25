let des = document.getElementById('des').getContext('2d')

let fundo = new Image()
fundo.src = './imgs/fundo1.png'

let chao = 600

let cascaBanana = new Inimigos(0, 0, 60, 40, './imgs/cascaBanana.png')
let coneTransito = new Inimigos(0, 0, 70, 80, './imgs/coneTransito.png')
let hidrante = new Inimigos(0, 0, 80, 90, './imgs/hidrante.png')
let lixo = new Inimigos(0, 0, 80, 70, './imgs/lixo.png')

let inimigos = [cascaBanana, coneTransito, hidrante, lixo]

let skatistaM = new GarotoSkatista(100, 180, 180, 160, './imgs/animacao_skatista_1_M.png')

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

    // MENU
    if(estado === "menu"){
        if(e.key === "1"){
            modo = "single"
            estado = "menu_personagem"
        }
        if(e.key === "2"){
            modo = "multi"
            estado = "jogo"
        }
        return
    }

    // ESCOLHA PERSONAGEM
    if(estado === "menu_personagem"){
        if(e.key === "1"){
            personagemEscolhido = "M"
            estado = "jogo"
        }
        if(e.key === "2"){
            personagemEscolhido = "F"
            estado = "jogo"
        }
        return
    }

    // SOM ANDANDO
    if (
        (e.key === 'a' || e.key === 'ArrowLeft' ||
         e.key === 'd' || e.key === 'ArrowRight')
    ){
        if (somAndar.paused) {
            somAndar.play()
        }
    }

    // PULO
    if ((e.key === 'w' || e.key === 'ArrowUp') && !skatistaM.pulando) {
        skatistaM.velY = -18
        skatistaM.pulando = true

        somPulo.currentTime = 0
        somPulo.play()
    }

    if (e.key === 'a' || e.key === 'ArrowLeft') {
        skatistaM.velX = -5
    }

    if (e.key === 'd' || e.key === 'ArrowRight') {
        skatistaM.velX = 5
    }
})

document.addEventListener('keyup', (e) => {
    if (
        e.key === 'a' || e.key === 'ArrowLeft' ||
        e.key === 'd' || e.key === 'ArrowRight'
    ){
        skatistaM.velX = 0

        somAndar.pause()
        somAndar.currentTime = 0
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
                let aleatorio = inativos[Math.floor(Math.random()*inativos.length)]
                aleatorio.recomeca()
            }
        }
    }
}

function game_over() {
    if (skatistaM.vida <= 0) {
        jogar = false
        somAndar.pause()
        somGameOver.play()
    }
}

function ver_fase() { 
    if (skatistaM.pontos > 20 && fase === 1) {
        fase = 2
        maxInimigos = 2
        inimigos.forEach(i => i.vel = 8)
        fundo.src = './imgs/fundo2.png'
    }
    else if (skatistaM.pontos > 50 && fase === 2) {
        fase = 3
        maxInimigos = 3
        inimigos.forEach(i => i.vel = 10)
        fundo.src = './imgs/fundo3.png'
    }
    else if (skatistaM.pontos > 80 && fase === 3) {
        fase = 4
        maxInimigos = 4
        inimigos.forEach(i => i.vel = 12)
        fundo.src = './imgs/fundo4.png'
    }
}

function colisao() {
    inimigos.forEach(i => {
        if(i.ativo && skatistaM.colid(i)){
            somBatida.currentTime = 0
            somBatida.play()

            i.ativo = false
            skatistaM.vida -= 1
        }
    })
}

function pontuacao() {
    inimigos.forEach(i => {
        if(i.ativo && skatistaM.point(i)){
            skatistaM.pontos += 5
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

    if (fundo.complete) {
        des.drawImage(fundo, 0, 0, 1200, 700)
    }

    if (estado === "menu"){
        desenhaMenu()
        return
    }

    if (estado === "menu_personagem"){
        desenhaEscolha()
        return
    }

    if (jogar) {

        inimigos.forEach(i => {
            if(i.ativo){
                i.des_carro()
            }
        })

        skatistaM.des_carro()

        t1.des_text('Pontos: ' + skatistaM.pontos, 1000, 40, '#FFFFFF', '28px Impact')
        t2.des_text('Vidas: ' + skatistaM.vida, 40, 40, '#FFFFFF', '28px Impact')
        fase_txt.des_text('Fase: ' + fase, 550, 40, '#FFFFFF', '28px Impact')

    }else{
        t1.des_text('GAME OVER', 450, 350, '#FF0055', '80px Impact')
        t2.des_text('Pontuação Final: ' + skatistaM.pontos, 480, 400, '#FFFFFF', '30px Impact')
    }   
}

// ATUALIZA
function atualiza() {
    if (jogar) {

        skatistaM.mov_car()
        skatistaM.atualizaAnimacao()

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
    des.clearRect(0, 0, 1200, 700)

    desenha()

    if(estado === "jogo"){
        atualiza()
    }

    requestAnimationFrame(main)
}

main()