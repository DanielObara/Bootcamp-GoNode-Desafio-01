const express = require("express");
const nunjucks = require("nunjucks");

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
  watch: true
});

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "njk");

/*
	req: request; Buscar alguma informação dada na requisição 
	Possui todas as informações da requisição por exemplo parametros
	
	res: response; é a resposta que daremos ao usuário, seja renderizando algum componente
*/

//Middleware para validar se a informação idade está preenchida
const isFilled = (req, res, next) => {
  //ATENÇÃO: AQUI USAMOS req.query
  // POIS OS DADOS FORAM PASSADOS POR QUERY PARAMS NA URL
  const { age } = req.query;
  if (!age) {
    return res.redirect("/");
  }

  //next significa que poderá prosseguir com a requisição/retorno
  return next();
};

//pagina inicial que renderizará um
// campo e um botão para submeter a idade
//a informação idade ficará contida no body
app.get("/", (req, res) => {
  //render para renderizar os componentes
  return res.render("age");
});

//Criar um post quando for enviar dados
//rota chamada pelo componente age que faz o post da idade no body
app.post("/check", (req, res) => {
  //ATENÇÃO: Aqui usamos req.body
  // pois os valores foram passados com post pelo 'age' component
  const { age } = req.body;

  if (age > 18) {
    /*Estamos retornando como resposta
		uma renderização para a página X passando parametro à mesma
		Para redirecionamento utilizaremos a barra /nomeCompoente
		*/
    return res.redirect(`/major?age=${age}`);
  } else {
    return res.redirect(`/minor?age=${age}`);
  }
});

//rota que chama a page major e passa o parametro age
app.get("/major", isFilled, (req, res) => {
  const { age } = req.query;
  //Para renderizar utilizamos apenas o nome do componente
  return res.render("major", { age });
});

//rota que chama a page minor e passa o parametro age
app.get("/minor", isFilled, (req, res) => {
  const { age } = req.query;

  return res.render("minor", { age });
});
app.listen(3000);
