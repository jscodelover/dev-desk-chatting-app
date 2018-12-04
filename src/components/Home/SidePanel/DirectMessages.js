import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import firebase from '../../../firebaseConfig';

class DirectMessage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            userRef: firebase.database().ref('users'),
            connectionRef: firebase.database().ref('.info/connected'),
            persence: firebase.database().ref('presence'),
            totalUser: []
        }
    }

    componentDidMount(){
        let loadedUsers = [];
        this.state.userRef.on("child_added", snap => {
            if(this.props.user.userID !== snap.val().userID)
            {
                loadedUsers.push(snap.val())
                this.setState({totalUser: loadedUsers});
            }     
        })
    }

    render(){
        const { totalUser } = this.state;
        return(
            <Menu.Menu style={{marginTop: '2rem'}}>
                <Menu.Item>
                    <span><Icon name="envelope" /></span>{` `} Direct Messages {` `} {totalUser.length}
                </Menu.Item>
            </Menu.Menu>
        );
    }
}

export default DirectMessage;