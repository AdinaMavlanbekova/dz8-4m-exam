import React, {useState, useEffect} from 'react';
import {useForm} from "react-hook-form";


const URL = 'http://localhost:8000/users'

function UsersPage() {

    const { register,
        handleSubmit,
        reset } = useForm();

    const [infos, setInfos] = useState([])
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);


    async function getInfo () {
        const response = await fetch(URL)
        const data = await response.json()
        setInfos(data)
    }

    async function createInfo (data) {

        const response = await fetch(URL,{
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (response.status === 201){
            getInfo();
            showModalWithMessage('Пользователь успешно создан');
        }
    }

    const submit = (data) => {
        createInfo(data);
        reset();
    };

    async function deleteInfo (id) {
        const response = await fetch(`${URL}/${id}`,{
            method: 'DELETE',
        })
        if(response.status === 200){
            getInfo()
            showModalWithMessage('Пользователь удален');
        }
    }

    const showModalWithMessage = (message) => {
        setModalMessage(message)
        setShowModal(true)
        setTimeout(() => {
            setShowModal(false)
            setModalMessage('')
        }, 3000)
    };


    useEffect(() => {
        getInfo()
    },[])

    return (
        <div>
            <form onSubmit={handleSubmit(submit)}>
                <input type="text" placeholder="name"  {...register('name', { required: true })}/>
                <input type="text" placeholder="email"  {...register('email', { required: true })}/>
                <input type="text" placeholder="username"  {...register('username', { required: true })}/>

                <button>create</button>
            </form>

            {
                infos.length > 0 ? (
                    <table>
                        <thead>
                        <tr>
                            <th>name</th>
                            <th>email</th>
                            <th>username</th>
                            <th>actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        <tr>
                            {
                                infos.map((info) => (
                                    <tr key={info.id}>
                                        <td>{info.name}</td>
                                        <td>{info.email}</td>
                                        <td>{info.username}</td>
                                        <td>
                                            <button onClick={() => deleteInfo(info.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tr>
                        </tbody>
                    </table>

                ) : (
                    <p>список пуст</p>
                )
            }
            {showModal && (
                    <p>{modalMessage}</p>
            )}
        </div>
    );
}

export default UsersPage;

