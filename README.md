# SistemaEduFlow

# SistemaEduFlow - Sistema de Gestão Acadêmica

Um sistema de front-end simples para gestão acadêmica, permitindo que professores gerenciem turmas, alunos, atividades e notas. O projeto foi desenvolvido utilizando tecnologias web padrões como HTML, CSS e JavaScript puro, com persistência de dados no lado do cliente através do `localStorage`.

## 📜 Sobre o Projeto

O **SistemaEduFlow** simula um portal acadêmico para a Universidade UNIP, oferecendo uma interface intuitiva para a administração de informações educacionais. Atualmente, o sistema foca nas funcionalidades para o perfil de **Professor**, com uma estrutura preparada para a futura implementação do portal do Aluno.

## ✨ Funcionalidades Principais

O sistema oferece um conjunto de funcionalidades robustas para o gerenciamento acadêmico por parte dos professores:

  - **Autenticação:** Sistema de login e logout seguro para professores e alunos.
  - **Dashboard Interativo:** Apresenta estatísticas rápidas sobre o sistema, como número total de turmas, alunos, atividades criadas e entregas pendentes.
  - **Gerenciamento de Turmas (CRUD):**
      - Adicionar novas turmas.
      - Visualizar todas as turmas cadastradas.
      - Editar informações das turmas existentes.
      - Excluir turmas.
  - **Gerenciamento de Alunos (CRUD):**
      - Adicionar novos alunos e associá-los a uma turma.
      - Visualizar a lista de alunos com seus respectivos dados.
      - Editar informações dos alunos.
      - Excluir alunos do sistema.
  - **Gerenciamento de Atividades (CRUD):**
      - Criar novas atividades (provas, trabalhos, etc.) para turmas específicas.
      - Definir datas de entrega e pontuação.
      - Editar e excluir atividades.
  - **Avaliação de Entregas:**
      - Visualizar a lista de entregas dos alunos.
      - Lançar notas e adicionar feedback para cada entrega.
  - **Geração de Relatórios:**
      - Funcionalidade integrada com **WebAssembly (WASM)** para gerar e baixar um relatório de texto (`.txt`) com o resumo de notas da turma.

## 🚀 Tecnologias Utilizadas

  - **HTML5:** Estruturação semântica do conteúdo.
  - **CSS3:** Estilização moderna e responsiva, com uso de variáveis para um tema consistente.
  - **JavaScript (Vanilla):** Manipulação do DOM, interatividade e lógica de negócio do front-end.
  - **LocalStorage API:** Persistência de dados (turmas, alunos, atividades) diretamente no navegador, permitindo que as informações não se percam ao recarregar a página.
  - **WebAssembly (WASM):** Utilizado para integrar uma função de alto desempenho (escrita em C/C++) para a geração de relatórios complexos.

## ⚙️ Como Executar

Este é um projeto puramente de front-end. Para executá-lo, siga os passos abaixo:

1.  Clone este repositório:
    ```bash
    git clone https://github.com/seu-usuario/SistemaEduFlow.git
    ```
2.  Navegue até o diretório do projeto:
    ```bash
    cd SistemaEduFlow
    ```
3.  Abra o arquivo `sistema.html` diretamente no seu navegador de preferência (Google Chrome, Firefox, etc.).

**Credenciais para teste (ADM):**

  - **Email do Professor:** `prof@unip.br`
  - **Senha (RA):** `123456`

  **Credenciais para teste (aluno):**

  - **Email do aluno:** `aluno@unip.br`
  - **Senha (RA):** `123456`

## 📂 Estrutura do Projeto

```
SistemaEduFlow/
├── sistema.html       # Arquivo principal com a estrutura da interface
├── styles.css         # Folha de estilos para toda a aplicação
├── scripts.js         # Lógica principal da aplicação (CRUDs, login, etc.)
└── apps.js            # (Versão alternativa ou antiga do script)
```

  - **`sistema.html`**: Contém a estrutura de todas as seções da página, incluindo a tela de login, o dashboard e os modais para adição/edição de dados.
  - **`styles.css`**: Responsável por toda a aparência visual do sistema, incluindo layout responsivo para dispositivos móveis.
  - **`scripts.js`**: O coração da aplicação. Gerencia o estado, a lógica de login, a renderização dinâmica das tabelas, a interação com o `localStorage` e a chamada para o módulo WASM.

## 📸 Screenshots

*(Sugestão: Adicione aqui screenshots da tela de login, dashboard, gerenciamento de turmas, etc.)*

**Tela de Login**

**Dashboard do Professor**

## 🔮 Melhorias Futuras

  - [ ] Desenvolver a interface e funcionalidades para o perfil de **Aluno**.
  - [ ] Conectar a aplicação a um back-end real com um banco de dados (Node.js, Python, etc.).
  - [ ] Implementar um sistema de upload de arquivos para as entregas das atividades.
  - [ ] Adicionar gráficos e visualizações mais detalhadas no dashboard.
  - [ ] Melhorar a validação dos formulários e o feedback para o usuário.


