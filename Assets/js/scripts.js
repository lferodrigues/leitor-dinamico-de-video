// Atualiza o ano no rodapé
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Configuração dos vídeos
const videoFiles = [];
const maxVideos = 3;
const videoDirectory = 'Assets/media/';

for (let i = 1; i <= maxVideos; i++) {
    videoFiles.push(`${videoDirectory}video${i}.mp4`);
}

let currentVideoIndex = 0;

const videoPlayer = document.getElementById('videoPlayer');
const infoText = document.getElementById('info-text');

// Função para carregar o próximo vídeo
function loadNextVideo() {
    if (currentVideoIndex >= videoFiles.length) {
        currentVideoIndex = 0; // Reinicia no primeiro vídeo
    }
    videoPlayer.src = videoFiles[currentVideoIndex];
    videoPlayer.play();
    currentVideoIndex++;
}

// Evento para avançar automaticamente ao próximo vídeo quando o atual terminar
videoPlayer.addEventListener('ended', loadNextVideo);

// Função para buscar cotação do dólar
async function fetchDollarRate() {
    try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!response.ok) {
            throw new Error('Erro ao acessar a API de cotação');
        }
        const data = await response.json();

        // Verifica se a taxa BRL existe no retorno
        if (data.rates && data.rates.BRL) {
            const dollarRate = data.rates.BRL.toFixed(2);
            return `💵 Dólar: R$ ${dollarRate}`;
        } else {
            throw new Error('Taxa BRL não encontrada no retorno da API');
        }
    } catch (error) {
        console.error('Erro ao buscar cotação do dólar:', error);
        return '💵 Dólar: Informação indisponível';
    }
}

// Função para buscar clima de São João Nepomuceno, MG
async function fetchWeather() {
    try {
        // URL para buscar o clima da cidade
        const url = `https://wttr.in/Sao+Joao+Nepomuceno?format=%C+%t&lang=pt`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Erro ao acessar a API do clima');
        }

        const weatherData = await response.text();
        return `☁️ Clima: ${weatherData}`;
    } catch (error) {
        console.error('Erro ao buscar clima:', error);
        return '☁️ Clima: Informação indisponível';
    }
}

// Função principal para atualizar informações
async function fetchInfo() {
    try {
        const dollarInfo = await fetchDollarRate();
        const weatherInfo = await fetchWeather();
        infoText.textContent = `${dollarInfo} | ${weatherInfo}`;
    } catch (error) {
        console.error('Erro ao buscar informações:', error);
        infoText.textContent = 'Erro ao buscar informações.';
    }
}

// Atualiza informações a cada 8 segundos
setInterval(fetchInfo, 8000);

// Carrega o primeiro vídeo ao iniciar e busca informações
loadNextVideo();
fetchInfo();
