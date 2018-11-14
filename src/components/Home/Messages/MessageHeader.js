import React from 'react';
import { Segment, Header, Icon, Input } from 'semantic-ui-react';

export default function MessageHeader(){
    return(
        <Segment clearing>
            <Header as='h2' floated='left' fluid="true" style={{marginBottom: 0}}>
                <span>
                    Channel <Icon name={'star outline'} color="black" />
                </span>    
                <Header.Subheader>2 Users</Header.Subheader>
            </Header>
            <Header floated='right'>
                <Input size='mini' icon='search' name="searchTerm" placeholder='Search...' />
            </Header>
        </Segment>
    );
}