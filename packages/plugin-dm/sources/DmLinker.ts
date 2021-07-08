import { Linker, LinkOptions, Locator, MinimalLinkOptions, Package, structUtils } from '@yarnpkg/core';
import { Filename, PortablePath, ppath, xfs } from '@yarnpkg/fslib';
import { UsageError } from 'clipanion';
import { DmInstaller } from './DmInstaller';
import { getPathmapPath, getVendorPath } from './paths';

const DM_LANG_NAME = 'dm';

export class DmLinker implements Linker {
  supportsPackage(pkg: Package, opts: MinimalLinkOptions) {
    return pkg.languageName === DM_LANG_NAME;
  }

  async findPackageLocation(locator: Locator, opts: LinkOptions) {
    const pathmapFile = getPathmapPath(opts.project);
    if (!await xfs.existsPromise(pathmapFile)) {
      throw new UsageError(`The project in ${opts.project.cwd}/package.json doesn't seem to have been installed - running 'yarn install' might help`);
    }

    const pathmap = await xfs.readJsonPromise(pathmapFile);

    const location = pathmap[structUtils.stringifyLocator(locator)];
    if (location === undefined) {
      throw new UsageError(`Couldn't find ${structUtils.prettyLocator(opts.project.configuration, locator)} in the install registry - running 'yarn install' might help`);
    }

    return ppath.join(opts.project.cwd, location);
  }

  async findPackageLocator(location: PortablePath, opts: LinkOptions) {
    const vendorPath = getVendorPath(opts.project);

    const relative = ppath.contains(vendorPath, location);
    if (relative === null) {
      return null;
    }

    const parts = relative.split(ppath.sep);
    if (parts.length === 0) {
      return null;
    }

    const metaPath = ppath.join(vendorPath, parts[0] as Filename);
    if (!await xfs.existsPromise(metaPath)) {
      return null;
    }

    const meta = await xfs.readJsonPromise(metaPath);
    return structUtils.parseLocator(meta.locator);
  }

  makeInstaller(opts: LinkOptions) {
    return new DmInstaller(opts);
  }
}
