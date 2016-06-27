import React from 'react-native'
import AppConfig from './AppConfig'
import Spinner from 'react-native-loading-spinner-overlay';

const {
  View,
  Component,
} = React

class ProgressHUD extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: true
        }
    }

    render() {
        return (
            <Spinner visible={this.props.animating} />
        )
    }
}

export default ProgressHUD
