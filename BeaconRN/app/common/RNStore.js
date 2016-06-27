import RCTStore from 'react-native-store'

class RNStore {

    constructor(tableName) {
        this.state = {
            table: RCTStore.model(tableName)
        }
    }

    // 找到符合条件的数据，返回其中的第一个
    async findOne(condition) {
        const filter = {
            where: condition,
            order: {
                _id: 'DSC'
            }
        }
        const result = await this.state.table.find(filter)
        if (result.length > 0) {
            return result[0]
        }
        return result
    }

    // 找到符合条件的所有数据
    async find(condition) {
        const filter = {
            where: condition,
            order: {
                _id: 'DSC'
            }
        }
        const result = await this.state.table.find(filter)
        return result
    }

    // 返回整个表下的所有数据
    async findAll() {
        const filter = {
            order: {
                _id: 'DSC'
            }
        }
        const result = await this.state.table.find(filter)
        return result
    }

    // 保存数据到某个表下,并返回当前保存的数据
    async save(jsonData) {
        if (jsonData) {
            const result = await this.state.table.add(jsonData)
            return result
        }
        return null
    }

    // condition为json键值对
    async update(condition, jsonData) {
        const filter = {
            where: condition,
            order: {
                _id: 'DSC'
            }
        }
        const result = await this.state.table.update(jsonData, filter)
        return result
    }

    // 移除相应符合条件的数据
    async remove(condition) {
        const filter = {
            where: condition,
        }
        const result = await this.state.table.remove(filter)
        return result
    }

    // 移除相应符合条件的数据
    async removeAll() {
        const filter = {
            where: {},
        }
        const result = await this.state.table.remove(filter)
        return result
    }

}

export default RNStore
