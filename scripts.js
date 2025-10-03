/* ---------- UTILITÁRIOS ---------- */
const $ = id => document.getElementById(id);

/* ---------- DADOS GLOBAIS ---------- */
const users = [
    {email:'prof@unip.br', password:'123456', name:'Prof. Ana', role:'professor'},
    {email:'aluno@unip.br', password:'123456', name:'Aluno Bruno', role:'aluno'}
];
let currentUser = null;
let turmas = [];
let alunos = [];
let atividades = [];
let entregas = [];

/* ---------- PERSISTÊNCIA DE DADOS (localStorage) ---------- */
function generateUniqueId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

function saveData() {
    localStorage.setItem('turmas', JSON.stringify(turmas));
    localStorage.setItem('alunos', JSON.stringify(alunos));
    localStorage.setItem('atividades', JSON.stringify(atividades));
    localStorage.setItem('entregas', JSON.stringify(entregas));
}

function loadData() {
    turmas = JSON.parse(localStorage.getItem('turmas') || '[]');
    alunos = JSON.parse(localStorage.getItem('alunos') || '[]');
    atividades = JSON.parse(localStorage.getItem('atividades') || '[]');
    entregas = JSON.parse(localStorage.getItem('entregas') || '[]');
}

/* ---------- LOGIN / LOGOUT ---------- */
$('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = $('emailInput').value.trim();
    const pass = $('passwordInput').value.trim();
    const user = users.find(u => u.email === email && u.password === pass);

    if(user){
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        $('errorMsg').style.display = 'none';
        loadDashboard();
    } else {
        $('errorMsg').textContent = 'Email ou RA incorretos.';
        $('errorMsg').style.display = 'block';
    }
});

function logout(){
    currentUser = null;
    localStorage.removeItem('currentUser');
    $('dashboardPage').style.display = 'none';
    $('loginPage').style.display = 'flex';
    $('loginForm').reset();
}

/* ---------- DASHBOARD E NAVEGAÇÃO ---------- */
function loadDashboard(){
    $('loginPage').style.display = 'none';
    $('dashboardPage').style.display = 'block';
    $('userName').textContent = currentUser.name;
    $('userEmail').textContent = currentUser.email;
    $('userAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
    buildMenu();
    // Inicia na seção do dashboard por padrão
    showSection('dashboardSection', document.querySelector('.menu-item'));
}

function buildMenu(){
    const menu = $('menuContainer');
    menu.innerHTML = '';
    const items = [
        {id:'dashboardSection', label:'Dashboard', icon:'📊'},
        ...(currentUser.role === 'professor' ? [
            {id:'turmasSection', label:'Turmas', icon:'📚'},
            {id:'alunosSection', label:'Alunos', icon:'👨‍🎓'},
            {id:'atividadesSection', label:'Atividades', icon:'📋'},
            {id:'notasSectionProfessor', label:'Avaliar Entregas', icon:'✅'}
        ] : [])
        // Adicionar menu do aluno aqui se necessário
    ];

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.onclick = (event) => showSection(item.id, event.currentTarget);
        div.innerHTML = `${item.icon} ${item.label}`;
        menu.appendChild(div);
    });
}

function showSection(id, menuItemElement){
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    $(id).classList.add('active');

    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    if (menuItemElement) {
        menuItemElement.classList.add('active');
    }

    // Carrega os dados da seção correspondente
    const loadFunction = {
        turmasSection: loadTurmas,
        alunosSection: loadAlunos,
        atividadesSection: loadAtividades,
        notasSectionProfessor: loadEntregas,
        dashboardSection: loadStats
    }[id];

    if (loadFunction) loadFunction();
}

/* ---------- ESTATÍSTICAS ---------- */
function loadStats(){
    const grid = $('statsGrid');
    const entregasPendentes = entregas.filter(e => e.nota === null).length;
    grid.innerHTML = `
        <div class="stat-card"><h3>Total de Turmas</h3><div class="value">${turmas.length}</div></div>
        <div class="stat-card"><h3>Total de Alunos</h3><div class="value">${alunos.length}</div></div>
        <div class="stat-card"><h3>Atividades Criadas</h3><div class="value">${atividades.length}</div></div>
        <div class="stat-card"><h3>Entregas Pendentes</h3><div class="value">${entregasPendentes}</div></div>
    `;
}

/* ---------- CRUD TURMAS ---------- */
function openAddTurmaModal(){
    openModal('Nova Turma', [
        {id:'turmaNome', label:'Nome da Turma', type:'text', required: true},
        {id:'turmaDisciplina', label:'Disciplina', type:'text', required: true},
        {id:'turmaAnoSemestre', label:'Ano/Semestre', type:'text', placeholder: 'Ex: 2025/1', required: true}
    ], data => {
        turmas.push({...data, id: generateUniqueId()});
        saveData();
        loadTurmas();
        loadStats();
    });
}

