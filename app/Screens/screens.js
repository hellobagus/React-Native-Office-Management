import {Navigation} from 'react-native-navigation'

//Tab Screen
import Home from './Home/index'
import Heroes from './Heroes'
import Settings from './Settings'

//Heroes
import HeroesAdd from './Heroes/add'
import HeroesView from './Heroes/detail'

//Login
import Login from './Login'
import Reset from './Reset'

//Help Desk
import HelpDesk from './HelpDesk'
import SpecHelpDesk from './HelpDesk/SpecHelpDesk'
import SelectCategory from './HelpDesk/SelectCategory'
import CategoryHelp from './HelpDesk/CategoryHelp'
import SubmitHelpDesk from './HelpDesk/Submit'
import HistoryHelp from './HelpDesk/HistoryHelp'
import ViewHistory from './HelpDesk/ViewHistory'
import ViewHistoryStatus from './HelpDesk/ViewHistoryStatus'
import ViewHistoryDetail from './HelpDesk/ViewHistoryDetail'
import StatusHelp from './HelpDesk/StatusHelp'
import Chat from './HelpDesk/Chat'
import LiveChat from './HelpDesk/LiveChat' //Ga kepake




//Billing
import Billing from './Billing'

//Metrix
import Metrix from './Metrix'

//Overtime 
import Overtime from './Overtime'
import AddOvertime from './Overtime/AddOvertime'

//History
import Status from './Status'

//Inbox
import Inbox from './Inbox'

//Invoice
import Emergency from './Emergency'

//Profile
import Profile from './Profile'
import EditProfile from './Profile/edit'

//News
import NewsDetail from './News/NewsDetail'

//Jika Screen Kosong
import ZonkScreen from './ZonkScreen'

//Initializing
import Initializing from './Initializing';




//Registering Component Screen
export function registerScreen(){
    Navigation.registerComponent('Initializing',()=> Initializing);


    Navigation.registerComponent('tab.Home',()=> Home);
    Navigation.registerComponent('tab.Heroes',()=> Heroes);
    Navigation.registerComponent('tab.Settings',()=> Settings);

    Navigation.registerComponent('screen.HeroesAdd',()=> HeroesAdd);
    Navigation.registerComponent('screen.HeroesView',()=> HeroesView);

    //Login
    Navigation.registerComponent('screen.Login',()=> Login);
    Navigation.registerComponent('screen.Reset',()=> Reset);

    //HelpDesk
    Navigation.registerComponent('screen.HelpDesk',()=> HelpDesk);
    Navigation.registerComponent('screen.SpecHelpDesk',()=> SpecHelpDesk);
    Navigation.registerComponent('screen.CategoryHelp',()=> CategoryHelp);
    Navigation.registerComponent('screen.SelectCategory',()=> SelectCategory);
    Navigation.registerComponent('screen.SubmitHelpDesk',()=> SubmitHelpDesk);
    Navigation.registerComponent('screen.HistoryHelp',()=> HistoryHelp);
    Navigation.registerComponent('screen.ViewHistory',()=> ViewHistory);
    Navigation.registerComponent('screen.ViewHistoryStatus',()=> ViewHistoryStatus);
    Navigation.registerComponent('screen.ViewHistoryDetail',()=> ViewHistoryDetail);
    Navigation.registerComponent('screen.StatusHelp',()=> StatusHelp);
    Navigation.registerComponent('screen.Chat',()=> Chat);
    Navigation.registerComponent('screen.LiveChat',()=> LiveChat); //BElomKEpake

    //Billing
    Navigation.registerComponent('screen.Billing',()=> Billing);

    //Metrix
    Navigation.registerComponent('screen.Metrix',()=> Metrix);

    //Overtime
    Navigation.registerComponent('screen.Overtime',()=> Overtime);
    Navigation.registerComponent('screen.AddOvertime',()=> AddOvertime);

    //History
    Navigation.registerComponent('tab.Status',()=> Status);

    //Invoice
    Navigation.registerComponent('tab.Emergency',()=> Emergency);

    //Inbox
    Navigation.registerComponent('tab.Inbox',()=> Inbox);

    //Profile
    Navigation.registerComponent('tab.Profile',()=> Profile);
    Navigation.registerComponent('screen.EditProfile',()=> EditProfile);

    //Status 
    Navigation.registerComponent('screen.Status',()=> Status);

    //News and Promo Detail
    Navigation.registerComponent('screen.NewsDetail',()=> NewsDetail);

    //Jika Screen kosong
    Navigation.registerComponent('screen.ZonkScreen',()=> ZonkScreen);


}