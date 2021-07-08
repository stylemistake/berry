import { Locator, Project, structUtils } from '@yarnpkg/core';
import { Filename, ppath } from '@yarnpkg/fslib';

export const getVendorPath = (project: Project) => {
  const config = project.configuration;
  return config.get('dmVendorFolder') as Filename;
};

export const getVendoredPackagePath = (
  project: Project, 
  locator: Locator,
) => {
  return ppath.join(
    getVendorPath(project),
    structUtils.slugifyLocator(locator)
  );
};

export const getIncludePath = (project: Project) => {
  return ppath.join(
    getVendorPath(project),
    'includes.dm' as Filename,
  );
};

export const getPathmapPath = (project: Project) => {
  return ppath.join(
    getVendorPath(project),
    'pathmap.json' as Filename,
  );
};
