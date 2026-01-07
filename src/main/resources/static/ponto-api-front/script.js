const API_URL = 'http://localhost:8080/api/tarefas';
const listaTarefasElement = document.getElementById('lista-tarefas');

// Formulários
const formCriar = document.getElementById('form-criar-tarefa');
const formEditar = document.getElementById('form-editar-tarefa');

// Elementos de Pesquisa
const filtroTituloInput = document.getElementById('filtro-titulo');
const filtroStatusSelect = document.getElementById('filtro-status');
const btnPesquisar = document.getElementById('btn-pesquisar');

// Elementos de Ordenação
const ordenarLabel = document.getElementById('ordenar-label');
const ordenarMenu = document.getElementById('ordenar-menu');
let criterioOrdenacao = 'data';

// Elementos de Exclusão (Modal Fóton)
const btnConfirmarExclusao = document.getElementById('btn-confirmar-exclusao');
const inputExcluirId = document.getElementById('excluir-tarefa-id');
const labelExcluirTitulo = document.getElementById('excluir-tarefa-titulo');

// Armazenamento local das tarefas para ordenação rápida
let tarefasCarregadas = [];

/**
 * Renderiza a LI mantendo o seu modelo original
 */
function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = tarefa.idTarefa;

    // Verifica se a tarefa está concluída (ID 2)
    const isConcluida = tarefa.statusTarefa?.idStatusTarefa === 2;

    // Aplica o efeito "mutado/desvanecido" se estiver concluída
    if (isConcluida) {
        li.style.opacity = '0.8';
        li.style.filter = 'grayscale(0.5)';
        li.style.transition = 'all 0.3s ease';
    }

    let badgeColorPrioridade = 'ft-badge-neutral';
    if (tarefa.prioridadeTarefa?.descricaoPrioridade) {
        const desc = tarefa.prioridadeTarefa.descricaoPrioridade.toLowerCase();
        if (desc.includes('média')) badgeColorPrioridade = 'ft-badge-warning';
        else if (desc.includes('alta')) badgeColorPrioridade = 'ft-badge-danger';
    }

    let badgeColorStatus = 'ft-badge-neutral';
    if (tarefa.statusTarefa?.descricaoStatus) {
        const desc = tarefa.statusTarefa.descricaoStatus.toLowerCase();
        if (desc.includes('pendente')) badgeColorStatus = 'ft-badge-warning';
        else if (desc.includes('andamento')) badgeColorStatus = 'ft-badge-info';
        else if (desc.includes('concluida')) badgeColorStatus = 'ft-badge-success';
    }

    const dataFormatada = tarefa.dataVencimento
        ? new Date(tarefa.dataVencimento + 'T00:00:00').toLocaleDateString('pt-BR')
        : 'Sem Data';

    li.innerHTML = `
        <div class="task-body">
            <div class="task-header">
                <h5 class="task-title" style="cursor: pointer; ${isConcluida ? 'text-decoration: line-through;' : ''}" title="Clique para visualizar detalhes">${tarefa.titulo}</h5>
                <div>
                    <span class="ft-badge ft-badge-pill ${badgeColorPrioridade}">
                        ${tarefa.prioridadeTarefa?.descricaoPrioridade || 'N/A'}
                    </span>
                    <span class="ft-badge ft-badge-pill ${badgeColorStatus}">
                        ${tarefa.statusTarefa?.descricaoStatus || 'N/A'}
                    </span>
                </div>
            </div>
            <p class="task-description">${tarefa.descricao}</p>
            <p style="color: var(--txt-sec); font-size: 0.8em;">Data: ${dataFormatada}</p>
        </div>
        <div class="task-buttons">
            <button class="ft-btn ft-btn-sm ft-btn-outline-success btn-concluir" ${isConcluida ? 'disabled' : ''}>
                <i class="fa-solid ${isConcluida ? 'fa-check-double' : 'fa-check'}"></i>
                <p>${isConcluida ? 'Concluída' : 'Concluir'}</p>
            </button>
            <button class="ft-btn ft-btn-sm ft-btn-outline-warning btn-editar">
                <i class="fa-solid fa-pen"></i>
                <p>Editar</p>
            </button>
            <button class="ft-btn ft-btn-sm ft-btn-outline-danger btn-excluir">
                <i class="fa-solid fa-trash"></i>
                <p>Excluir</p>
            </button>
        </div>
    `;

    // Evento de Visualizar ao clicar no título
    li.querySelector('.task-title').addEventListener('click', () => abrirModalVisualizar(tarefa.idTarefa));
    
    // Evento de Concluir Tarefa
    li.querySelector('.btn-concluir').addEventListener('click', () => concluirTarefa(tarefa.idTarefa));
    
    // Eventos de Editar e Excluir
    li.querySelector('.btn-editar').addEventListener('click', () => abrirModalEditar(tarefa.idTarefa));
    li.querySelector('.btn-excluir').addEventListener('click', () => prepararExclusao(tarefa.idTarefa, tarefa.titulo));

    return li;
}

