import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI();

async function main() {
  console.log("Iniciando requisição para OpenAI...");

  const imagePaths = [
    "C:\\Users\\isaac\\OneDrive\\Pictures\\Screenshots\\e1.png",
  ];

  const imageBuffers = imagePaths.map((imagePath) =>
    fs.readFileSync(imagePath)
  );

  const prompt = `
De acordo com as imagens enviadas, que são imagens de um cardápio, você encontrará várias seções importantes: categorias, produtos, descrições, valores, complementos, tipos de complemento, promoções, opções, adicionais e acompanhamentos.

1. Categorias: São classificações de produtos semelhantes. Algumas categorias comuns incluem: Pizzas, Bebidas, Sobremesas, Açaí, Lanches, Burguers, Pasteis, e Doces.

2. Produtos: São itens específicos dentro de cada categoria. Cada produto tem um nome e geralmente uma descrição detalhando seus componentes e o valor do produto. Sempre que tiver tamanhos eles devem ser tratados como produtos. por exemplo, Pizza P(Pequena), Pizza M(Média), Pizza G(Grande), 35cm, 45cm, 65cm.

3. Descrições: São textos que fornecem detalhes adicionais sobre um produto, complemento ou opção. A descrição pode incluir informações sobre os ingredientes, tamanho, ou outros detalhes relevantes.

4. Valores: Referem-se ao custo em dinheiro associado a um produto, complemento ou opção. Se um valor não estiver explícito na imagem, ele deve ser considerado como 0.

5. Complementos: Referem-se a itens adicionais que podem ser escolhidos para acompanhar ou personalizar o produto principal. Os complementos podem ser denominados como: Adicionais, Acompanhamentos, Complementos ou Acréscimos. Cada complemento deve ser sempre associado diretamente a todos os produtos correspondentes, aparecendo logo após o outro.

6. Promoções: Referem-se aos itens promocionais do cardápio. Quando tem promoções aparece no cardápio um valor com um traço no meio e um valor sem este traço, que agora se passa a ser o valor normal do produto. O valor que aparece com um traço se torna o valor e o valor sem o traço se torna o valor promocional, no caso o "promotion_value"

7. Tipos de complementos: Referem-se aos tipos de todos os complementos. Os tipos de complemento podem ser "Apenas uma opcao" , "Mais de uma opcao sem repeticao" e "Mais de uma opcao com repeticao" e sempre que que for complemento, terá o tipo de complemento. Fora isto, também apresentam a "QTDE MINIMA" e "QTDE MAXIMA" que podem ser "1" ou "2".

8. Opções: São diferentes escolhas disponíveis para cada complemento. As opções podem vir acompanhadas de descrições e valores. As opções devem ser associadas a todos os produtos igual os complementos

Exemplos Específicos:
Cardápio de Pizza:
- Categoria: "Pizzas"
- Produto: "Pizza 2 Sabores"
- Complemento: "Escolha o Sabor"
- Opções: Lista de todos os sabores disponíveis, cada um com sua descrição e valor.
- Observação: Sempre que for cardápio de pizza deve vir neste padrão, a categoria deve ser pizza, o produto deve ser pizza 2 sabores, o complemento deve ser "Escolha o sabor" e os sabores das pizzas devem ser as opções. E sempre que tiver tamanhos eles devem ser tratados como produtos. por exemplo, Pizza P, Pizza M, Pizza G, 35cm, 45cm, 65cm.

Cardápio de Açaí:
- Categoria: "Açaís"
- Produtos: Tamanhos dos açaís
- Complementos: Podem incluir "Acompanhamentos", "Caldas", "Toppings" e "Adicionais"
- Opções: Todos os itens disponíveis dentro dos complementos, cada um com descrição e valor.

Cardápio de Bolos:
- Categoria: "Bolos"
- Produtos: Tamanhos dos bolos com descrição e valor
- Complementos: Podem incluir "Recheios", "Massas", "Decoração", "Acompanhamentos"
- Opções: Todos os itens dentro dos complementos, cada um com descrição e valor.

Cardápio de Sushi:
- Categoria: Podem ser "Hossomaki", "Uramakis", "Hot Rolls", "Temakis" ou "Niguiri"
- Produtos: Diferentes sabores do sushi
- Complementos: "Escolha as peças"
- Opções: Podem incluir todos os sabores de sushi

Cardápio de Pastéis:
- Categoria: "Pastéis"
- Produto: "Pastel Salgado" ou "Pastel Doce"
- Complemento: "Escolha o sabor"
- Opções: Lista de sabores disponíveis

Cardápio de Churrasco:
- Categoria: "Churrascos"
- Produto: "Picanha"
- Complemento: "Escolha o ponto da carne"
- Opções: "Bem passado" , "Mal passado" e "Ao ponto".

Instruções para Resposta:
- Especificação: Sempre especifique na resposta o que cada item representa: categoria, produto, complemento, opção, descrição ou valor.
- Valores: Se um valor não estiver explícito na imagem, considere-o como 0.
- Formato de Resposta: Forneça a resposta sempre em formato JSON sem formatação.
- Ordem de resposta: Forneça a resposta sempre na ordem dos produtos da esquerda para a direita
- Sempre que tiver refrigerantes, sucos e drinks os sabores devem ficar nos complementos e as opções devem ser os respectivos sabores
- Sempre que tiver as palavras "Adicionais", "Acompanhamentos", "Complementos" ou "Acréscimos" eles devem ser tratados como complementos dos produtos em questão.
- Associação de Complementos: Cada produto deve ter seus complementos diretamente associados. Um complemento deve aparecer logo após o produto correspondente.
- Ordem e Estrutura: A ordem das informações deve seguir a estrutura natural do cardápio. Isso significa que os complementos e opções devem ser listados imediatamente após o produto ao qual pertencem.
- Ajuste a ortografia das palavras caso elas apareçam de forma errada, porém não mude o sentido da palavra.
- Sempre que tiver o termo "ou" nas descrições coloque as opções de escolhas nos complementos.

Exemplo de saída:
[{"category_name":"Pizzas","products":[{"product_name":"Pizzas 2 sabores","description":"Escolha 2 sabores","value":50,"promotion_value":45"complements":[{"complement_name":"Escolha o sabor", "complement_type":"Mais de uma opcao sem repetição","qtd_minima": "1", "maxima": "2" "options":[{"option_name":"Calabresa","value":0},{"option_name":"Mussarela","value":0},{"option_name":"Portuguesa","value":5}]}]}]}]
`;

  const imageUrls = imageBuffers.map((buffer) => ({
    type: "image_url",
    image_url: {
      url: "data:image/png;base64," + buffer.toString("base64"),
    },
  }));

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [prompt, ...imageUrls],
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

  // estabelece a conexão com MySQL
  const mysql = require("mysql2");

  // Configuração do banco de dados
  const connection = mysql.createConnection({
    host: "localhost",
    user: "usuario",
    password: "senha",
    database: "banco",
  });

  // Conectar ao MySQL e salvar as informações
  connection.connect((err) => {
    if (err) {
      console.error("Erro ao conectar ao banco de dados:", err);
      return;
    }
    console.log("Conectado ao banco de dados MySQL!");
    saveToDatabase(data);
  });
}