function loadTurmas(){
    const tbody = $('turmasTable').querySelector('tbody');
    tbody.innerHTML = turmas.length === 0
        ? '<tr><td colspan="4" style="text-align:center;">Nenhuma turma cadastrada.</td></tr>'
        : turmas.map(t => `
            <tr>
                <td>${t.turmaNome}</td>
                <td>${t.turmaDisciplina}</td>
                <td>${t.turmaAnoSemestre}</td>
                <td>
                    <button class="btn-small btn-edit" onclick="editTurma(${t.id})">Editar</button>
                    <button class="btn-small btn-delete" onclick="deleteTurma(${t.id})">Excluir</button>
                </td>
            </tr>
        `).join('');
}

function deleteTurma(id){
    if(confirm('Tem certeza que deseja excluir esta turma? Os alunos e atividades associados perderão a referência.')){
        turmas = turmas.filter(t => t.id !== id);
        saveData();
        loadTurmas();
        loadStats();
    }
}

function editTurma(id){
    const t = turmas.find(x => x.id === id);
    if (!t) return;
    openModal('Editar Turma', [
        {id:'turmaNome', label:'Nome da Turma', type:'text', value: t.turmaNome, required: true},
        {id:'turmaDisciplina', label:'Disciplina', type:'text', value: t.turmaDisciplina, required: true},
        {id:'turmaAnoSemestre', label:'Ano/Semestre', type:'text', value: t.turmaAnoSemestre, required: true}
    ], data => {
        Object.assign(t, data);
        saveData();
        loadTurmas();
    });
}

/* ---------- CRUD ALUNOS (simplificado para brevidade, pode ser expandido como turmas) ---------- */
function openAddAlunoModal(){
    if (turmas.length === 0) {
        alert('Por favor, cadastre uma turma antes de adicionar alunos.');
        return;
    }
    openModal('Novo Aluno', [
        {id:'alunoNome', label:'Nome', type:'text', required: true},
        {id:'alunoMatricula', label:'Matrícula', type:'text', required: true},
        {id:'alunoEmail', label:'Email', type:'email', required: true},
        {id:'alunoTurma', label:'Turma', type:'select', options: turmas.map(t=>({value: t.id, text: t.turmaNome}))}
    ], data => {
        alunos.push({...data, id: generateUniqueId()});
        saveData();
        loadAlunos();
        loadStats();
    });
}

function loadAlunos() {
     const tbody = $('alunosTable').querySelector('tbody');
     tbody.innerHTML = alunos.length === 0
        ? '<tr><td colspan="5" style="text-align:center;">Nenhum aluno cadastrado.</td></tr>'
        : alunos.map(a => {
            const turma = turmas.find(t => t.id == a.alunoTurma);
            return `
            <tr>
                <td>${a.alunoNome}</td>
                <td>${a.alunoMatricula}</td>
                <td>${a.alunoEmail}</td>
                <td>${turma ? turma.turmaNome : '<i>Turma removida</i>'}</td>
                <td>
                    <button class="btn-small btn-edit" onclick="editAluno(${a.id})">Editar</button>
                    <button class="btn-small btn-delete" onclick="deleteAluno(${a.id})">Excluir</button>
                </td>
            </tr>
        `}).join('');
}

function deleteAluno(id) {
     if(confirm('Tem certeza que deseja excluir este aluno?')){
        alunos = alunos.filter(a => a.id !== id);
        saveData();
        loadAlunos();
        loadStats();
    }
}

function editAluno(id) {
    const a = alunos.find(x => x.id === id);
    if (!a) return;
    openModal('Editar Aluno', [
        {id:'alunoNome', label:'Nome', type:'text', value: a.alunoNome, required: true},
        {id:'alunoMatricula', label:'Matrícula', type:'text', value: a.alunoMatricula, required: true},
        {id:'alunoEmail', label:'Email', type:'email', value: a.alunoEmail, required: true},
        {id:'alunoTurma', label:'Turma', type:'select', options: turmas.map(t=>({value: t.id, text: t.turmaNome})), value: a.alunoTurma}
    ], data => {
        Object.assign(a, data);
        saveData();
        loadAlunos();
    });
}


