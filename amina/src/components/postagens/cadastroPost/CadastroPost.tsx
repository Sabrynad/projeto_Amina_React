import React, { useEffect, useState, ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useLocalStorage from 'react-use-localstorage'

import { buscaId, httpPost, busca, httpPut } from '../../../services/Service'
import './CadastroPost.css'
import Grupo from '../../../models/Grupo'

export interface PostDTO {
  titulo: string
  topico: string
  descricao: string
  foto: string
  usuario: {
    id: number
  }
  grupo: {
    id: number
  }
}

function CadastroPost() {
  let navigate = useNavigate()
  const [token] = useLocalStorage('token')
  const [idUser] = useLocalStorage('id')

  const { id } = useParams<{ id: string }>();
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [grupo, setGrupo] = useState<Grupo>({
    id: 0,
    titulo: '',
    descricao: '',
    topico: '',
    midia: ''
  })

  const [post, setPost] = useState<PostDTO>({
    titulo: '',
    topico: '',
    descricao: '',
    foto: '',
    usuario: {
      id: parseInt(idUser)
    },
    grupo: {
      id: grupo.id
    }
  })

  useEffect(() => {
    if (token == '') {
      alert('Você precisa estar logado!')
      navigate('/login')
    }
    getGrupos()
    setPost({
      ...post,
      grupo: grupo
    })
  }, [token, grupo])

  useEffect(() => {
    if (id !== undefined) {
      findById(id)
    }
  }, [id])

  async function findById(id: string) {
    buscaId(`/api/Postagens/idPostagem/${id}`, setPost, {
      headers: {
        'Authorization': token
      }
    })
  }

  function updatePost(e: ChangeEvent<HTMLInputElement>) {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
      grupo: grupo
    })
  }

  async function getGrupos() {
    await busca('/api/Grupos/todosGrupos', setGrupos, {
      headers: {
        "Authorization": token
      }
    })
  }

  async function onSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault()

    if(id !== undefined){
      httpPut(`/api/Postagens/atualizarPostagem`, post, setPost, {
        headers:{
          "Authorization": token
        }
      })
      alert('Postagem atualizada com sucesso!')
    }else{
      httpPost(`/api/Postagens/cadastrarPostagem`, post, setPost, {
        headers: {
          Authorization: token
        }
      })
      alert('Postagem cadastrada com sucesso!')
    }

    {/*httpPost(`/api/Postagens/cadastrarPostagem`, post, setPost, {
      headers: {
        Authorization: token
      }
    })*/}

    back()
  }

  function back() {
    navigate('/feed')
  }

  return (
    <>
      <form onSubmit={onSubmit} id="cadastroPost">
        <input
          type="text"
          name="titulo"
          id="titulo"
          placeholder="Titulo"
          onChange={(e: ChangeEvent<HTMLInputElement>) => updatePost(e)}
        />

        <input
          type="text"
          name="descricao"
          id="descricao"
          placeholder="Descrição"
          onChange={(e: ChangeEvent<HTMLInputElement>) => updatePost(e)}
        />

        <input
          type="text"
          name="foto"
          id="foto"
          placeholder="URL Imagem"
          onChange={(e: ChangeEvent<HTMLInputElement>) => updatePost(e)}
        />

        <select
          name="grupo"
          id="grupo"
          onChange={e =>
            buscaId(`/api/Grupos/idGrupo/${e.target.value}`, setGrupo, {
              headers: {
                Authorization: token
              }
            })
          }
        >
          <option>Selecione Grupo</option>
          {grupos.length > 0 &&
            grupos.map(item => <option value={item.id}>{item.titulo}</option>)}
        </select>

        <button type="submit">Postar</button>
      </form>
    </>
  )
}

export default CadastroPost
