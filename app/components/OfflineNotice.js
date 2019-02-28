import React, { PureComponent } from 'react';
import { View, Text, Dimensions, StyleSheet,NetInfo } from 'react-native';
const { width } = Dimensions.get('window');
// import NetInfo from "@react-native-community/netinfo";



class OfflineNotice extends PureComponent {
  state = {
    isConnected :true,
    isVisible : false
  }

  componentDidMount(){
      NetInfo.getConnectionInfo().then(connectionInfo => {
        console.log(connectionInfo.type)
        if(connectionInfo.type == "unknown" || connectionInfo.type == "none" ){
          this.setState({isConnected:false})
        } else {
          this.setState({isConnected:true})
        }
      });
      NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
      NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = networkStatus => {
      if (networkStatus) {
        this.setState({ isConnected : true ,isVisible:true },()=>{
          setTimeout(()=>{
            this.setState({isVisible:false})
          },2000)
        });
      } else {
        this.setState({ isConnected : false});
        
      }
  };

  renderOffline(){
    return (
      <View style={styles.offlineContainer}>
        <Text style={styles.offlineText}>No Internet Connection</Text>
      </View>
    );
  }

  renderOnline(){
    return (
      this.state.isVisible &&
      <View style={styles.onlineContainer}>
        <Text style={styles.onlineText}>Connected</Text>
      </View>
    );
  }


  render() {
    if (!this.state.isConnected) {
      return this.renderOffline();
    }
    
    return this.renderOnline();
  }
}
const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    // position: 'absolute',
    top: 0
  },
  offlineText: { 
    color: '#fff'
  },

  onlineContainer: {
    backgroundColor: "#4AA22E",
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    // position: 'absolute',
    top: 0
  },
  onlineText: { 
    color: '#fff'
  }
});
export default OfflineNotice;