/* ---------- CRUD ATIVIDADES (similar) ---------- */
function openAddAtividadeModal(){
    if (turmas.length === 0) {
        alert('Por favor, cadastre uma turma antes de adicionar atividades.');
        return;
    }
    openModal('Nova Atividade', [
        {id:'ativTitulo', label:'Título', type:'text', required: true},
        {id:'ativTipo', label:'Tipo', type:'select', options:[{value:'Prova',text:'Prova'},{value:'Trabalho',text:'Trabalho'},{value:'Exercício',text:'Exercício'}]},
        {id:'ativTurma', label:'Turma', type:'select', options: turmas.map(t=>({value: t.id,text: t.turmaNome}))},
        {id:'ativEntrega', label:'Data de Entrega', type:'date', required: true},
        {id:'ativValor', label:'Valor (pontos)', type:'number', required: true}
    ], data => {
        atividades.push({...data, id: generateUniqueId()});
        saveData();
        loadAtividades();
        loadStats();
    });
}

function loadAtividades(){
    const tbody = $('atividadesTable').querySelector('tbody');
    tbody.innerHTML = atividades.length === 0
     ? '<tr><td colspan="6" style="text-align:center;">Nenhuma atividade cadastrada.</td></tr>'
     : atividades.map(a => {
        const turma = turmas.find(t => t.id == a.ativTurma);
        return `
            <tr>
                <td>${a.ativTitulo}</td>
                <td>${a.ativTipo}</td>
                <td>${turma ? turma.turmaNome : '<i>Turma removida</i>'}</td>
                <td>${new Date(a.ativEntrega).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                <td>${a.ativValor}</td>
                <td>
                    <button class="btn-small btn-edit" onclick="editAtividade(${a.id})">Editar</button>
                    <button class="btn-small btn-delete" onclick="deleteAtividade(${a.id})">Excluir</button>
                </td>
            </tr>
        `}).join('');
}

function deleteAtividade(id) {
     if(confirm('Tem certeza que deseja excluir esta atividade?')){
        atividades = atividades.filter(a => a.id !== id);
        saveData();
        loadAtividades();
        loadStats();
    }
}

function editAtividade(id){
    const a = atividades.find(x => x.id === id);
    if (!a) return;
    openModal('Editar Atividade', [
        {id:'ativTitulo', label:'Título', type:'text', value: a.ativTitulo, required: true},
        {id:'ativTipo', label:'Tipo', type:'select', options:[{value:'Prova',text:'Prova'},{value:'Trabalho',text:'Trabalho'},{value:'Exercício',text:'Exercício'}], value: a.ativTipo},
        {id:'ativTurma', label:'Turma', type:'select', options: turmas.map(t=>({value: t.id,text: t.turmaNome})), value: a.ativTurma},
        {id:'ativEntrega', label:'Data de Entrega', type:'date', value: a.ativEntrega, required: true},
        {id:'ativValor', label:'Valor (pontos)', type:'number', value: a.ativValor, required: true}
    ], data => {
        Object.assign(a, data);
        saveData();
        loadAtividades();
    });
}

/* ---------- AVALIAR ENTREGAS ---------- */
function loadEntregas(){
    // Simulação: Cria entregas para todas as combinações de aluno/atividade que ainda não existem
    atividades.forEach(ativ => {
        alunos.forEach(aluno => {
            if (!entregas.some(e => e.atividadeId === ativ.id && e.alunoId === aluno.id)) {
                entregas.push({
                    id: generateUniqueId(),
                    atividadeId: ativ.id,
                    alunoId: aluno.id,
                    data: new Date().toISOString().split('T')[0],
                    comentario: 'Aguardando entrega do aluno.',
                    nota: null,
                    feedback: ''
                });
            }
        });
    });
    saveData();

    const tbody = $('entregasTable').querySelector('tbody');
    tbody.innerHTML = entregas.length === 0
      ? '<tr><td colspan="6" style="text-align:center;">Nenhuma entrega para avaliar.</td></tr>'
      : entregas.map(e => {
        const ativ = atividades.find(a => a.id === e.atividadeId);
        const aluno = alunos.find(a => a.id === e.alunoId);
        if(!ativ || !aluno) return ''; // Ignora entregas órfãs

        return `
            <tr>
                <td>${ativ.ativTitulo}</td>
                <td>${aluno.alunoNome}</td>
                <td>${new Date(e.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                <td>${e.comentario}</td>
                <td>${e.nota !== null ? `<b>${e.nota}</b>` : '<i>Pendente</i>'}</td>
                <td>
                    <button class="btn-small btn-edit" onclick="avaliarEntrega(${e.id})">Avaliar</button>
                </td>
            </tr>
        `;
    }).join('');
}

