# ✦ Mãos Talentosas — Sistema de Pedidos

Sistema web de pedidos desenvolvido para o projeto **Mãos Talentosas**, evento realizado aos domingos com produtos e artesanatos variados.

## 📋 Sobre o projeto

Aplicação web sem necessidade de app instalado, acessada via link ou QR Code. Permite que clientes façam pedidos diretamente pelo celular e que a administração gerencie tudo em tempo real.

## ✨ Funcionalidades

### Cliente
- Visualiza o cardápio do evento com preços
- Escolhe a quantidade de cada item
- Seleciona a forma de pagamento (Pix, Cartão, Dinheiro ou Pagar depois)
- Informa se vai comer na hora ou levar para viagem
- Recebe confirmação do pedido na tela

### Administração (acesso por senha)
- Painel em tempo real com todos os pedidos
- Métricas: total de pedidos, valor recebido e a receber
- Marcar pedidos como pagos
- Filtros por status e forma de pagamento
- Relatório completo com exportação em CSV
- Configuração do evento e cardápio
- Geração de QR Code para compartilhar o link
- Alteração de senha admin

## 🛠 Tecnologias

- HTML5, CSS3, JavaScript (Vanilla)
- Firebase Realtime Database (sincronização em tempo real)
- Hospedagem: Netlify

## 📁 Estrutura do projeto

```
maos-talentosas/
├── html/
│   └── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── imagens/
└── README.md
```

## 🚀 Como usar

1. Acesse o link do sistema
2. **Cliente:** escolhe os itens, forma de pagamento e confirma
3. **Admin:** clica em "⚙ Área administrativa" no rodapé, digita a senha e acessa o painel

## 🔐 Acesso administrativo

Senha padrão: `admin123`  
Pode ser alterada na aba **Config** após o primeiro acesso.

## ☁️ Infraestrutura

- **Netlify** — hospedagem do frontend
- **Firebase Realtime Database** — armazenamento e sincronização dos pedidos em tempo real
