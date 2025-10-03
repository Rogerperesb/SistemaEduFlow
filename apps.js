/* ---------- UTILITÁRIOS ---------- */
const $ = id => document.getElementById(id);
const hide = el => el.classList.remove('active');
const show = el => el.classList.add('active');

/* ---------- DADOS FAKE ---------- */
const users = [
    {email:'prof@unip.br', password:'123456', name:'Prof. Ana', role:'professor'},
    {email:'aluno@unip.br', password:'123456', name:'Aluno Bruno', role:'aluno'}
];
let currentUser = null;
let turmas = [];
let alunos = [];
let atividades = [];
let entregas = [];

/* ---------- LOGIN ---------- */
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

/* ---------- LOGOUT ---------- */
function logout(){
    currentUser = null;
    localStorage.removeItem('currentUser');
    $('dashboardPage').style.display = 'none';
    $('loginPage').style.display = 'flex';
    $('loginForm').reset();
}

/* ---------- CARREGA DASHBOARD ---------- */
function loadDashboard(){
    $('loginPage').style.display = 'none';
    $('dashboardPage').style.display = 'block';
    $('userName').textContent = currentUser.name;
    $('userEmail').textContent = currentUser.email;
    $('userAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
    buildMenu();
    showSection('dashboardSection');
    loadStats();
}

/* ---------- MONTA MENU ---------- */
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
    ];
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `${item.icon} ${item.label}`;
        div.onclick = () => showSection(item.id);
        menu.appendChild(div);
    });
}

/* ---------- NAVEGAÇÃO ---------- */
function showSection(id){
    document.querySelectorAll('.content-section').forEach(s => hide(s));
    $(id).classList.add('active');
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    event.currentTarget.classList.add('active');
    if(id === 'turmasSection') loadTurmas();
    if(id === 'alunosSection') loadAlunos();
    if(id === 'atividadesSection') loadAtividades();
    if(id === 'notasSectionProfessor') loadEntregas();
}

/* ---------- ESTATÍSTICAS ---------- */
function loadStats(){
    const grid = $('statsGrid');
    grid.innerHTML = `
        <div class="stat-card"><h3>Total de Turmas</h3><div class="value">${turmas.length}</div></div>
        <div class="stat-card"><h3>Total de Alunos</h3><div class="value">${alunos.length}</div></div>
        <div class="stat-card"><h3>Atividades Criadas</h3><div class="value">${atividades.length}</div></div>
        <div class="stat-card"><h3>Entregas Pendentes</h3><div class="value">${entregas.filter(e=>!e.nota).length}</div></div>
    `;
}

