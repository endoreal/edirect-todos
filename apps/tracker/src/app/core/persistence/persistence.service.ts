import { Injectable } from '@angular/core';

import { Logger } from '../logger/logger.service';

const log = new Logger('Persistence');

@Injectable()
export class PersistenceService {
  /**
   * Application Level Persistence. Should be kept throughout
   */
  private staticPersistenceKeys: string[] = [];
  private staticPersistenceKey = 'staticKeys';

  private flowPersistenceKeys: string[] = [];
  private flowPersistenceKey = 'flowKeys';

  constructor() {
    this.staticPersistenceKeys = JSON.parse(sessionStorage.getItem(this.staticPersistenceKey)) ?? [];
    this.flowPersistenceKeys = JSON.parse(sessionStorage.getItem(this.flowPersistenceKey)) ?? [];
  }

  public clearCache() {
    this.staticPersistenceKeys.forEach((key) => {
      sessionStorage.removeItem(key);
    });

    this.flowPersistenceKeys.forEach((key) => {
      sessionStorage.removeItem(key);
    });

    this.staticPersistenceKeys = [];
    this.flowPersistenceKeys = [];

    sessionStorage.removeItem(this.staticPersistenceKey);
    sessionStorage.removeItem(this.flowPersistenceKey);

    log.debug('Cache cleared.');
  }

  public clearFlowCache() {
    this.flowPersistenceKeys.forEach((key) => {
      sessionStorage.removeItem(key);
    });

    this.flowPersistenceKeys = [];

    sessionStorage.removeItem(this.flowPersistenceKey);

    log.debug('Flow cache cleared.');
  }

  /**
   * Sets a browser cache entry.
   * @param key The cache entry identifier. This value should be declared in the flow.constant collection.
   * @param data The data you want to save in this cache entry.
   * @param flow Determines if this cache entry is bound to a flow or not. If it is it will be automatically cleared when closing or starting any flow.
   */
  public setCacheEntry<T = any>(key: string, data: T, flow?: boolean) {

    if (!(data == null)) {
      sessionStorage.setItem(key, JSON.stringify(data));

      if (flow) {
        if (this.flowPersistenceKeys.indexOf(key) === -1) {
          this.flowPersistenceKeys.push(key);
        }
      } else {
        if (this.staticPersistenceKeys.indexOf(key) === -1) {
          this.staticPersistenceKeys.push(key);
        }
      }

      sessionStorage.setItem(this.staticPersistenceKey, JSON.stringify(this.staticPersistenceKeys));
      sessionStorage.setItem(this.flowPersistenceKey, JSON.stringify(this.flowPersistenceKeys));

      log.debug(`Cache entry saved: "${key}"`);
    }
  }

  /**
   * Retrives a set browser cache entry.
   * @param key The cache entry identifier. This value should be declared in the flow.constant collection.
   * @param defaultValue The value to return if the entry is not found.
   */
  public getCacheEntry<T = any>(key: string, defaultValue?: T): T {
    log.debug(`Cache entry fetched: "${key}"`);

    return (JSON.parse(sessionStorage.getItem(key)) as T) ?? defaultValue;
  }

  public clearCacheEntry(key: string, flow?: boolean) {
    let index: number;

    if (flow) {
      index = this.flowPersistenceKeys.indexOf(key);
    } else {
      index = this.staticPersistenceKeys.indexOf(key);
    }

    if (index > -1) {
      if (flow) {
        this.flowPersistenceKeys.splice(index, 1);
      } else {
        this.staticPersistenceKeys.splice(index, 1);
      }

      sessionStorage.removeItem(key);

      sessionStorage.setItem(this.staticPersistenceKey, JSON.stringify(this.staticPersistenceKeys));
      sessionStorage.setItem(this.flowPersistenceKey, JSON.stringify(this.flowPersistenceKeys));

      log.debug(`Cache entry cleared: "${key}"`);
    }
  }
}
