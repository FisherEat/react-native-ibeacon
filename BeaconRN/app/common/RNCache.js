/**
 * Created by admin on 16/1/18.
 */

import RCTStorage from 'react-native-storage'

//最大容量，默认值1000条数据循环存储
//数据过期时间，默认一整天（1000 * 3600 * 24秒）,过期后不会删除数据，而只会调用sync方法来同步数据
//读写时在内存中缓存数据。默认启用。
//如果storage中没有相应数据，或数据已过期，
//则会调用相应的sync同步方法，无缝返回最新数据。
//注意:请不要在key中使用_下划线符号!

class RNCache {

    constructor(expire=(1000 * 3600 * 24), maxSize=10000, enableCache=true,) {
        const initialParams = {
            size: maxSize,
            defaultExpires: expire,
            enableCache: enableCache,
            sync : {
                //同步方法的具体说明会在后文提到
            }
        }
        this.state = {
            storage : new RCTStorage(initialParams)
        }
    }

    async save(key, data) {
        if (data == undefined || data == null || data == '') {
            return false
        }
        const storageData = {
            key: key,
            rawData: data,
        }
        const result = await this.state.storage.save(storageData)
        return result
    }

    async find(key) {
        const where = {
            key: key,
        }
        const result = await this.state.storage.load(where).catch(err=>err)
        return result
    }

    async remove(key) {
        const where = {
            key: key,
        }
        const result = await this.state.storage.remove(where)
        return result
    }
}

export default RNCache