/**
 * Prepara o modal de exclusão com os dados da tarefa
 */
function prepararExclusao(id, titulo) {
    if (inputExcluirId && labelExcluirTitulo) {
        inputExcluirId.value = id;
        labelExcluirTitulo.innerText = titulo;
        Foton.toggleModal('modalExcluir', true);
    }
}

/**
 * Executa a exclusão definitiva via API
 */
async function executarExclusao() {
    const id = inputExcluirId.value;
    if (!id) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            Foton.toggleModal('modalExcluir', false);
            carregarTarefas();
            Foton.showToast("Tarefa excluída com sucesso!");
        }
    } catch (error) {
        console.error("Erro ao excluir:", error);
    }
}

// Evento do botão confirmar do modal de exclusão
if (btnConfirmarExclusao) {
    btnConfirmarExclusao.addEventListener('click', executarExclusao);
}

/**
 * Ordena e exibe as tarefas com base no critério selecionado
 */
function ordenarEExibirTarefas() {
    const criterio = criterioOrdenacao;
    
    tarefasCarregadas.sort((a, b) => {
        if (criterio === 'titulo') {
            return a.titulo.localeCompare(b.titulo);
        } else if (criterio === 'data') {
            if (!a.dataVencimento) return 1;
            if (!b.dataVencimento) return -1;
            return new Date(a.dataVencimento) - new Date(b.dataVencimento);
        } else if (criterio === 'prioridade') {
            const pA = a.prioridadeTarefa?.idPrioridadeTarefa || 99;
            const pB = b.prioridadeTarefa?.idPrioridadeTarefa || 99;
            return pA - pB;
        }
        return 0;
    });

    listaTarefasElement.innerHTML = '';
    tarefasCarregadas.forEach(t => listaTarefasElement.appendChild(criarElementoTarefa(t)));
}

// Função para marcar tarefa como concluída (Status ID 2)
async function concluirTarefa(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const t = await res.json();
        
        const tarefaEditada = {
            titulo: t.titulo,
            descricao: t.descricao,
            dataVencimento: t.dataVencimento,
            prioridadeTarefa: { idPrioridadeTarefa: t.prioridadeTarefa.idPrioridadeTarefa },
            statusTarefa: { idStatusTarefa: 2 } // 2 = Concluída
        };

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tarefaEditada)
        });

        if (response.ok) {
            carregarTarefas();
        }
    } catch (error) {
        console.error("Erro ao concluir tarefa:", error);
    }
}

