
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"

type Post = {
  id: string
  post: string
}
type NewPost = {
  post: string
}

type EditPost = {
  post_id: string
  post: string
}
export default function UeryTest(){
  const [input, setInput] = useState<string>('')
  const [edit, setEdit] = useState<string>('')
  const queryClient = useQueryClient()
  const {data, isPending, error} = useQuery({
    queryKey: ['post'],
    queryFn: async()=>{
      const res = await axios.get<Post[]>('http://127.0.0.1:8000/')
      return res.data
    }
  })

  const mutation = useMutation({
    mutationFn: async(newPost: NewPost)=> {
      const res = await axios.post('http://127.0.0.1:8000/create', newPost)
      return res.data
    },
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey: ['post']})
    }
  })

  const deletePost =  useMutation({
    mutationFn: async(id: string) =>{
      const res = await axios.delete(`http://127.0.0.1:8000/delete/${id}`)
      return res.data
    },
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey: ['post']})
    }
  })

  const editPost = useMutation({
    mutationFn: async(editPost: EditPost) =>{
      const res = await axios.put(`http://127.0.0.1:8000/update/${editPost.post_id}`, editPost)
      return res.data
    },
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey: ['post']})
    }
  })

  if(error) return
  if(isPending) return <div>Loading...</div>

  return(
    <div>
      app
      Enter post: <input value={input} onChange={(e)=>setInput(e.target.value)} type="text" />
      <button onClick={()=> mutation.mutate({post: input})}>Ok</button>

      {
        data.map((post, index)=>(
          <div key={index}>
            {post.post}
            <button onClick={()=>deletePost.mutate(post.id)}>Delete</button>
            <input value={edit} onChange={(e)=>setEdit(e.target.value)} type="text" />
            <button onClick={()=>editPost.mutate({post_id: post.id, post: edit})}>Edit</button>
          </div>
        ))
      }
    </div>
  )
}