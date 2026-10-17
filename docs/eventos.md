# Dicionário de eventos de medição

Fonte: `src/analytics/`. Tudo só envia depois do consentimento e só no domínio oficial (www.melrolan.com.br). Nada de dado pessoal (nome, e-mail, telefone) vai nos eventos.

## GA4 (propriedade 521372579)

| Evento | Quando dispara | Parâmetros principais |
| --- | --- | --- |
| `view_item` | Abrir a página de um tour ou de um guia | item (id, nome, preço), `currency`, `value` |
| `view_item_list` | Abrir a lista de tours ou de guias | `item_list_name`, itens |
| `select_item` | Clicar num card de tour | item |
| `begin_checkout` | Clicar em comprar um guia (abre a loja Wix) | item, `value`, `creative_slot` |
| `clique_cta` | Clicar num botão que leva ao quiz ou ao diagnóstico | `origem` |
| `whatsapp_click` | Clicar em qualquer botão de WhatsApp (evento-chave) | `origem`, `servico`; nos funis também `origin_flow`, `flow_run_id` |
| `email_click`, `instagram_click` | Clicar no e-mail ou no Instagram do rodapé | `origem` |
| `bonus_download` | Baixar um bônus na página de entrega | `bonus` |
| `lead_erro` | O diagnóstico não conseguiu salvar o lead no Wix | `metodo` |
| `generate_lead` | Gesto real de captura (veja Funis). No máximo 1 por `flow_run_id` | parâmetros dos funis, `lead_method`, `lead_source` |

### Funis (Quiz dos Tours e Diagnóstico)

Parâmetros comuns, todos cadastrados como dimensões de evento: `flow` (`quiz_tours` ou `diagnostico`), `flow_run_id` (id único por execução), `step_index`, `step_name`, `total_steps`, `result_id`, `entry_point` (`home`, `pagina_tours`, `pagina_guia`, `menu`, `popup`, `direto`), `lead_method` (`formulario` ou `whatsapp`), `lead_source`.

| Evento | Quando |
| --- | --- |
| `flow_view` | Abrir a página do quiz ou do diagnóstico |
| `quiz_inicio`, `diagnostico_inicio` | Primeira resposta |
| `quiz_etapa`, `diagnostico_etapa` | Cada etapa concluída (uma vez por etapa e execução) |
| `quiz_conclusao`, `diagnostico_conclusao` | Mostrar o resultado (nunca é lead) |
| `generate_lead` | Quiz: clique no WhatsApp do resultado. Diagnóstico: lead salvo no Wix (formulário). Os cliques de WhatsApp depois disso não geram outro lead |

Travas contra contagem dupla: `sessionStorage` por execução (`lead_sent_<id>`, `<fluxo>_conclusao_<id>`, uma etapa por passo). Quiz e diagnóstico na mesma sessão têm `flow_run_id` diferentes.

## Meta (pixel só com consentimento de publicidade)

`view_item` vira ViewContent, `begin_checkout` vira InitiateCheckout, `generate_lead` vira Lead, `whatsapp_click` vira Contact. Sem dados pessoais.

## TikTok (pixel só com consentimento de publicidade)

Espelho do mesmo ponto de disparo (`track`). Cada evento leva `event_id` único.

| GA4 | TikTok |
| --- | --- |
| `view_item` | ViewContent |
| `clique_cta` | ClickButton |
| `whatsapp_click` (fora de funil) | Contact (`method: whatsapp`) |
| `email_click` | Contact (`method: email`) |
| `generate_lead` | SubmitForm |
| `begin_checkout` | InitiateCheckout |
| `purchase` | CompletePayment (a compra acontece na loja Wix, fora deste código) |
| `quiz_inicio`, `quiz_conclusao` | `quiz_tours_inicio`, `quiz_tours_conclusao` |
| `diagnostico_inicio`, `diagnostico_conclusao` | iguais |

O clique de WhatsApp dentro do resultado de um funil vira SubmitForm (lead), não Contact. `flow_view` e as etapas não vão ao TikTok.

## Microsoft Clarity

Mapas de calor e gravações. Só com consentimento de medição, no domínio oficial, com ID em `data/integracoes.json` (`clarity_id`). O diagnóstico é mascarado.

## Regras gerais

- Consentimento: `Aceitar` ou `Personalizar` no aviso. Medição (GA4 e Clarity) e publicidade (Google Ads, Meta, TikTok) são escolhas separadas.
- Páginas de anúncios (`data-medicao="avancada"`) usam o Consent Mode avançado do Google (sinais sem cookies se recusado).
- Tráfego da equipe: abrir `?interno=1` uma vez no navegador marca como interno (`traffic_type=internal`) e desliga Meta, TikTok e Clarity. `?interno=0` desmarca.
- Barra dupla no endereço (`//`) é corrigida antes de qualquer envio.
