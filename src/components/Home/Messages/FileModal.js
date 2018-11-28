import React from 'react';
import { Button, Input, Icon, Modal, Header } from "semantic-ui-react";

class FileModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            file: null
        }
    }
    addFile = (event) => {
        this.setState({file: event.target.files[0]})
    }

    sendFile = () => {
        const { file } = this.state;
        if(file){
            this.props.uploadFile(file);
            this.props.closeModal();
            this.setState({file: null})
        }
    }
    render(){
        const { modal, closeModal } = this.props;
        return(
            <Modal basic open={modal}>
              <Header>Select a Image File</Header>
              <Modal.Content>
                  <Input 
                    fluid
                    label="File type: jpg/png"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={this.addFile}
                  />   
              </Modal.Content>
              <Modal.Actions>
                <Button color="red" inverted onClick={closeModal}>
                  <Icon name="remove" />Cancel
                </Button>
                <Button color="green" inverted onClick={this.sendFile}>
                  <Icon name="checkmark" />Send
                </Button>
              </Modal.Actions>
            </Modal>
        );
    }
    
}

export default FileModal;