import {Configuration} from 'webpack'
import {ResovleConfig} from 'src/config'
import store from 'src/helper/store'
import {externalAssetsType} from 'src/types'

export type ExternalsItemType = {
  /**
   * 模块名
   * @example react-dom
   */
  module?: string
  /**
   * 全局变量
   * @example ReactDom
   */
  global?: string
  /**
   * 入口地址
   * @example http://
   */
  entry: string
  /**
   * 类型入口
   * @default js
   * @enum js | css
   * @example css
   */
  type?: string
}
export type ExternalsType = (
  config: ResovleConfig,
) => ExternalsItemType[] | Promise<ExternalsItemType[]> | ExternalsItemType[]
class WpExternalsOptions {
  constructor() {}
  async setup(externals: any, externalAssets: externalAssetsType): Promise<void> {
    if (store.config.externals) {
      let list = []
      if (typeof store.config.externals === 'function') {
        list = await store.config.externals(store.config)
      } else {
        list = store.config.externals
      }
      list.map(v => {
        v.type = v.type || 'js'
        if (v.type === 'js' && v.module) {
          externals[v.module] = v.global
          externalAssets.js.push(v.entry)
        } else if (v.type === 'css') {
          externalAssets.css.push(v.entry)
        }
      })
    }
  }
}

export default new WpExternalsOptions()
