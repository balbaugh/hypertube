import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Disclosure} from '@headlessui/react'
import DOMPurify from 'dompurify';
import axiosStuff from "../services/axiosStuff";
import Loader from "./Loader";
import {useTranslation} from 'react-i18next';

const CommentElement = ({id, itsMe, movies}) => {
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState('');
    const [newComment, setNewComment] = useState('');
    const [users, setUsers] = useState([])
    const navigate = useNavigate();
    const {t} = useTranslation();

    useEffect(() => {
        axiosStuff.getComments(id)
            .then((response) => {
                setComments(response);
            })
            .then(() => {
                axiosStuff.getCommentUser()
                    .then((response1) => {
                        setUsers(response1)
                        setLoading(false);
                    })
            }).catch((error) => {
            console.log('tomovie CATCH ERRROR', error);
        });

        const fetchNewComments = setInterval(() => {
            axiosStuff.getComments(id)
                .then((response) => {
                    setComments(response);
                }).then(() => {
                axiosStuff.getCommentUser()
                    .then((response1) => {
                        setUsers(response1)
                    })
            })
        }, 3000);

        // cleanup function to clear interval when component unmounts or id changes
        return () => clearInterval(fetchNewComments);

    }, [id]);

    const textInput = React.useRef(null);

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        if (itsMe.username) {
            let text1 = newComment.trim();
            if (text1.length > 255) {
                text1 = text1.slice(0, 255);
            }
            if (text1.length === 0) {
                return;
            } else if (newComment.replace(/\s/g, '').length === 0) {
                setNewComment('');
                return;
            }
            const sanitizedComment = DOMPurify.sanitize(newComment.trim());
            const comment = {
                movie_id: movies.id,
                user_id: itsMe.id,
                text1: sanitizedComment,
                text: text1.slice(0, 255),
            };
            axiosStuff
                .submitComment(comment)
                .then((response) => {
                    setComments([...comments, response.data]);
                    setNewComment('');
                })
                .catch((error) => {
                    console.log(error);
                });
            setNewComment('');
            textInput.value = '';
        }
    };

    const handleNewComment = (event) => {
        setNewComment(event.target.value)
    }

    return (
        <div>{
            loading ? (
                <div className="py-20">
                    <Loader/>
                </div>
            ) : (
                <Disclosure.Panel as="div" className="pb-6 prose-sm prose">
                    <div className="flex items-start pt-8 pb-6 space-x-4">
                        <div className="flex-1 min-w-0">
                            <form onSubmit={handleCommentSubmit} className="relative" id="myForm">
                                <div
                                    className="overflow-hidden border-2 border-red-500 rounded-lg shadow-sm focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500">
                                    <label htmlFor="comment" className="sr-only">
                                        {t('CommentElement.addComment')}
                                    </label>
                                    <textarea
                                        rows={3}
                                        name="comment"
                                        id="myForm"
                                        className="block w-full py-3 text-gray-700 bg-gray-300 border-0 resize-none focus:ring-0 sm:text-sm"
                                        placeholder={t('CommentElement.addComment')}
                                        value={newComment}
                                        onChange={handleNewComment}
                                    />

                                    {/* Spacer element to match the height of the toolbar */}
                                    <div className="py-2" aria-hidden="true">
                                        {/* Matches height of button in toolbar (1px border + 36px content height) */}
                                        <div className="py-px">
                                            <div className="h-9"/>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                                    <div className="flex-shrink-0">
                                        <button
                                            type="submit"
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-200 bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            {t('CommentElement.post')}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div
                        className="mt-2 lg:col-span-7 lg:col-start-6 lg:mt-0">
                        <h3 className="sr-only">{t('CommentElement.comments')}</h3>
                        <div className="mt-4 border-t divide-y divide-gray-200">
                            {comments.length > 0 ? (
                                comments.map((comment) => {
                                    const user = users.find(user => user.id === comment.user_id)
                                    const username = user.username
                                    const id = user.id
                                    return (
                                        <div key={comment.id}
                                             className="py-6">
                                            <div
                                                className="flex items-center">
                                                <div className="ml-4">
                                                    <a className="cursor-pointer"
                                                       onClick={() => navigate(`/profile/${id}`)}>
                                                        <h4
                                                            className="text-sm font-bold text-red-400"
                                                            dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(username)}}
                                                        >
                                                        </h4>
                                                    </a>
                                                    <p className="text-sm text-gray-400">
                                                        {comment.created_at.substring(0, 10)} {comment.created_at.substring(11, 19)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                className="mt-4 ml-8 space-y-6 text-base italic text-gray-300"
                                                dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(comment.text)}}
                                            ></div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="py-6">
                                    <div
                                        className="flex items-center">
                                        <div className="ml-4">
                                            <h4 className="text-sm font-bold text-gray-300">
                                                {t('CommentElement.noComments')}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-4 border-t divide-y divide-gray-200"/>
                </Disclosure.Panel>
            )}
        </div>
    )
}

export default CommentElement;