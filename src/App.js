import './App.css';
import {useState} from 'react';

function Header(props) {
  return <header>
    <h1><a href="/" onClick={(event) => {
      event.preventDefault();
      props.onChangeMode();
    }}>{props.title}</a></h1>
  </header>
}

function Nav(props) {
  const lis = props.topics.map(prop => 
    <li key={prop.id}>
    <a id={prop.id} href={'/read/'+prop.id} onClick={event => {
      event.preventDefault();
      props.onChangeMode(Number(event.target.id));
    }}>{prop.title}</a>
    </li>)
  return <nav>
    <ol>
      {lis}
  </ol>
  </nav>
}

function Article(props) {
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}

function Create(props) {
  return <article>
    <h2>Create</h2>
    <form onSubmit={event => {
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder='title'/></p>
      <p><textarea name="body" placeholder='body'></textarea></p>
      <p><input type="submit" value="Create"/></p>
    </form>
  </article>
}

function Update(props) {
  const [title, setTitle] = useState(props.topic.title);
  const [body, setBody] = useState(props.topic.body);
  return <article>
    <h2>Update</h2>
    <form onSubmit={event => {
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title" value={title} onChange={event => setTitle(event.target.value)}/></p>
      <p><textarea name="body" placeholder="body" value={body} onChange={event => setBody(event.target.value)}></textarea></p>
      <p><input type="submit" value="Update"/></p>
    </form>
  </article>
}

function App() {
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextid, setNextid] = useState(4);
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'javascript', body:'javascript is ...'}
  ])

  let content = null;
  let contextControll = null;
  if(mode=== 'WELCOME') {
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  } else if (mode === 'READ') {
    let title, body = null;
    topics.forEach(topic => {
      if(topic.id === id) {
        title = topic.title;
        body = topic.body;
      }
    })
    content = <Article title={title} body={body}></Article>
    contextControll = <>
    <li><a href={"/update/"+id} onClick={event => {
      event.preventDefault();
      setMode('UPDATE');
    }}>Update</a></li>
    <li><input type="button" value="Delete" onClick={() => {
      const newTopics = topics.filter(topic => topic.id !== id);
      setTopics(newTopics);
      setMode('WELCOME');
    }}/></li>
    </>
  } else if (mode === "CREATE") {
    content = <Create onCreate={(_title, _body) => {
      const newTopics = [...topics, {id:nextid, title:_title, body:_body}];
      setTopics(newTopics);
      setMode('READ');
      setId(nextid);
      setNextid(nextid+1);
    }}></Create>
  } else if (mode === 'UPDATE') {
    let _topic = null;
    topics.forEach(topic => {
      if (topic.id === id) 
        _topic = topic;
    })
    content = <Update topic={_topic} onUpdate={(_title, _body)=>{
      const updatedTopic = {id:_topic.id, title:_title, body:_body};
      const newTopics = [...topics];
      for(let i=0; i<newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }

  return (
    <div>
      <Header title="WEB" onChangeMode={() => setMode('WELCOME')}></Header>
      <Nav topics={topics} onChangeMode={(_id) => {
        setMode('READ');
        setId(_id);  
      }}></Nav>
      {content}
      <ul>
        <li>
          <a href='/create' onClick={event => {
            event.preventDefault();
            setMode('CREATE');
          }}>Create</a>
        </li>
        {contextControll}
      </ul>
    </div>
  );
}

export default App;