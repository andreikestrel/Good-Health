SGHSS - Sistema de Gestão Hospitalar e de Serviços de Saúde
Projeto Multidisciplinar – ADS

Aplicação web mobile‑first construída com Next.js (App Router), simulando um prontuário/gestão básica de pacientes, atendimentos, receitas e requisições. Sem backend real: usa localStorage para persistência e simulação de autenticação e dados.

Como rodar
1) Requisitos: Node 18+ e npm
2) Instalar dependências:
```bash
cd boasaude
npm install
```
3) Rodar em dev:
```bash
npm run dev
```
4) Abrir: http://localhost:3000

Logins de teste
- Paciente: paciente@email.com / paciente123
- Profissional: profissional@email.com / profissional123
- Admin: admin@email.com / admin123

Estrutura (tree simplificada)
```
app/
  page.tsx                 # Home (últimos atendimentos)
  layout.tsx               # Layout + AuthProvider
  dashboard/               # Dashboard (admin/profissional)
  dashboardPatient/        # Dashboard do paciente (estático)
  login/
    page.tsx               # Login + dicas de credenciais
    alert/                 # Solicitação/Simulação de novo usuário
    newUser/               # Cadastro com validação forte de senha
  appoiments/              # Lista e create/edit de agendamentos
  patients/
    page.tsx               # Lista de pacientes
    create_n_edit/         # Form de paciente
    details/               # Detalhes do paciente
    recipes/               # Lista + create/edit de receitas
    requisition/           # Lista + create/edit de requisições
    recipesPatient/        # Lista (mock) de receitas do paciente
    requisitionPatient/    # Lista (mock) de requisições do paciente
  report/                  # Relatórios com filtros e impressão
  videocall/               # Tela de “vídeo” com chat/controles

components/ui/             # Button, Input, Modal, Card, Autocomplete
lib/auth/                  # AuthContext e gestão de usuários
lib/data/                  # Store em localStorage (patients, appointments, recipes, requisitions)
lib/utils/                 # Validações (CPF, CEP, máscaras)
```

Fluxo de autenticação
- Autenticação client-side via `AuthContext` com usuários embutidos e customizados (localStorage).
- Redirecionamento por role: paciente vai para `/dashboardPatient`, demais para `/dashboard`.

Funcionalidades
- Pacientes: CRUD, máscara/validação (CPF/CEP/telefone), idade e sexo na lista
- Atendimentos: flag de videoconsulta, integração com tela de videocall
- Receitas/Requisições: CRUD; páginas “Patient” estáticas para visualização
- Videocall: layout vertical, chat simulado, volume, mute, placeholders por papel/sexo
- Relatório: diário/semanal/mensal/período, impressão apenas do conteúdo

Tecnologias
- Next.js (App Router), React 19
- CSS utilitário (classes Tailwind‑like em globals)
- localStorage para persistência
- react-icons (ícones do UI)

Observações
- O projeto não possui backend real; dados são mockados e gravados no navegador.
