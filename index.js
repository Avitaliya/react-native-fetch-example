import { AppRegistry } from 'react-native';
import {createStackNavigator} from 'react-navigation';
// Class Objects
import App from './App';
import feeds_list from './src/feeds_list';
import new_feed from './src/new_feed';

console.disableYellowBox = true;
AppRegistry.registerComponent('WebApi', () => RootStack);
const RootStack = createStackNavigator(
  {
      new_feed: {
      screen: new_feed,
    },
    feeds_list: {
        screen: feeds_list,
    },
  },
  {
    initialRouteName: 'feeds_list',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#2EBF89',
      },
      headerTintColor: '#ffffff',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: '#ffffff'
      },
    },
  }
);
