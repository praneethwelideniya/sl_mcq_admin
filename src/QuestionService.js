import axios from 'axios'
import crypto from 'crypto'

/**
 * This is an example of a service that connects to a 3rd party API.
 *
 * Feel free to remove this example from your application.
 */
const userApiClient = axios.create({
  /**
   * Import the config from the App/Config/index.js file
   */
  baseURL: 'https://us-central1-sl-exam-mcq.cloudfunctions.net',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 3000,
})

async function createQuestion(question) {
if(question.incorrect_answers.length > 3 && question.correct_answer!==""){
   question.random_1= await crypto.randomBytes(2).readUInt32BE(0, true);
   question.random_2= await crypto.randomBytes(2).readUInt32BE(0, true);
   question.random_3= await crypto.randomBytes(2).readUInt32BE(0, true);
   let a = await question.correct_answer
   question.correct_answer = a-1;
   console.log(question)
   return userApiClient.post('/addQuestion',question)
  .then(function (response) {
    return response
  })
  .catch(function (error) {
    return {status:404}
    console.log(error);
  });
  }
  else{
    return {status:404}
  }
}

function getSubjects(){

return userApiClient.get('/getSubjects')
  .then(response =>{
      return {suc:response.data.success,res:response.data.res}
  }).catch(error =>{
    console.log(error)
      return {suc:false,res:error}
  })
}



export const questionService = {
  createQuestion,
  getSubjects
}
