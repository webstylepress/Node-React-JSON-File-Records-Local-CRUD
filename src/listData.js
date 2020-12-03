import React from 'react';
import './App.css';
import Data from "./data.json";

function ListData({ populatePost, deletePost }) {
  return (
    <div className="posts">
      { Data ? Data.map(post => {
        return(
          <div key={ post.id } className="post">
            <h3>{ post.title }</h3>
            <p>{ post.content }</p>
            <button onClick={ () => populatePost(post.id, post.title, post.content) }>Edit</button>
            <button onClick={ () => deletePost(post.id) }>Delete</button>
          </div>
        )
      }) : null }
    </div>
  );
}

export default ListData;
