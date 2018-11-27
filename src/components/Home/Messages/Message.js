import React from 'react';
import { Comment } from 'semantic-ui-react';

const Message = ({msg}) => {
    return(
        <Comment>
            <Comment.Avatar src= {} />
            <Comment.Content>
                <Comment.Author as='a'>{}</Comment.Author>
                <Comment.Metadata>{}</Comment.Metadata>
                <Comment.Text>{}</Comment.Text>
            </Comment.Content>
        </Comment>
    )
}

export default Message;