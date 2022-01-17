import supabase from "../lib/supabase";
import { useState, useEffect } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [session, setSession] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, []);


  const handleLogin = async () => {
    await supabase.auth.signIn({ email, password: "random" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };


  async function fetchPosts() {
    let { data: posts, error} = await supabase
    .from("posts")
    .select("*");

    if (error) {
      throw error;
    }

    setPosts(posts);
  }


  function handleContent(e) {
    setContent(e.target.value);
  }

  function handleEmail(e) {
    setEmail(e.target.value);
  }

  async function handleSubmit() {
    //post content to supabase
    await supabase.from("posts").insert({ content, user_id: session.user.id });


    setContent("");
    fetchPosts();
  }

  return (
    <div style={{margin: "2rem"}}>
      <div>
        {session ? (
          <>
          <p>Hello, {session.user.email}</p>
          <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
          <input type="email" value={email} onChange={handleEmail} />
          <button onClick={handleLogin}>Login</button>
          </>
        )}
      </div>
      <h1>Posts by users</h1>
      
      {session &&
      <div>
        <input type="text" value={content} onChange={handleContent} />
        <button onClick={handleSubmit}>Add Post</button>
      </div>
      }
      
      <div>
      {posts.map((post) => (
        <div key={post.id}>{post.content}</div>
      ))}
      </div>
    </div>
  );
}
