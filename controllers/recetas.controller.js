import * as service from "../services/recetas.service.js";
import * as chefService from "../services/chefs.service.js";
import * as views from "../views/recetas.views.js";

export function getRecetas(req, res) {
  service.getRecetas().then((recetas) => {
    res.send(views.createRecetasListPage(recetas));
  });
}

export function getRecetaById(req, res) {
  const id = req.params.id;
  service.getRecetaById(id).then((receta) => {
    if (receta) {
      res.send(views.createDetailPage(receta));
    } else {
      res.send(views.errorPage());
    }
  });
}


export function buscarRecetas(req, res) {
  const search = req.query.search;
  const filtro = { search: search };

  if (search && search.trim() !== '') {
    filtro.search = search.trim();
  }

  service.getRecetas(filtro).then((recetas) => {
    const titulo = search ? `Resultados de búsqueda: "${search}"` : "Todas las recetas";
    res.send(views.createRecetasListPage(recetas, titulo));
  });
}




export function formularioNuevoReceta(req, res) {
  chefService.getChefs().then((chefs) => {
    res.send(views.formularioNuevoReceta(chefs));
  });
}


export function guardarReceta(req, res) {
  const receta = {
    name: req.body.name,
    description: req.body.description,
    section: req.body.section,
    link: req.body.link,
    img: req.body.img,
    chefId: req.body.chefId || null
  }
  service.guardarReceta(receta)
    .then(recetaGuardado => res.send(views.createDetailPage(recetaGuardado)))
}

export function formularioEditarReceta(req, res) {
  const id = req.params.id
  Promise.all([
    service.getRecetaById(id),
    chefService.getChefs()
  ]).then(([receta, chefs]) => {
    res.send(views.formularioEditarReceta(receta, chefs))
  })
}


export function editarReceta(req, res) {
  const id = req.params.id
  const receta = {
    id: id,
    name: req.body.name,
    description: req.body.description,
    section: req.body.section,
    link: req.body.link,
    img: req.body.img,
    chefId: req.body.chefId || null
  }
  service.editarReceta(receta)
    .then(recetaEditado => res.send(views.createDetailPage(recetaEditado)))
}

export function formularioBorrarReceta(req, res) {
  const id = req.params.id
  service.getRecetaById(id)
    .then((receta) => res.send(views.formularioBorrarReceta(receta)))
}

export function borrarReceta(req, res) {
  const id = req.params.id
  service.borrarReceta(id)
    .then((id) => res.send(views.borrarExito(id)))
}




export function getRecetaByCategoria(req, res) {
  const categoria = req.params.section;

  const filtro = { section: categoria };

  service.getRecetas(filtro).then((recetas) => {
    const titulo = `Recetas de ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`;
    res.send(views.createRecetasListPage(recetas, titulo));
  });
}







export function getRecetaByChef(req, res) {
  const chefId = req.params.chefId;

  Promise.all([
    service.getRecetas({ chefId: chefId }),
    chefService.getChefById(chefId)
  ]).then(([recetas, chef]) => {
    const titulo = chef ? `Recetas de ${chef.nombre}` : "Recetas del chef";
    res.send(views.createRecetasListPage(recetas, titulo));
  });
}