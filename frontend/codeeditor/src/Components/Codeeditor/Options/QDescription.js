import React from 'react'
import { useParams } from 'react-router-dom';
import { Questions } from '../../../Question';

function QDescription() {
  const{id} = useParams();
  const question = Questions.filter((question) => question.id === parseInt(id))[0];
  return (
    <div>
      {
        question ?
          <div>
            <h1 className='text-2xl py-2 font-semibold'>{question.question + '. '}{question.header}</h1>
            <p>{question.description}</p>
          </div>
        :
        console.log("dkjfsdkjksj", question)
      }
    </div>
  )
}

export default QDescription