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
  const indexFile = `${serviceRoot}/index.ts`;
  const n = names(schema.name);

  let indexFileContent = tree.read(indexFile)?.toString('utf8') ?? '';
  indexFileContent += `\nexport * from './lib/${n.className}'`
  tree.write(indexFile, indexFileContent)


  generateFiles(tree, joinPathFragments(__dirname, './files'), serviceRoot, {
    ...schema,
    tmpl: '',
    ...n,
  });
}
