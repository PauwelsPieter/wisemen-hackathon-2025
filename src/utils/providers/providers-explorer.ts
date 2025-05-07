import { Injectable, OnApplicationBootstrap, Type } from '@nestjs/common'
import { ModulesContainer } from '@nestjs/core'

export interface NestjsProvider {
  providerClass: Type<unknown>
  providerInstance: object
}

@Injectable()
export class ProvidersExplorer implements OnApplicationBootstrap {
  private _providers: NestjsProvider[] = []

  constructor (private readonly modules: ModulesContainer) {}

  onApplicationBootstrap (): void {
    for (const moduleWrapper of this.modules.values()) {
      for (const providerWrapper of moduleWrapper.providers.values()) {
        const providerClass = providerWrapper.metatype

        if (providerClass == null) {
          continue
        }

        if (!Object.hasOwn(providerClass, 'prototype')) {
          continue
        }

        this._providers.push({
          providerClass: providerClass as Type<unknown>,
          providerInstance: providerWrapper.instance as object
        })
      }
    }
  }

  get providers (): NestjsProvider[] {
    return Array.from(this._providers)
  }
}
