import { afterEach, describe, expect, it } from 'vitest';
import {
  _getConfigManager,
  configurarGlobalmente,
  obtenerConfiguracionGlobal,
  resetearConfiguracion
} from '../src/config/global-config';

afterEach(() => {
  resetearConfiguracion();
});

describe('global config manager', () => {
  it('merges local options with defaults', () => {
    configurarGlobalmente({
      defaultOptions: {
        format: 'html',
        expandOnlyFirst: true
      }
    });

    const merged = _getConfigManager().mergeOptions({ preserveCase: false });
    expect(merged.format).toBe('html');
    expect(merged.expandOnlyFirst).toBe(true);
    expect(merged.preserveCase).toBe(false);
  });

  it('evaluates shouldExpand with forceExpansion override', () => {
    configurarGlobalmente({ enabled: false });

    expect(_getConfigManager().shouldExpand()).toBe(false);
    expect(_getConfigManager().shouldExpand({ forceExpansion: true })).toBe(true);
    expect(_getConfigManager().shouldExpand({ forceExpansion: false })).toBe(false);
  });

  it('returns snapshot config from public API', () => {
    configurarGlobalmente({
      enabled: true,
      defaultOptions: {
        exclude: ['BOE']
      }
    });

    const config = obtenerConfiguracionGlobal();
    expect(config.enabled).toBe(true);
    expect(config.defaultOptions?.exclude).toEqual(['BOE']);
  });

  it('resets defaults', () => {
    configurarGlobalmente({ enabled: false });
    resetearConfiguracion();

    expect(obtenerConfiguracionGlobal().enabled).toBe(true);
  });
});
