import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI();

async function main() {
  console.log("Iniciando requisição para OpenAI...");
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          `De acordo com a imagem enviada que se trata de uma imagem de um cardápio na qual tem categorias, produtos, descrições, valores, complementos, opções, adicionais e acompanhamentos. As categorias seriam uma classificação de produtos semelhantes, categorias comuns incluem: Pizzas, Bebidas, Sobremesas, Açaí, Lanches, Burguers, Pasteis, Doces. Os produtos são os itens específicos que estão dentro das categorias. Cada produto tem um nome e geralmente uma descrição na qual detalha o que nele inclui e valor do produto. O complemento do produto refere-se a itens adicionais que podem ser escolhidos para acompanhar ou personalizar o produto principal. Os complementos podem ter os nomes: Adicionais, Acompanhamentos, Complementos. As opções dos complementos são as diferentes opções de escolha para cada complemento. As opções também podem vir acompanhadas de descrição e valor. Por exemplo, em um cardápio de pizza a categoria seria 'Pizzas', o produto seria 'Pizzas 2 sabores', o complemento seria 'Escolha o sabor' e as opções seriam todos os sabores disponíveis agrupados um abaixo do outro com sua respectiva descrição e valor. Sempre que for um cardápio de pizza me retorne desta maneira com complementos e opções. Outro exemplo é o cardápio de açaí na qual a categoria poderia ser: 'Açaís', os produtos seriam os tamanhos dos açaís e os complementos seriam os acompanhamentos do açaí que podem ser: Acompanhamentos, Caldas, Toppings e Adicionais. As opções seriam todos os itens que estão presentes dentro dos complementos com suas descrições e valores. Em um cardápio de bolos a categoria deve ser: Bolos, os produtos devem ser os tamanhos dos bolos com sua descrição e valor. Os complementos do cardápio de bolos devem ser os recheios, massas, decoração, acompanhamentos e as opções serão todos os itens dentro do complemento com sua descrição e valor. Forneça a resposta em formato JSON sem formatação sempre especificando na resposta o que cada item significa se é categoria, produto, complemento, opção, descrição ou valor. Exemplo de saída:
     [{"category_name":"Pizzas","products":[{"product_name":"Pizzas 2 sabores","description":"Escolha 2 sabores","value":50,"complements":[{"complement_name":"Escolha o sabor","options":[{"option_name":"Calabresa","value":0},{"option_name":"Mussarela","value":0},{"option_name":"Portuguesa","value":5}]}]}]}]`,
          {
            type: "image_url",
            image_url: {
              url: "https://marketplace.canva.com/EAFNu8D_6qA/1/0/1131w/canva-card%C3%A1pio-para-hamburguerias-e-lanchonetes-profissional-laranja-preto-zfV3l3Chz0Q.jpg",
            },
          },
        ],
      },
    ],
    temperature: 0,
    response_format: { type: "json_object" },
  });

  console.log("Resposta da OpenAI recebida.");
  console.log("Resposta JSON:", JSON.stringify(response, null, 2));

  // Parse response
  const content = response.choices[0].message.content;
  const data = parseResponse(content);
  console.log(
    "Dados extraídos da resposta da OpenAI:",
    JSON.stringify(data, null, 2)
  );

  if (data && data.length > 0) {
    saveToCSV(data, "menu.csv");
    console.log("Arquivo CSV salvo com sucesso!");
  } else {
    console.error("Erro ao processar os dados para CSV.");
  }
}

