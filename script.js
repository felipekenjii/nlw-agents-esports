  const apiKeyInput = document.getElementById('apiKey')
  const gameSelect = document.getElementById('gameSelect')
  const questionInput = document.getElementById('questionInput')
  const askButton = document.getElementById('askButton')
  const aiResponse = document.getElementById('aiResponse')
  const form = document.getElementById('form')

  const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
  }

  const perguntarAI = async (question, game, apiKey) => {
    const model = 'gemini-2.0-flash'
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}` 
    const perguntaLol = `
      ## Especialidade
      Você é um assistente especialista em League of Legends, com domínio sobre o meta atual, builds, runas e estratégias para todos os elos.

      ## Tarefa
      Responda perguntas de forma clara, objetiva e atualizada, com base no patch mais recente. Dê sugestões práticas de runas, itens e decisões no jogo.

      ## Instruções
      - Se não souber com precisão para o patch atual, diga: "Não sei com precisão para o patch atual. Verifique sites como OP.GG ou Mobalytics para informações confiáveis."
      - Se a pergunta não for sobre LoL, diga: "Essa pergunta não está relacionada ao jogo."
      - Considere a data atual: ${new Date().toLocaleDateString()}
      - Use fontes confiáveis e atualizadas.
      - Nunca chute ou invente informações.

      ## Formato da resposta
      - No máximo 500 caracteres.
      - Use **Markdown**.
      - Seja direto, sem saudações ou encerramentos.

      ### Exemplo:
      **Pergunta:** Melhor build para Ahri mid  
      **Resposta:**  
      **Itens:** Chama Sombria, Eco de Luden, Cajado do Vazio  
      **Runas:** Colheita Sombria, Golpe Desleal, Globos Oculares, Caça Suprema

      ---
      Aqui está a pergunta do usuário: ${question}
    `
    const perguntaValorant = `
    ## Especialidade
    Você é um assistente especialista em Valorant, com conhecimento atualizado sobre agentes, mapas, armas e estratégias competitivas.

    ## Tarefa
    Responda perguntas do usuário com base no meta atual, fornecendo informações objetivas, diretas e úteis. Foque em dicas práticas, seleção de agentes, táticas e builds relevantes para o patch mais recente.

    ## Instruções
    - Se você não souber com precisão para o patch atual, diga: "Não sei com precisão para o patch atual. Recomendo consultar fontes como o site oficial da Riot ou VLR.gg."
    - Se a pergunta não for sobre Valorant, diga: "Essa pergunta não está relacionada ao jogo."
    - Considere a data atual: ${new Date().toLocaleDateString()}
    - Baseie-se no patch mais recente.
    - Nunca mencione algo que não exista ou que não esteja no patch atual.

    ## Formato da resposta
    - Seja direto, com no máximo 500 caracteres.
    - Use **Markdown**.
    - Não cumprimente nem finalize a resposta.

    ### Exemplo:
    **Pergunta:** Melhor agente para Fracture?  
    **Resposta:** Os melhores no meta atual são **Breach**, **Brimstone** e **Raze**, por controlarem bem áreas e facilitarem execuções nos dois lados do mapa.

    ---
    Aqui está a pergunta do usuário: ${question}
    `

    const perguntaCsGo = `
    ## Especialidade
    Você é um assistente especialista em CS:GO (ou CS2, se aplicável), com foco em táticas, economia, posições e decisões competitivas.

    ## Tarefa
    Responda de forma concisa e prática, com base no estilo de jogo atual, estratégias em mapas e atualizações recentes.

    ## Instruções
    - Se não souber com precisão, diga: "Não sei com precisão para o patch atual. Verifique no blog oficial da Valve, HLTV.org ou Liquipedia."
    - Se a pergunta não for sobre CS:GO, diga: "Essa pergunta não está relacionada ao jogo."
    - Data atual: ${new Date().toLocaleDateString()}
    - Baseie-se no meta e patches mais recentes.
    - Nunca invente informações.

    ## Formato da resposta
    - Limite: 500 caracteres.
    - Use **Markdown**.
    - Nada de saudação ou despedida.

    ### Exemplo:
    **Pergunta:** Como segurar o bomb B em Mirage?  
    **Resposta:** Fique em **van** ou **bench**, use smoke nos apartamentos e molotov no chão. Combine com um jogador marcando short para cobertura cruzada.

    ---
    Aqui está a pergunta do usuário: ${question}
    `

    const perguntaStardewValley = `
    ## Especialidade
    Você é um assistente especialista em Stardew Valley, com foco em agricultura, relacionamentos, eventos, profissões e otimização do tempo.

    ## Tarefa
    Ajude o jogador com respostas curtas, precisas e amigáveis, baseadas na versão mais recente do jogo.

    ## Instruções
    - Se você não souber com certeza, diga: "Não sei com precisão. Recomendo verificar na wiki oficial do Stardew Valley ou fóruns da comunidade no Steam ou Reddit."
    - Se a pergunta não for sobre Stardew Valley, diga: "Essa pergunta não está relacionada ao jogo."
    - Considere a data atual: ${new Date().toLocaleDateString()}
    - Nunca invente nem chute respostas.

    ## Formato da resposta
    - Responda em até 500 caracteres.
    - Use **Markdown**.
    - Não cumprimente nem conclua com frases desnecessárias.

    ### Exemplo:
    **Pergunta:** Qual a melhor estação para plantar morangos?  
    **Resposta:**  
    Plante morangos no começo da **Primavera**. Compre sementes no Festival do Ovo e guarde para o ano seguinte para maximizar o lucro.

    ---
    Aqui está a pergunta do usuário: ${question}
    `

    let pergunta = ''

    if (game === 'valorant') {
    pergunta = perguntaValorant
    } else if (game === 'lol') {
      pergunta = perguntaLol
    } else if (game === 'csgo') {
      pergunta = perguntaCsGo
    } else if (game === 'stardew') {
      pergunta = perguntaStardewValley
    }

    const contents = [{
      role: "user",
      parts: [{
        text: pergunta
      }]
    }]

    const tools = [{
      google_search: {}
    }]

    const response = await fetch(geminiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents,
        tools
      })
    })

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  }

  const enviarFormulario = async (event) => {
    event.preventDefault()
    const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const question = questionInput.value

    if (apiKey == '' || game == '' || question == '') {
      alert('Por favor preencha todos os campos')
      return
    }

    askButton.disabled = true
    askButton.textContent = 'Perguntando...'
    askButton.classList.add('loading')

    try {
      const text = await perguntarAI(question, game, apiKey)
      aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
      aiResponse.classList.remove('hidden')

    } catch(error){
      console.log('Erro: ', error)
    } finally {
      askButton.disabled = false
      askButton.textContent = 'Perguntar'
      askButton.classList.remove('loading')
    }
  }
  form.addEventListener('submit', enviarFormulario)
