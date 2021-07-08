import { Hooks, Plugin, SettingsType } from '@yarnpkg/core';
import { PortablePath } from '@yarnpkg/fslib';
import { DmLinker } from './DmLinker';

declare module '@yarnpkg/core' {
  interface ConfigurationValueMap {
    dmLinker: boolean;
    dmVendorFolder: PortablePath;
  }
}

const plugin: Plugin<Hooks> = {
  configuration: {
    dmLinker: {
      type: SettingsType.BOOLEAN,
      description: `Enables DM linker`,
      default: false,
    },
    dmVendorFolder: {
      type: SettingsType.ABSOLUTE_PATH,
      description: `Path where the packages will be extracted for later use`,
      default: `./vendor`,
    },
  },
  hooks: {
    afterAllInstalled: () => {
      console.log(`What a great DM install, am I right?`);
    },
  },
  linkers: [
    DmLinker,
  ],
};

export default plugin;
