import {
  Tree,
  formatFiles,
  installPackagesTask,
  names,
  generateFiles,
  joinPathFragments, getProjects, logger,
} from '@nrwl/devkit';

interface Schema {
  name: string;
}

export default async function (tree: Tree, schema: Schema) {
  // if (!getProjects(tree).has(schema.project)) {
  //   logger.error(`Project ${schema.project} does not exist.`);
  //   return;
  // }
  const serviceRoot = `libs/model/src`;

  generateFiles(tree, joinPathFragments(__dirname, './files'), serviceRoot, {
    ...schema,
    tmpl: '',
    ...names(schema.name),
  });
}
