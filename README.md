# Restaurante Sabor & Reserva

Site profissional de restaurante com:

- Menu de pratos dinâmico
- Reservas online com Supabase
- Pedidos enviados por WhatsApp
- Painel admin simples com login
- Código modular em `supabase.js` e `app.js`

## Como usar

1. Abra `index.html` em um navegador.
2. Adicione pratos ao carrinho na seção "Nosso Menu".
3. Clique em "Finalizar Encomenda" para gerar o pedido por WhatsApp.
4. Preencha o formulário na seção "Reservar Mesa" para criar reservas.
5. Clique em "Área Admin" para abrir o login de administrador.

## Arquivos principais

- `supabase.js` — inicialização e funções Supabase
- `app.js` — lógica de carrinho, reservas, WhatsApp e painel admin
- `index.html` — estrutura e interface
- `styles.css` — design e layout

## Configurar Supabase passo a passo

1. Acesse https://app.supabase.com/ e crie um novo projeto.
2. No painel, clique em `Authentication` e ative `Email` como método de login.
3. Crie um usuário administrador em `Users` com email e senha.
4. Em `Database` > `Table Editor`, crie as tabelas `reservations` e `orders` com os campos necessários.
5. Em `Settings` > `API`, copie a `URL` e a `anon public` key.
6. Abra `restaurant-site/supabase.js` e substitua `YOUR_SUPABASE_URL` e `YOUR_SUPABASE_ANON_KEY`.
7. Abra `restaurant-site/app.js` e atualize `RESTAURANT_WHATSAPP` com o número do restaurante no formato internacional, por exemplo `351917248077`.
8. Abra `restaurant-site/index.html` no navegador ou use um servidor local para carregar módulos ES.

## Publicar o site

Este é um site estático e funciona em qualquer serviço de hospedagem estática:

- GitHub Pages
- Netlify
- Vercel

Basta enviar a pasta `restaurant-site` e garantir que `index.html` esteja na raiz do deploy.

## Observações

- Reservas e pedidos são guardados no Supabase quando o serviço estiver configurado.
- O pedido é enviado por WhatsApp com mensagem automática.
- O painel admin acessa os dados online via Supabase Auth e Supabase Database.
- Se o Supabase não estiver configurado, o site mantém o funcionamento local e mostra mensagens de aviso no console.