// Carrega tarefas utilizando o endpoint de busca.
async function carregarTarefas() {
    if (!filtroTituloInput || !filtroStatusSelect) return;

    const titulo = filtroTituloInput.value.trim();
    const status = filtroStatusSelect.value;

    try {
        const params = new URLSearchParams();
        if (titulo) params.append('titulo', titulo);
        if (status) params.append('status', status);

        const url = `${API_URL}/buscar?${params.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            listaTarefasElement.innerHTML = '<li class="ft-text-muted" style="padding: 1em;">Nenhum resultado encontrado.</li>';
            tarefasCarregadas = [];
            return;
        }

        tarefasCarregadas = await response.json();
        
        if (!tarefasCarregadas || tarefasCarregadas.length === 0) {
            listaTarefasElement.innerHTML = '<li class="ft-text-muted" style="padding: 1em;">Nenhuma tarefa encontrada.</li>';
            return;
        }

        ordenarEExibirTarefas();
    } catch (e) {
        console.error("Erro na requisição:", e);
        listaTarefasElement.innerHTML = '<li class="ft-badge-danger" style="padding: 1em; list-style:none;">Erro ao conectar com o servidor.</li>';
    }
}

// --- EVENTOS DE PESQUISA ---

if (filtroTituloInput) {
    filtroTituloInput.addEventListener('input', () => carregarTarefas());
}

if (filtroStatusSelect) {
    filtroStatusSelect.addEventListener('change', () => carregarTarefas());
}

if (btnPesquisar) {
    btnPesquisar.addEventListener('click', () => carregarTarefas());
}

// Evento de Ordenação (Dropdown Fóton)
if (ordenarMenu) {
    ordenarMenu.querySelectorAll('.ft-dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            criterioOrdenacao = item.dataset.sort;
            if (ordenarLabel) ordenarLabel.innerText = item.innerText;
            ordenarEExibirTarefas();
            if (typeof Foton !== 'undefined') Foton.closeAllPopovers();
        });
    });
}

// --- LOGICA MODAL CRIAR ---
formCriar.addEventListener('submit', async (e) => {
    e.preventDefault();
    const novaTarefa = {
        titulo: document.getElementById('addTitulo').value,
        descricao: document.getElementById('addDescricao').value,
        dataVencimento: document.getElementById('addData').value,
        prioridadeTarefa: { idPrioridadeTarefa: parseInt(document.getElementById('addPrioridade').value) },
        statusTarefa: { idStatusTarefa: parseInt(document.getElementById('addStatus').value) }
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaTarefa)
        });

        if (response.ok) {
            Foton.toggleModal('modalCriar', false);
            formCriar.reset();
            
            if (filtroTituloInput) filtroTituloInput.value = '';
            if (filtroStatusSelect) filtroStatusSelect.value = '';
            
            carregarTarefas();
        }
    } catch (error) {
        console.error("Erro ao criar:", error);
    }
});

// --- LOGICA MODAL EDITAR ---
async function abrirModalEditar(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const t = await res.json();

        document.getElementById('editId').value = t.idTarefa;
        document.getElementById('editTitulo').value = t.titulo;
        document.getElementById('editDescricao').value = t.descricao;
        document.getElementById('editData').value = t.dataVencimento;
        
        const selectP = document.getElementById('editPrioridade');
        selectP.innerHTML = `
            <option value="1" ${t.prioridadeTarefa?.idPrioridadeTarefa === 1 ? 'selected' : ''}>Alta</option>
            <option value="2" ${t.prioridadeTarefa?.idPrioridadeTarefa === 2 ? 'selected' : ''}>Média</option>
            <option value="3" ${t.prioridadeTarefa?.idPrioridadeTarefa === 3 ? 'selected' : ''}>Baixa</option>
        `;

        const selectS = document.getElementById('editStatus');
        selectS.innerHTML = `
            <option value="1" ${t.statusTarefa?.idStatusTarefa === 1 ? 'selected' : ''}>Pendente</option>
            <option value="3" ${t.statusTarefa?.idStatusTarefa === 3 ? 'selected' : ''}>Em Andamento</option>
            <option value="2" ${t.statusTarefa?.idStatusTarefa === 2 ? 'selected' : ''}>Concluída</option>
        `;

        Foton.toggleModal('modalEditar', true);
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

formEditar.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const tarefaEditada = {
        titulo: document.getElementById('editTitulo').value,
        descricao: document.getElementById('editDescricao').value,
        dataVencimento: document.getElementById('editData').value,
        prioridadeTarefa: { idPrioridadeTarefa: parseInt(document.getElementById('editPrioridade').value) },
        statusTarefa: { idStatusTarefa: parseInt(document.getElementById('editStatus').value) }
    };

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tarefaEditada)
        });

        if (response.ok) {
            Foton.toggleModal('modalEditar', false);
            carregarTarefas();
        }
    } catch (error) {
        console.error("Erro ao editar:", error);
    }
});

// --- LOGICA MODAL VISUALIZAR ---
async function abrirModalVisualizar(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const t = await res.json();

        let bP = 'ft-badge-neutral';
        if (t.prioridadeTarefa?.descricaoPrioridade?.toLowerCase().includes('média')) bP = 'ft-badge-warning';
        else if (t.prioridadeTarefa?.descricaoPrioridade?.toLowerCase().includes('alta')) bP = 'ft-badge-danger';

        let bS = 'ft-badge-neutral';
        if (t.statusTarefa?.descricaoStatus?.toLowerCase().includes('pendente')) bS = 'ft-badge-warning';
        else if (t.statusTarefa?.descricaoStatus?.toLowerCase().includes('andamento')) bS = 'ft-badge-info';
        else if (t.statusTarefa?.descricaoStatus?.toLowerCase().includes('concluida')) bS = 'ft-badge-success';

        document.getElementById('view-content').innerHTML = `
            <h2 class="ft-text-primary">${t.titulo}</h2>
            <hr style="margin: 10px 0; border-color: var(--border-color);">
            <p><strong>Descrição:</strong> ${t.descricao}</p>
            <p><strong>Vencimento:</strong> ${t.dataVencimento || 'Sem Data'}</p>
            <p><strong>Prioridade:</strong> <span class="ft-badge ft-badge-pill ${bP}">${t.prioridadeTarefa?.descricaoPrioridade || 'N/A'}</span></p>
            <p><strong>Status:</strong> <span class="ft-badge ft-badge-pill ${bS}">${t.statusTarefa?.descricaoStatus || 'N/A'}</span></p>
        `;

        Foton.toggleModal('modalVisualizar', true);
    } catch (error) {
        console.error("Erro ao visualizar:", error);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => carregarTarefas());