function parseResponse(content) {
  console.log("Iniciando parse da resposta...");

  const jsonString = content.replace(/```json\n|\n```/g, "");
  let data = [];

  try {
    const parsedData = JSON.parse(jsonString);

    function addEntry(
      tipo,
      nome,
      descricao = "",
      valor = "",
      valorPromocional = "",
      tipoComplemento = "",
      qtdMinima = "",
      qtdMaxima = ""
    ) {
      // Formatar o valor para usar vírgula em vez de ponto
      const valorFormatado = valor ? valor.toString().replace(".", ",") : "";
      const valorPromocionalFormatado = valorPromocional
        ? valorPromocional.toString().replace(".", ",")
        : "";
      data.push({
        tipo: tipo,
        nome: nome || "",
        descricao: descricao,
        valor: valorFormatado, // Usar o valor formatado
        "valor promocional": valorPromocionalFormatado,
        "tipo complemento": tipoComplemento,
        "qtde minima": qtdMinima,
        "qtde maxima": qtdMaxima,
      });
    }

    function processOptions(opcoes) {
      opcoes.forEach((opcao) => {
        addEntry("Opcao", opcao.option_name, opcao.description, opcao.value);
      });
    }

    function processComplements(complementos) {
      complementos.forEach((complemento) => {
        addEntry(
          "Complemento",
          complemento.complement_name,
          "",
          "",
          "",
          complemento.complement_type,
          complemento.qtd_minima,
          complemento.qtd_maxima
        );
        if (complemento.options) {
          processOptions(complemento.options);
        }
      });
    }

    function processProducts(produtos) {
      produtos.forEach((produto) => {
        addEntry(
          "Produto",
          produto.product_name,
          produto.description,
          produto.value,
          produto.promotion_value // Adiciona o valor promocional
        );
        if (produto.complements) {
          processComplements(produto.complements);
        }
      });
    }

    if (parsedData.categories) {
      parsedData.categories.forEach((category) => {
        addEntry("Categoria", category.category_name);
        processProducts(category.products);
      });
    } else if (parsedData.category_name) {
      addEntry("Categoria", parsedData.category_name);
      processProducts(parsedData.products);
    } else if (parsedData.products) {
      processProducts(parsedData.products);
    }

    if (parsedData.complements) {
      processComplements(parsedData.complements);
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
  );

  // Adiciona os dados ao CSV
  data.forEach((item) => {
    csvLines.push(
      [
        item.tipo || "",
        item.nome || "",
        item.descricao || "",
        item.valor || "",
        item["valor de custo"] || "",
        item["valor promocional"] || "",
        item.imagem || "",
        item["codigo pdv"] || "",
        item["disponibilidade do item"] || "",
        item["tipo complemento"] || "",
        item["qtde minima"] || "",
        item["qtde maxima"] || "",
        item["calculo dos complementos"] || "",
      ].join(";")
    );
  });

  // Escreve o arquivo CSV
  fs.writeFileSync(fileName, csvLines.join("\n"));
}

function saveToDatabase(data) {
  const query = `
    INSERT INTO menu_items 
    (tipo, nome, descricao, valor, valor_promocional, tipo_complemento, qtd_minima, qtd_maxima) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  data.forEach((item) => {
    const values = [
      item.tipo || "",
      item.nome || "",
      item.descricao || "",
      item.valor ? parseFloat(item.valor.replace(",", ".")) : null,
      item["valor promocional"]
        ? parseFloat(item["valor promocional"].replace(",", "."))
        : null,
      item["tipo complemento"] || "",
      item["qtde minima"] ? parseInt(item["qtde minima"]) : null,
      item["qtde maxima"] ? parseInt(item["qtde maxima"]) : null,
    ];

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error("Erro ao inserir dados:", err);
      } else {
        console.log("Dados inseridos com sucesso:", results.insertId);
      }
    });
  });
}

function manageProduct(action, productData = {}, callback) {
  let query;
  let values = [];

  switch (action) {
    case "insert":
      query = `
        INSERT INTO menu_items (tipo, nome, descricao, valor, valor_promocional, tipo_complemento, qtd_minima, qtd_maxima)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      values = [
        "Produto",
        productData.nome || "",
        productData.descricao || "",
        productData.valor ? parseFloat(productData.valor.replace(",", ".")) : null,
        productData.valor_promocional
          ? parseFloat(productData.valor_promocional.replace(",", "."))
          : null,
        productData.tipo_complemento || "",
        productData.qtd_minima ? parseInt(productData.qtd_minima) : null,
        productData.qtd_maxima ? parseInt(productData.qtd_maxima) : null,
      ];
      break;

    case "update":
      query = `
        UPDATE menu_items
        SET nome = ?, descricao = ?, valor = ?, valor_promocional = ?, tipo_complemento = ?, qtd_minima = ?, qtd_maxima = ?
        WHERE id = ?
      `;
      values = [
        productData.nome || "",
        productData.descricao || "",
        productData.valor ? parseFloat(productData.valor.replace(",", ".")) : null,
        productData.valor_promocional
          ? parseFloat(productData.valor_promocional.replace(",", "."))
          : null,
        productData.tipo_complemento || "",
        productData.qtd_minima ? parseInt(productData.qtd_minima) : null,
        productData.qtd_maxima ? parseInt(productData.qtd_maxima) : null,
        productData.id,
      ];
      break;

    case "delete":
      query = `DELETE FROM menu_items WHERE id = ?`;
      values = [productData.id];
      break;

    case "getAll":
      query = `SELECT * FROM menu_items WHERE tipo = 'Produto'`;
      values = [];
      break;

    case "getById":
      query = `SELECT * FROM menu_items WHERE id = ?`;
      values = [productData.id];
      break;

    default:
      console.error("Ação inválida!");
      return;
  }

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error("Erro ao executar a ação no banco de dados:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
}


// Executa a função main
main().catch((error) => console.error("Erro no script principal:", error));

/*************************EXEMPLOS DE MANIPULAÇÃO DOS PRODUTOS NO BANCO*********************/
//INSERE MANUALMENTE O PRODUTO
manageProduct(
  "insert",
  {
    nome: "Hamburger",
    descricao: "Delicioso hamburger artesanal",
    valor: "12,99",
    valor_promocional: "10,99",
    tipo_complemento: "",
    qtd_minima: 0,
    qtd_maxima: 0,
  },
  (err, results) => {
    if (!err) console.log("Produto inserido com sucesso!");
  }
);

//ATUALIZA UM PRODUTO ESPECÍFICO
manageProduct(
  "update",
  {
    id: 1,
    nome: "Hamburger Especial",
    descricao: "Hamburger com ingredientes premium",
    valor: "15,99",
    valor_promocional: "13,99",
    tipo_complemento: "",
    qtd_minima: 0,
    qtd_maxima: 0,
  },
  (err, results) => {
    if (!err) console.log("Produto atualizado com sucesso!");
  }
);

//EXCLUI UM PRODUTO
manageProduct("delete", { id: 1 }, (err, results) => {
  if (!err) console.log("Produto deletado com sucesso!");
});

//RETORNA TODOS OS PRODUTOS
manageProduct("getAll", {}, (err, results) => {
  if (!err) console.log("Lista de produtos:", results);
});

//RETORNA UM PRODUTO ESPECÍFICO
manageProduct("getById", { id: 1 }, (err, results) => {
  if (!err) console.log("Produto encontrado:", results);
});
