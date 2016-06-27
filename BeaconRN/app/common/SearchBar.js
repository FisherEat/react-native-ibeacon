/**
 * Created by lza on 16/3/8.
 */

import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    Image,
    View,
    TouchableHighlight,
    TextInput,
} from 'react-native'
import AppConfig from '../common/AppConfig'

class SearchBar extends Component {

    constructor() {
        super()

        this.state = {
            searchText: '',
        }
    }

    render() {
        return (
            <View style={[styles.searchBar, this.props.style]}>
                <TextInput
                    placeholder="请在此输入搜索内容"
                    style={styles.searchInput}
                    onChangeText={this.props.textChanged}
                />
                <TouchableHighlight underlayColor="transparent" style={styles.cancelButton} onPress={this.props.cancelButtonClicked}>
                    <Text style={styles.cancelButtonText}>取消</Text>
                </TouchableHighlight>
            </View>
        )
    }

}


const styles = StyleSheet.create({
    searchBar: {
        width: AppConfig.ScreenWidth,
        height: AppConfig.NavBarHeight,
        flexDirection:'row',
    },
    searchInput: {
        flex:1,
        borderRadius: 4,
        padding: 5,
        marginHorizontal: 15,
        marginVertical: 7,
        backgroundColor:'rgba(220,220,220,0.5)',
    },
    cancelButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: AppConfig.NavBarHeight,
    },
    cancelButtonText: {
        color: 'black',
        fontSize: 16,
        paddingRight: 10,
    },

})

export default SearchBar

