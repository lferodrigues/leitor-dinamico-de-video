// Atualiza o ano no rodapé
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Configuração inicial de variáveis
const videoFiles = [];
let maxVideos = 3; // Valor padrão caso o usuário não forneça entrada válida
const videoDirectory = 'Assets/media/';

let currentVideoIndex = 0;

const videoPlayer = document.getElementById('videoPlayer');
const infoText = document.getElementById('info-text');

// Garante que o vídeo esteja mudo para permitir reprodução automática
videoPlayer.muted = true;

// Pergunta ao usuário a quantidade de vídeos desejada
function askVideoCount() {
    let userInput = prompt("Quantos vídeos deseja passar? (1 a 100)");

    // Valida a entrada do usuário
    const parsedInput = parseInt(userInput, 10);
    if (!isNaN(parsedInput) && parsedInput >= 1 && parsedInput <= 100) {
        maxVideos = parsedInput; // Atualiza o número máximo de vídeos
    } else {
        alert("Entrada inválida! O número de vídeos será ajustado para o padrão: 3.");
    }

    // Após validar, inicializa os vídeos e inicia o primeiro
    initializeVideoFiles();
    loadNextVideo(); // Inicia automaticamente o primeiro vídeo
}

// Inicializa a lista de vídeos com base na quantidade definida
function initializeVideoFiles() {
    for (let i = 1; i <= maxVideos; i++) {
        videoFiles.push(`${videoDirectory}video${i}.mp4`);
    }
}

// Função para carregar o próximo vídeo
function loadNextVideo() {
    if (currentVideoIndex >= videoFiles.length) {
        currentVideoIndex = 0; // Reinicia no primeiro vídeo
    }
    videoPlayer.src = videoFiles[currentVideoIndex];
    videoPlayer.play().catch((error) => {
        console.error('Erro ao reproduzir o vídeo:', error);
    });
    currentVideoIndex++;
}

// Evento para avançar automaticamente ao próximo vídeo quando o atual terminar
videoPlayer.addEventListener('ended', loadNextVideo);

// Função para buscar cotação do dólar com AwesomeAPI
async function fetchDollarRate() {
    try {
        const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL');
        if (!response.ok) {
            throw new Error('Erro ao acessar a API de cotação');
        }
        const data = await response.json();

        // Acessa a taxa de câmbio na estrutura da AwesomeAPI
        if (data.USDBRL && data.USDBRL.bid) {
            const dollarRate = parseFloat(data.USDBRL.bid).toFixed(2);
            return `💵 Dólar: R$ ${dollarRate}`;
        } else {
            throw new Error('Dados não encontrados na resposta da API');
        }
    } catch (error) {
        console.error('Erro ao buscar cotação do dólar:', error);
        return '💵 Dólar: Informação indisponível';
    }
}

// Função para buscar clima com base na localização do dispositivo usando IP (sem chave de API)
async function fetchWeatherByIp() {
    try {
        // Acessa a API de geolocalização por IP (ip-api.com)
        const ipResponse = await fetch('http://ip-api.com/json');
        if (!ipResponse.ok) {
            throw new Error('Erro ao acessar a API de localização por IP');
        }

        const ipData = await ipResponse.json();

        // Log para verificar a resposta da API ip-api
        console.log("Localização por IP:", ipData);

        // Verifica se a propriedade 'loc' está presente e é válida
        if (ipData.loc && typeof ipData.loc === 'string') {
            const [lat, lon] = ipData.loc.split(','); // Divide a string "latitude,longitude"

            if (!lat || !lon) {
                throw new Error('Não foi possível obter a latitude ou longitude');
            }

            // Log para verificar as coordenadas
            console.log("Latitude:", lat, "Longitude:", lon);

            // Consulta a API OpenWeatherMap com base na localização
            const apiKey = '26825e136efd15c22b2ccf106215cc58'; // Substitua pela sua chave da OpenWeatherMap
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`;

            const weatherResponse = await fetch(url);
            if (!weatherResponse.ok) {
                throw new Error('Erro ao acessar a API do clima');
            }

            const weatherData = await weatherResponse.json();

            // Log para verificar a resposta do clima
            console.log("Dados do Clima:", weatherData);

            const description = weatherData.weather[0].description;
            const temperature = weatherData.main.temp.toFixed(1);

            return `☁️ Clima: ${description}, ${temperature}°C`;
        } else {
            throw new Error('Geolocalização inválida ou não encontrada');
        }
    } catch (error) {
        console.error('Erro ao buscar clima:', error);
        return '☁️ Clima: Informação indisponível';
    }
}

// Função principal para atualizar informações
async function fetchInfo() {
    try {
        const dollarInfo = await fetchDollarRate();
        const weatherInfo = await fetchWeatherByIp();
        infoText.textContent = `${dollarInfo} | ${weatherInfo}`;
    } catch (error) {
        console.error('Erro ao buscar informações:', error);
        infoText.textContent = 'Erro ao buscar informações.';
    }
}

// Atualiza informações a cada 8 segundos
setInterval(fetchInfo, 8000);

// Fluxo de inicialização
askVideoCount();        // Pergunta ao usuário a quantidade de vídeos
fetchInfo();            // Atualiza as informações do rodapé
