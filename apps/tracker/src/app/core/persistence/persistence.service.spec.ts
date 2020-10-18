import { TestBed } from '@angular/core/testing';

import { PersistenceService } from './persistence.service';

describe('AreasService', () => {
  let persistenceService: PersistenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersistenceService],
    });

    persistenceService = TestBed.inject(PersistenceService);
  });

  it('should be created', () => {
    expect(persistenceService).toBeTruthy();
  });

  describe('setCacheEntry', () => {
    it('should set and get a cache entry', () => {
      persistenceService.setCacheEntry('test1Key', null);

      persistenceService.setCacheEntry('test1Key', { value: 'test1' });

      const result1 = persistenceService.getCacheEntry<{ value: string }>('test1Key');

      expect(result1).toBeDefined();
      expect(result1.value).toEqual('test1');

      persistenceService.setCacheEntry('test2Key', { value: 'test2' }, true);

      const result2 = persistenceService.getCacheEntry<{ value: string }>('test2Key');

      expect(result2).toBeDefined();
      expect(result2.value).toEqual('test2');
    });

    it('should set and clear a cache entry', () => {
      persistenceService.setCacheEntry('test1Key', { value: 'test1' });

      const result1 = persistenceService.getCacheEntry<{ value: string }>('test1Key');

      expect(result1).toBeDefined();
      expect(result1.value).toEqual('test1');

      persistenceService.clearCacheEntry('notakey');

      persistenceService.clearCacheEntry('test1Key');

      const clear1 = persistenceService.getCacheEntry<{ value: string }>('test1Key');

      expect(clear1).toBeUndefined();

      persistenceService.setCacheEntry('test2Key', { value: 'test2' }, true);

      const result2 = persistenceService.getCacheEntry<{ value: string }>('test2Key');

      expect(result2).toBeDefined();
      expect(result2.value).toEqual('test2');

      persistenceService.clearCacheEntry('test2Key', true);

      const clear12 = persistenceService.getCacheEntry<{ value: string }>('test2Key');

      expect(clear12).toBeUndefined();
    });

    it('should clear flow cache', () => {
      persistenceService.setCacheEntry('test1Key', { value: 'test1' }, true);

      const result1 = persistenceService.getCacheEntry<{ value: string }>('test1Key');

      expect(result1).toBeDefined();
      expect(result1.value).toEqual('test1');

      persistenceService.clearFlowCache();

      const result2 = persistenceService.getCacheEntry<{ value: string }>('test1Key');

      expect(result2).toBeUndefined();

      const result3 = persistenceService.getCacheEntry<{ value: string }>('test1Key', { value: 'default' });

      expect(result3).toBeDefined();
      expect(result3.value).toEqual('default');
    });

    it('should clear cache', () => {
      persistenceService.setCacheEntry('test1Key', { value: 'test1' });
      persistenceService.setCacheEntry('test2Key', { value: 'test2' }, true);

      const result1 = persistenceService.getCacheEntry<{ value: string }>('test1Key');

      expect(result1).toBeDefined();
      expect(result1.value).toEqual('test1');

      persistenceService.clearCache();

      const result2 = persistenceService.getCacheEntry<{ value: string }>('test1Key');

      expect(result2).toBeUndefined();
    });
  });
});
