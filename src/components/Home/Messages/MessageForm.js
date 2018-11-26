import * as React from 'react';
import { Input, Button, Icon, Segment } from 'semantic-ui-react';
import './Messages.css';

class MessageForm extends React.Component{
    render(){
        return(
            <Segment className="messageForm">
            <Input 
                icon="add"
                labelPosition='left'
                placeholder="Add message...."
            />    
                <Button.Group>
                    <Button labelPosition="left" color="teal" icon="reply" content="Add Reply" />       
                    <Button labelPosition="left" color="orange" icon="upload" content="Add File" />
                </Button.Group> 
            </Segment>
        );
    }
}

export default MessageForm;