function parseResponse(content) {
  console.log("Iniciando parse da resposta...");

  // Remove o código de formatação de markdown da string JSON
  const jsonString = content.replace(/```json\n|\n```/g, "");
  let data = [];

  try {
    // Analisa a string JSON em um objeto JavaScript
    const parsedData = JSON.parse(jsonString);

    // Função para adicionar uma entrada ao array `data`
    function addEntry(tipo, nome, descricao = "", valor = "") {
      data.push({
        tipo: tipo,
        nome: nome || "",
        descricao: descricao,
        valor: valor,
      });
    }

    // Função para processar opções
    function processOptions(opcoes) {
      opcoes.forEach((opcao) => {
        const opcaoNome =
          opcao.nome ||
          opcao.opcao ||
          opcao ||
          opções ||
          opções.nome ||
          opções.opções ||
          opcoes.opçoes ||
          opcoes.opçoes ||
          opcoes;
        addEntry("Opção", opcaoNome, opcao.descricao, opcao.valor);
      });
    }

    // Função para processar complementos
    function processComplements(complementos) {
      complementos.forEach((complemento) => {
        const complementoNome =
          complemento.nome ||
          complemento.complemento ||
          complemento ||
          complementos ||
          complementos.nome ||
          complementos.complementos;
        addEntry(
          "Complemento",
          complementoNome,
          complemento.descricao,
          complemento.valor
        );
        if (complemento.opcoes) {
          processOptions(complemento.opcoes);
        }
      });
    }

    // Função para processar produtos
    function processProducts(produtos) {
      produtos.forEach((produto) => {
        const produtoNome =
          produto.nome ||
          produto.produto ||
          produto ||
          itens ||
          produtos.produtos ||
          produtos.nome;
        addEntry("Produto", produtoNome, produto.descricao, produto.valor);

        if (produto.complementos) {
          processComplements(produto.complementos);
        }

        Object.keys(produto).forEach((key) => {
          if (key.toLowerCase() === "acompanhamentos") {
            processComplements(produto[key]);
          }
        });
      });
    }

    // Processa categorias e produtos
    if (parsedData.categorias) {
      parsedData.categorias.forEach((categoria) => {
        const categoriaNome =
          categoria.nome || categoria.categoria || Categoria || categoria;
        if (categoriaNome) {
          addEntry("Categoria", categoriaNome);
        }
        processProducts(categoria.produtos);
      });
    } else if (parsedData.categoria) {
      const categoriaNome = parsedData.categoria;
      if (categoriaNome) {
        addEntry("Categoria", categoriaNome);
      }
      processProducts(parsedData.produtos);
    } else if (parsedData.produtos) {
      processProducts(parsedData.produtos);
    }

    // Processa adicionais
    if (parsedData.adicionais) {
      parsedData.adicionais.forEach((adicional) => {
        const adicionalNome =
          adicional.nome || adicional.adicional || adicional;
        addEntry("Complemento", adicionalNome, "", adicional.valor);
      });
    }

    console.log("Dados extraídos da resposta da OpenAI:", data);
    return data;
  } catch (error) {
    console.error("Erro ao analisar a resposta JSON:", error);
  }
}

function saveToCSV(data, fileName) {
  const csvLines = [];

  // Adiciona o cabeçalho do CSV
  csvLines.push(
    "TIPO;NOME;DESCRIÇÃO;VALOR;VALOR DE CUSTO;VALOR PROMOCIONAL;IMAGEM;CODIGO PDV;DISPONIBILIDADE DO ITEM;TIPO COMPLEMENTO;QTDE MINIMA;QTDE MAXIMA;CALCULO DOS COMPLEMENTOS"
  );eeeeeeeeee

  // Adiciona os dados ao CSV
  data.forEach((item) => {
    csvLines.push(
      [
        item.tipo || "",
        item.nome || "",
        item.descricao || "",
        item.valor || "",
        item.valor_custo || "",
        item.valor_promocional || "",
        item.imagem || "",
        item.codigo_pdv || "",
        item.disponibilidade_do_item || "",
        item.tipo_complemento || "",
        item.qtde_minima || "",
        item.qtde_maxima || "",
        item.calculo_dos_complementos || "",
      ].join(";")
    );
  });

  // Cria o caminho do arquivo CSV
  const filePath = path.join(process.cwd(), fileName);

  // Salva o arquivo CSV
  fs.writeFileSync(filePath, csvLines.join("\n"), "utf8");
  console.log(`Dados salvos em ${filePath}`);
}

main();
