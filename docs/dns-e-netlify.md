# Trocar o DNS dos subdomínios e cancelar a Netlify

Analogia: o endereço `criancas.melrolan.com.br` é uma placa na porta de uma loja. Hoje a placa aponta para a Netlify. Vamos trocar a placa para apontar para o GitHub, que só tem um recado na porta: "mudamos para www.melrolan.com.br/guias/...".

Faça isto só depois do "ok" da publicação e de eu avisar que os dois repositórios de redirecionamento (`redir-criancas` e `redir-essencial`) estão prontos.

## Parte 1. Ligar o domínio no GitHub (uma vez por repositório)

1. Entre em github.com e abra o repositório `mel-cmyk/redir-criancas`.
2. Clique em Settings, depois Pages (menu da esquerda).
3. Em "Build and deployment", Source: escolha "Deploy from a branch". Branch: `main`, pasta `/ (root)`. Clique em Save.
4. Em "Custom domain", confira se aparece `criancas.melrolan.com.br` (vem do arquivo CNAME do repositório). Se estiver vazio, digite e salve.
5. Vai aparecer um aviso vermelho de DNS. É normal: falta a Parte 2.
6. Repita os passos 1 a 5 com `redir-essencial` e o domínio `essencial.melrolan.com.br`.

## Parte 2. Trocar o DNS na Wix

1. Entre na Wix, vá em Domínios e clique em "Gerenciar" ao lado de `melrolan.com.br`.
2. Abra "Registros DNS" (Advanced / Avançado).
3. Na seção "CNAME (Alias)", ache a linha com nome `criancas`. Hoje ela aponta para a Netlify (algo como `...netlify.app`).
4. Clique no lápis e troque o valor para `mel-cmyk.github.io` (sem `https://`, sem barra no final). Salve.
5. Faça o mesmo na linha `essencial`.
6. Se alguma das duas tiver registros A ou AAAA (em vez de CNAME), apague esses registros e crie um CNAME com o valor acima.
7. Não mexa em `www`, `loja` nem no registro do domínio principal.

A troca leva de alguns minutos a algumas horas.

## Parte 3. Ativar o HTTPS

1. Volte ao GitHub, Settings, Pages de cada repositório `redir-*`.
2. Quando o aviso vermelho de DNS sumir (pode levar até 24 horas), marque "Enforce HTTPS".
3. Se a caixa estiver cinza, espere um pouco e atualize a página: o GitHub ainda está emitindo o certificado.

## Parte 4. Conferir

Abra no navegador, com a janela anônima:

- `https://criancas.melrolan.com.br/?gclid=teste123&utm_source=teste`
- `https://essencial.melrolan.com.br/?gclid=teste123&utm_source=teste`

Cada um deve cair na página nova em `www.melrolan.com.br/guias/...` com `?gclid=teste123&utm_source=teste` na barra de endereço.

## Parte 5. Cancelar a Netlify

Espere 2 dias com tudo funcionando. Depois:

1. Entre em app.netlify.com.
2. Abra o site `criancas` (nome pode variar). Vá em Site configuration, Domain management e remova o domínio personalizado. Depois, em Site configuration, General, role até "Delete this site" e confirme.
3. Repita com o site `essencial`.
4. Se a conta da Netlify tiver plano pago, vá em Team settings, Billing e cancele ou rebaixe para o plano gratuito. Se for gratuito e não houver outros sites, a conta pode ficar sem custo.
5. No GitHub, arquive os repositórios antigos `lp-criancas` e `lp-essencial` (Settings, Danger Zone, "Archive this repository"). Não apague: servem de cópia de segurança. O código atual das duas páginas agora vive em `lps/` no repositório `webpage`.

## Resumo dos endereços

| Antes | Depois |
| --- | --- |
| criancas.melrolan.com.br (Netlify) | redireciona para www.melrolan.com.br/guias/paris-com-criancas/ |
| essencial.melrolan.com.br (Netlify) | redireciona para www.melrolan.com.br/guias/paris-essencial/ |
