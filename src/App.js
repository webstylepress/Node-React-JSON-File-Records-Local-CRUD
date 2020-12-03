import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Data from "./data.json";
import { v1 as uuidv1 } from 'uuid';
import axios from 'axios';

function App() {

  // Reference
  const titleRef = useRef();
  const contentRef = useRef();

  // State 
  const [data, setData] = useState(Data);

  // Temp State
  const [title, setTitle] = useState();
  const [content, setContent] = useState();

  const [updateID, setUpdateID] = useState();
  const [updateTitle, setUpdateTitle] = useState();
  const [updateContent, setUpdateContent] = useState();

  // Effect
  //////////////////////////////////////////
  useEffect(() => {
    // console.log(data);
    // setDate(Data)
    // clear form fields
    titleRef.current.value = null;
    contentRef.current.value = null;
  },[data]);
  


  // Add Post
  //////////////////////////////////////////
  const addPost = () => {
    if(title && content) {
      // create new post object
      let newPost = {
        "id": uuidv1(),
        "title": title,
        "content": content
      }
      // merge new post with copy of old state
      let posts = [...data, newPost];
      // push new object to state
      setData(posts);
      // clear title and content from state
      setTitle();
      setContent();

      // update write to json file
      saveJson(posts);

   }
  }
  


  // Delete Post 
  //////////////////////////////////////////
  const deletePost = (key) => {
    // filter out post containing that id
    let filterOutPost = [...data].filter(OBJ=>OBJ.id!==key);
    // save the rest in state
    setData(filterOutPost);

    // update write to json file
    saveJson(filterOutPost);

  }

  // Populate Post
  ////////////////////////////////////////// 
  const populatePost = (key, title, content) => {
    setUpdateID(key);
    setUpdateTitle(title);
    setUpdateContent(content);
  }

  // Update Post 
  //////////////////////////////////////////
  const updatePost = () => {
    // populate post info from temp state and prepare new object for changed post
    let editedPost = {
      "id": updateID,
      "title": updateTitle,
      "content": updateContent
    }
    // remove old post with same ID and get the remaining data /// filter 
    let filterPost = [...data].filter(OBJ=>OBJ.id!==updateID);
    // prepare object with edited post + remaining data from object above
    let posts = [...filterPost, editedPost];
    // push int state
    setData(posts);

    setUpdateID();
    setUpdateTitle();
    setUpdateContent();

    // update write to json file
    saveJson(posts);

  }

  // Write to JSON File
  //////////////////////////////////////////
  // this function will receive all uodated state / posts after you add, edit delete post
  const saveJson = (posts) => {
    // api URL // end point from node server / express server
    const url = 'http://localhost:5000/write'
    axios.post(url, posts)
    .then(response => {
      // console.log(response);
    });
  }

  // Bonus Section
  //////////////////////////////////////////
  // Downloading JSON File
  const saveData = jsonDate => {
    const fileData = JSON.stringify(jsonDate);

    const blob = new Blob([fileData], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    // create link
    const link = document.createElement('a');
    // point link to file to be downloaded
    link.download = 'newData.json';
    link.href = url;
    // trigger download
    link.click();
  }



  return (
    <div className="App">

      <div>
        <h4>Add New Post</h4>
        <input placeholder="Title" 
          onChange={ e => setTitle( e.target.value ) } 
          value={ title || '' } 
          ref={ titleRef }
        />
        <br />
        <textarea 
          placeholder="Content"
          onChange={ e => setContent( e.target.value ) } 
          value={ content || '' } 
          ref={ contentRef }
        ></textarea>
        <br />
        <button onClick={ addPost }>Add Post</button>
      </div>

      {/* If temp state has got values of title and content for update form show this */}

      { updateTitle || updateContent ? 
        (
          <div>
            <h4>Update Post</h4>
            <input placeholder="Title" 
              onChange={ e => setUpdateTitle( e.target.value ) } 
              value={ updateTitle || '' } 
            />
            <br />
            <textarea
              placeholder="Content"
              onChange={ e => setUpdateContent( e.target.value ) } 
              value={ updateContent || '' } 
            ></textarea>
            <br />
            <button onClick={ updatePost }>Update Post</button>
          </div>
        ) : null }

      <div className="posts">
        { data ? data.map(post => {
          return(
            <div key={ post.id } className="post">
              <h3>{ post.title }</h3>
              <p>{ post.content }</p>
              <button onClick={ () => populatePost(post.id, post.title, post.content) }>Edit</button>
              <button onClick={ () => deletePost(post.id) }>Delete</button>
            </div>
          )
        }) : null }
        <div className="btn-download">
          <button onClick={ e => saveData(data) }>Download Data</button>
        </div>
      </div>
    </div>
  );
}

export default App;