/* ---------- CRUD TURMAS ---------- */
function openAddTurmaModal(){
    openModal('Nova Turma', [
        {id:'turmaNome', label:'Nome da Turma', type:'text'},
        {id:'turmaDisciplina', label:'Disciplina', type:'text'},
        {id:'turmaAnoSemestre', label:'Ano/Semestre', type:'text'}
    ], data => {
        turmas.push({...data, id:Date.now()});
        loadTurmas();
    });
}
function loadTurmas(){
    const tbody = $('turmasTable').querySelector('tbody');
    tbody.innerHTML = '';
    turmas.forEach(t => {
        tbody.innerHTML += `
            <tr>
                <td>${t.turmaNome}</td>
                <td>${t.turmaDisciplina}</td>
                <td>${t.turmaAnoSemestre}</td>
                <td>
                    <button class="btn-small btn-edit" onclick="editTurma(${t.id})">Editar</button>
                    <button class="btn-small btn-delete" onclick="deleteTurma(${t.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}
function deleteTurma(id){
    if(confirm('Excluir esta turma?')){
        turmas = turmas.filter(t => t.id !== id);
        loadTurmas();
    }
}
function editTurma(id){
    const t = turmas.find(x => x.id === id);
    openModal('Editar Turma', [
        {id:'turmaNome', label:'Nome da Turma', type:'text', value:t.turmaNome},
        {id:'turmaDisciplina', label:'Disciplina', type:'text', value:t.turmaDisciplina},
        {id:'turmaAnoSemestre', label:'Ano/Semestre', type:'text', value:t.turmaAnoSemestre}
    ], data => {
        Object.assign(t, data);
        loadTurmas();
    });
}

/* ---------- CRUD ALUNOS ---------- */
function openAddAlunoModal(){
    openModal('Novo Aluno', [
        {id:'alunoNome', label:'Nome', type:'text'},
        {id:'alunoMatricula', label:'Matrícula', type:'text'},
        {id:'alunoEmail', label:'Email', type:'email'},
        {id:'alunoTurma', label:'Turma', type:'select', options:turmas.map(t=>({value:t.id,text:t.turmaNome}))}
    ], data => {
        alunos.push({...data, id:Date.now()});
        loadAlunos();
    });
}
function loadAlunos(){
    const tbody = $('alunosTable').querySelector('tbody');
    tbody.innerHTML = '';
    alunos.forEach(a => {
        const turma = turmas.find(t => t.id == a.alunoTurma);
        tbody.innerHTML += `
            <tr>
                <td>${a.alunoNome}</td>
                <td>${a.alunoMatricula}</td>
                <td>${a.alunoEmail}</td>
                <td>${turma ? turma.turmaNome : '-'}</td>
                <td>
                    <button class="btn-small btn-edit" onclick="editAluno(${a.id})">Editar</button>
                    <button class="btn-small btn-delete" onclick="deleteAluno(${a.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}
function deleteAluno(id){
    if(confirm('Excluir este aluno?')){
        alunos = alunos.filter(a => a.id !== id);
        loadAlunos();
    }
}
function editAluno(id){
    const a = alunos.find(x => x.id === id);
    openModal('Editar Aluno', [
        {id:'alunoNome', label:'Nome', type:'text', value:a.alunoNome},
        {id:'alunoMatricula', label:'Matrícula', type:'text', value:a.alunoMatricula},
        {id:'alunoEmail', label:'Email', type:'email', value:a.alunoEmail},
        {id:'alunoTurma', label:'Turma', type:'select', options:turmas.map(t=>({value:t.id,text:t.turmaNome})), value:a.alunoTurma}
    ], data => {
        Object.assign(a, data);
        loadAlunos();
    });
}

/* ---------- CRUD ATIVIDADES ---------- */
function openAddAtividadeModal(){
    openModal('Nova Atividade', [
        {id:'ativTitulo', label:'Título', type:'text'},
        {id:'ativTipo', label:'Tipo', type:'select', options:[{value:'Prova',text:'Prova'},{value:'Trabalho',text:'Trabalho'},{value:'Exercício',text:'Exercício'}]},
        {id:'ativTurma', label:'Turma', type:'select', options:turmas.map(t=>({value:t.id,text:t.turmaNome}))},
        {id:'ativEntrega', label:'Data de Entrega', type:'date'},
        {id:'ativValor', label:'Valor (pontos)', type:'number'}
    ], data => {
        atividades.push({...data, id:Date.now()});
        loadAtividades();
    });
}
function loadAtividades(){
    const tbody = $('atividadesTable').querySelector('tbody');
    tbody.innerHTML = '';
    atividades.forEach(a => {
        const turma = turmas.find(t => t.id == a.ativTurma);
        tbody.innerHTML += `
            <tr>
                <td>${a.ativTitulo}</td>
                <td>${a.ativTipo}</td>
                <td>${turma ? turma.turmaNome : '-'}</td>
                <td>${a.ativEntrega}</td>
                <td>${a.ativValor}</td>
                <td>
                    <button class="btn-small btn-edit" onclick="editAtividade(${a.id})">Editar</button>
                    <button class="btn-small btn-delete" onclick="deleteAtividade(${a.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}
function deleteAtividade(id){
    if(confirm('Excluir esta atividade?')){
        atividades = atividades.filter(a => a.id !== id);
        loadAtividades();
    }
}
function editAtividade(id){
    const a = atividades.find(x => x.id === id);
    openModal('Editar Atividade', [
        {id:'ativTitulo', label:'Título', type:'text', value:a.ativTitulo},
        {id:'ativTipo', label:'Tipo', type:'select', options:[{value:'Prova',text:'Prova'},{value:'Trabalho',text:'Trabalho'},{value:'Exercício',text:'Exercício'}], value:a.ativTipo},
        {id:'ativTurma', label:'Turma', type:'select', options:turmas.map(t=>({value:t.id,text:t.turmaNome})), value:a.ativTurma},
        {id:'ativEntrega', label:'Data de Entrega', type:'date', value:a.ativEntrega},
        {id:'ativValor', label:'Valor (pontos)', type:'number', value:a.ativValor}
    ], data => {
        Object.assign(a, data);
        loadAtividades();
    });
}

/* ---------- ENTREGAS ---------- */
function loadEntregas(){
    if(entregas.length === 0 && atividades.length && alunos){
        entregas = [
            {id:1, atividadeId:atividades[0].id, alunoId:alunos[0].id, data:'2025-06-10', comentario:'Entrega feita!', nota:null},
            {id:2, atividadeId:atividades[0].id, alunoId:alunos[1].id, data:'2025-06-11', comentario:'Entrega feita!', nota:null}
        ];
    }
    const tbody = $('entregasTable').querySelector('tbody');
    tbody.innerHTML = '';
    entregas.forEach(e => {
        const ativ = atividades.find(a => a.id === e.atividadeId);
        const aluno = alunos.find(a => a.id === e.alunoId);
        if(!ativ || !aluno) return;
        tbody.innerHTML += `
            <tr>
                <td>${ativ.ativTitulo}</td>
                <td>${aluno.alunoNome}</td>
                <td>${e.data}</td>
                <td>${e.comentario}</td>
                <td>${e.nota !== null ? e.nota : 'Pendente'}</td>
                <td>
                    <button class="btn-small btn-edit" onclick="avaliarEntrega(${e.id})">Avaliar</button>
                </td>
            </tr>
        `;
    });
}
function avaliarEntrega(id){
    const e = entregas.find(x => x.id === id);
    openModal('Avaliar Entrega', [
        {id:'nota', label:'Nota (0-10)', type:'number', value:e.nota || ''},
        {id:'feedback', label:'Feedback', type:'textarea', value:e.feedback || ''}
    ], data => {
        e.nota = parseFloat(data.nota);
        e.feedback = data.feedback;
        loadEntregas();
    });
}

/* ---------- MODAL ---------- */
function openModal(title, fields, onSave){
    $('modalTitle').textContent = title;
    const container = $('modalFields');
    container.innerHTML = '';
    fields.forEach(f => {
        let input;
        if(f.type === 'select'){
            input = `<select id="mf_${f.id}" class="form-group" style="width:100%;padding:12px;border:2px solid #e0e0e0;border-radius:8px">` +
                f.options.map(o=>`<option value="${o.value}" ${f.value==o.value?'selected':''}>${o.text}</option>`).join('') +
                `</select>`;
        } else if(f.type === 'textarea'){
            input = `<textarea id="mf_${f.id}" class="form-group" style="width:100%;padding:12px;border:2px solid #e0e0e0;border-radius:8px" rows="4">${f.value || ''}</textarea>`;
        } else {
            input = `<input id="mf_${f.id}" type="${f.type}" class="form-group" style="width:100%;padding:12px;border:2px solid #e0e0e0;border-radius:8px" value="${f.value || ''}">`;
        }
        container.innerHTML += `
            <div class="form-group">
                <label for="mf_${f.id}">${f.label}</label>
                ${input}
            </div>
        `;
    });
    $('genericModal').classList.add('show');
    $('modalForm').onsubmit = e => {
        e.preventDefault();
        const data = {};
        fields.forEach(f => data[f.id] = $(`mf_${f.id}`).value);
        onSave(data);
        closeModal();
    };
}
function closeModal(){
    $('genericModal').classList.remove('show');
}

/* ---------- SIDEBAR MOBILE ---------- */
function toggleSidebar(){
    document.querySelector('.sidebar').classList.toggle('open');
}

/* ---------- AUTO-LOGIN ---------- */
window.onload = () => {
    const saved = localStorage.getItem('currentUser');
    if(saved){
        currentUser = JSON.parse(saved);
        loadDashboard();
    }
};