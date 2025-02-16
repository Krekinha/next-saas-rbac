# Next.js SaaS + RBAC

Este projeto contém todos os boilerplates necessários para configurar um SaaS multi-tenante com Next.js, incluindo autenticação e autorização RBAC.

## Características

### Autenticação

- [ ] Deve ser possível autenticar usando e-mail e senha;
- [ ] Deve ser possível autenticar usando Github account;
- [ ] Deve ser possível recuperar senha usando e-mail;
- [x] Deve ser possível criar uma conta (e-mail, nome e senha);

### Organizações (Organizations)

- [ ] Deve ser possível criar uma nova organização;
- [ ] Deve ser possível obter organizações às quais o usuário pertence;
- [ ] Deve ser possível atualizar uma organização;
- [ ] Deve ser possível desligar uma organização;
- [ ] Deve ser possível transferir a propriedade da organização;

### Convites (Invites)

- [ ] Deve ser possível convidar um novo membro (e-mail, função);
- [ ] Deve ser possível aceitar um convite;
- [ ] Deve ser possível revogar um convite pendente;

### Membros (Members)

- [ ] Deve ser possível obter membros da organização;
- [ ] Deve ser possível atualizar o cargo de um membro;

### Projetos (Projects)

- [ ] Deve ser possível obter projetos dentro de uma organização;
- [ ] Deve ser possível criar um novo projeto (nome, url, descrição);
- [ ] Deve ser possível atualizar um projeto (nome, url, descrição);
- [ ] Deve ser possível deletar um projeto;

### Faturamento (Billing)

- [ ] Deve ser possível obter detalhes de faturamento para a organização ($20 por projeto / $10 por membro excluindo o cargo de faturamento);

### Cargos (Roles)

- [ ] Administrator
- [ ] Member
- [ ] Billing

### Tabela de Permissões

| Ação                     | Administrator | Member | Billing | Anonymous |
|--------------------------|:-------------:|:------:|:-------:|:---------:|
| Atualizar organização    |      ✅       |   ❌   |    ❌   |     ❌    |
| Deletar organização      |      ✅       |   ❌   |    ❌   |     ❌    |
| Convidar um membro       |      ✅       |   ❌   |    ❌   |     ❌    |
| Revogar um convite       |      ✅       |   ❌   |    ❌   |     ❌    |
| Listar membros           |      ✅       |   ✅   |    ❌   |     ❌    |
| Transferir propriedade   |      ⚠️       |   ❌   |    ❌   |     ❌    |
| Atualizar cargo de membro|      ✅       |   ❌   |    ❌   |     ❌    |
| Deletar membro           |      ✅       |   ⚠️   |    ❌   |     ❌    |
| Listar projetos          |      ✅       |   ✅   |    ✅   |     ❌    |
| Criar um novo projeto    |      ✅       |   ❌   |    ❌   |     ❌    |
| Atualizar um projeto     |      ✅       |   ✅   |    ❌   |     ❌    |
| Deletar um projeto       |      ✅       |   ❌   |    ❌   |     ❌    |
| Obter detalhes de faturamento |  ✅   |   ❌   |    ✅   |     ❌    |
| Exportar detalhes de faturamento | ✅ |   ❌   |    ❌   |     ❌    |


dotenv -e ../../.env -- 