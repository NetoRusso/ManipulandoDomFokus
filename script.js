const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const startPauseBt = document.querySelector('#start-pause');
const musicaFocoInput = document.querySelector('#alternar-musica')
const musica = new Audio('./sons/luna-rise-part-one.mp3');
const iniciarOuPausarBt = document.querySelector('#start-pause span');
const tempoNaTela = document.querySelector('#timer');

const iniciarOuPausarIcon = document.querySelector('.app__card-primary-butto-icon');
const musicaAcabou = new Audio('./sons/beep.mp3');
const musicaPause = new Audio('./sons/pause.mp3');
const musicaPlay = new Audio('./sons/play.wav');

let tempoDecorridoEmSegundos = 1800;
let intervaloId = null;

musica.loop = true;

musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play()
    } else {
        musica.pause()
    }
});

focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1800;
    alterarContexto('foco');
    focoBt.classList.add('active');
});

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 600;
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
});

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1800;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
});

function alterarContexto(contexto) {
    zerar();
    mostrarTempo();
    botoes.forEach((contexto) => {
        contexto.classList.remove('active');
    });
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `./imagens/${contexto}.png`);

    switch (contexto){
        case "foco":
            titulo.innerHTML = `
            Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            break;
        case "descanso-curto":
            titulo.innerHTML = `
            Que tal dar uma respirada?<br>
            <strong class="app__title-strong"> Faça uma pausa curta!</strong>
            `
            break;
        case "descanso-longo":
            titulo.innerHTML = `
            Hora de voltar à superfície.<br>
            <strong class="app__title-strong"> Faça uma pausa longa.</strong>
            `
        default:
            break;
    }

    iniciarOuPausarBt.textContent ='começar';
    iniciarOuPausarIcon.setAttribute('src', './imagens/play_arrow.png')
};

const contagemRegressiva = () => {
    if(tempoDecorridoEmSegundos <= 0) {
        musicaAcabou.play();
        zerar();
        return
    }
    tempoDecorridoEmSegundos -= 1;
    console.log('Temporizador: '+ tempoDecorridoEmSegundos);
    mostrarTempo();
};

startPauseBt.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    if(intervaloId){
        zerar()
        musicaPause.play();
        return
    }
    musicaPlay.play();
    iniciarOuPausarIcon.setAttribute('src', './imagens/pause.png')
    iniciarOuPausarBt.textContent ='Pausar'
    intervaloId = setInterval(contagemRegressiva, 1000);
};

function zerar() {
    clearInterval(intervaloId);
    iniciarOuPausarIcon.setAttribute('src', './imagens/play_arrow.png')
    iniciarOuPausarBt.textContent = "Retomar"
    intervaloId = null;
};

function mostrarTempo(){
    const tempo = new Date(tempoDecorridoEmSegundos * 1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'})
    tempoNaTela.innerHTML = `${tempoFormatado}`
}

mostrarTempo();

//Eu amo a Milena