function avaliarEntrega(id){
    const entrega = entregas.find(x => x.id === id);
    if (!entrega) return;

    openModal('Avaliar Entrega', [
        {id:'nota', label:`Nota (0-${atividades.find(a=>a.id === entrega.atividadeId)?.ativValor || 10})`, type:'number', value: entrega.nota || ''},
        {id:'feedback', label:'Feedback', type:'textarea', value: entrega.feedback || ''}
    ], data => {
        const nota = parseFloat(data.nota);
        if (isNaN(nota)) {
            alert('Por favor, insira uma nota válida.');
            return false; // Impede o fechamento do modal
        }
        entrega.nota = nota;
        entrega.feedback = data.feedback;
        saveData();
        loadEntregas();
        loadStats();
        return true; // Permite o fechamento do modal
    });
}


/* ---------- MODAL GENÉRICO ---------- */
function openModal(title, fields, onSave){
    $('modalTitle').textContent = title;
    const container = $('modalFields');
    container.innerHTML = fields.map(f => {
        let inputHtml;
        const required = f.required ? 'required' : '';
        const placeholder = f.placeholder ? `placeholder="${f.placeholder}"` : '';

        switch(f.type) {
            case 'select':
                inputHtml = `<select id="mf_${f.id}" class="form-group" ${required}>` +
                    f.options.map(o=>`<option value="${o.value}" ${f.value == o.value ? 'selected':''}>${o.text}</option>`).join('') +
                    `</select>`;
                break;
            case 'textarea':
                inputHtml = `<textarea id="mf_${f.id}" class="form-group" rows="4" ${placeholder} ${required}>${f.value || ''}</textarea>`;
                break;
            default:
                inputHtml = `<input id="mf_${f.id}" type="${f.type}" class="form-group" value="${f.value || ''}" ${placeholder} ${required}>`;
        }
        return `<div class="form-group"><label for="mf_${f.id}">${f.label}</label>${inputHtml}</div>`;
    }).join('');

    $('genericModal').classList.add('show');
    $('modalForm').onsubmit = e => {
        e.preventDefault();
        const data = {};
        fields.forEach(f => data[f.id] = $(`mf_${f.id}`).value.trim());

        if (onSave(data) !== false) {
            closeModal();
        }
    };
}

function closeModal(){
    $('genericModal').classList.remove('show');
    $('modalForm').reset();
}

/* ---------- INICIALIZAÇÃO ---------- */
function toggleSidebar(){
    document.querySelector('.sidebar').classList.toggle('open');
}

window.onload = () => {
    loadData();
    const savedUser = localStorage.getItem('currentUser');
    if(savedUser){
        currentUser = JSON.parse(savedUser);
        loadDashboard();
    } else {
        $('loginPage').style.display = 'flex';
    }

    /*******************************************************
 * NOVA SEÇÃO: INTEGRAÇÃO COM GERADOR DE RELATÓRIOS (C/WASM)
 *******************************************************/

// Função para fazer o download do conteúdo como um arquivo de texto
function downloadTexto(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Função principal que chama o código C para gerar o relatório
function executarGeracaoRelatorio() {
    // Verifica se o módulo WASM está pronto (o 'Module' vem do relatorio.js)
    if (typeof Module._gerarRelatorioAlunos !== 'function') {
        alert("O módulo de relatórios ainda não está pronto. Tente novamente em um instante.");
        return;
    }

    // Prepara a função C para ser chamada
    const gerarRelatorio = Module.cwrap(
        'gerarRelatorioAlunos', // Nome da função em C
        'string',             // Tipo de retorno (const char* -> string)
        ['string', 'string', 'string', 'string'] // Argumentos (4 strings)
    );

    // Coleta os dados do localStorage (que já estão em formato JSON)
    const alunosJSON = localStorage.getItem('alunos') || '[]';
    const atividadesJSON = localStorage.getItem('atividades') || '[]';
    const entregasJSON = localStorage.getItem('entregas') || '[]';

    // Pega o nome da primeira turma como exemplo
    const primeiraTurma = turmas.length > 0 ? turmas[0].turmaNome : "N/A";
    
    console.log("Enviando dados para o módulo C/WASM...");

    // Chama a função em C!
    const relatorioGerado = gerarRelatorio(
        alunosJSON,
        atividadesJSON,
        entregasJSON,
        primeiraTurma
    );

    console.log("Relatório recebido do C/WASM:");
    console.log(relatorioGerado);

    // Faz o download do relatório gerado
    if (relatorioGerado && !relatorioGerado.startsWith("Erro:")) {
        downloadTexto(`Relatorio_${primeiraTurma.replace(' ', '_')}.txt`, relatorioGerado);
    } else {
        alert("Ocorreu um erro ao gerar o relatório: " + relatorioGerado);
    }
}
};