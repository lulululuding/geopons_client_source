import React,{ memo } from 'react';
import CreateComment from './createComment';
import Comments from './comments';

export default memo(function() {
    return (
        <div>
            <Comments />
            <CreateComment />
        </div>
    )
})