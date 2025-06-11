const urlParams = new URLSearchParams(window.location.search);
const area = urlParams.get('area');
const token = String(localStorage.getItem('token').replaceAll('"', ''));
console.log(token)

document.addEventListener('DOMContentLoaded', async function () {
    await getBrinquedos();
    await getNotificacoes();
});

const getNotificacoes = async () => {
    const response = await fetch(`http://localhost:3000/notificacoes/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token
        },
    });
    const data = await response.json()
    console.log(response);
    if (response.ok) {
        const notificacaoContent = document.querySelector('#notificationContent');
        for (var notificacao in data.Resultados) {
            console.log(notificacao)
            notificacaoContent.innerHTML = notificacaoContent.innerHTML + 
            `<p id="${notificacao}">${data.Resultados[notificacao].description} ${data.Resultados[notificacao].name}
                <button class="btn" onclick="sairFila(${data.Resultados[notificacao].id_rides}, ${notificacao})">Sair da fila</button>
            </p>`
        }
    }
}

const sairFila = async (id, pNumber) => {
    const response = await fetch(`http://localhost:3000/filas/sair/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token
        },
    });

    if (response.ok) {
        document.getElementById(`${pNumber}`).style.display = 'none';
        alert(`Você saiu da Fila!`);
    } else {
        alert(`Não foi possível sair da fila`);
    }
}

const getBrinquedos = async () => {
    const response = await fetch(`http://localhost:3000/brinquedos/area/${area}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token
        },
    });

    const data = await response.json();
    console.log(data);

    for (var brinquedo of data.resultados) {
        const grid = document.querySelector(".rides-grid");
        grid.innerHTML = grid.innerHTML + `
            <div class="ride-card">
                <div class="ride-image" style="background-image: url(${brinquedo.image})"></div>
                <div class="ride-info">
                    <h3 class="ride-name">${brinquedo.name}</h3>
                    <div class="ride-time">${brinquedo.waiting_time} min</div>
                    <span class="ride-status status-busy">${brinquedo.status}</span>
                    <button class="btn" onclick="entrarFila(${brinquedo.id}, '${brinquedo.name}')">Entrar Fila</button>
                </div>
            </div>`
    }
}

const entrarFila = async (id, nome) => {
    console.log(id, nome)
    const response = await fetch(`http://localhost:3000/filas/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token
        }
    });

    if (response.ok) {
        await getNotificacoes();
        alert(`Você entrou na fila do brinquedo ${nome}`)
    } else {
        alert(`Não foi possível entrar no brinquedo ${nome}`)
    }

    console.log(response);
}

const toggleDropdown = () => {
    const content = document.getElementById('notificationContent');
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
}

window.onclick = function (event) {
    if (!event.target.matches('.notification-btn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            dropdowns[i].style.display = "none";
        }
    }
}
