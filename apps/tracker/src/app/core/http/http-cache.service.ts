import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { Logger } from '../logger/logger.service';

const log = new Logger('HttpCacheService');

const cachePersistenceKey = 'httpCache';

export interface HttpCacheEntry {
  lastUpdated: Date;
  data: HttpResponse<unknown>;
}

/**
 * Provides a cache facility for HTTP requests with configurable persistence policy.
 */
@Injectable()
export class HttpCacheService {
  private cachedData: { [key: string]: HttpCacheEntry } = {};
  private storage: Storage | null = null;

  constructor() {
    this.loadCacheData();
  }

  /**
   * Sets the cache data for the specified request.
   */
  setCacheData(url: string, data: HttpResponse<unknown>, lastUpdated?: Date) {
    this.cachedData[url] = {
      lastUpdated: lastUpdated || new Date(),
      data,
    };

    log.debug(`Cache set for key: "${url}"`);

    this.saveCacheData();
  }

  /**
   * Gets the cached data for the specified request.
   */
  getCacheData(url: string): HttpResponse<unknown> | null {
    const cacheEntry = this.cachedData[url];

    if (cacheEntry) {
      log.debug(`Cache hit for key: "${url}"`);

      return cacheEntry.data;
    }

    return null;
  }

  /**
   * Gets the cached entry for the specified request.
   */
  getHttpCacheEntry(url: string): HttpCacheEntry | null {
    return this.cachedData[url] || null;
  }

  /**
   * Clears the cached entry (if exists) for the specified request.
   */
  clearCache(url: string): void {
    delete this.cachedData[url];

    log.debug(`Cache cleared for key: "${url}"`);

    this.saveCacheData();
  }

  /**
   * Cleans cache entries older than the specified date.
   */
  cleanCache(expirationDate?: Date) {
    if (expirationDate) {
      Object.keys(this.cachedData).forEach((key) => {
        const value: HttpCacheEntry = this.cachedData[key];

        if (expirationDate >= value.lastUpdated) {
          delete this.cachedData[key];
        }
      });
    } else {
      this.cachedData = {};
    }

    this.saveCacheData();
  }

  /**
   * Sets the cache persistence policy.
   * Note that changing the cache persistence will also clear the cache from its previous storage.
   */
  setPersistence(persistence?: 'local' | 'session') {
    this.cleanCache();

    this.storage = persistence === 'local' || persistence === 'session' ? window[persistence + 'Storage'] : null;

    this.loadCacheData();
  }

  private saveCacheData() {
    if (this.storage) {
      this.storage[cachePersistenceKey] = JSON.stringify(this.cachedData);
    }
  }

  private loadCacheData() {
    const data = this.storage ? this.storage[cachePersistenceKey] : null;

    this.cachedData = data ? JSON.parse(data) : {};
  }
}
