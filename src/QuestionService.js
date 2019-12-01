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

function createQuestion(question) {
  question.random_1=crypto.randomBytes(2).readUInt32BE(0, true);
  question.random_2=crypto.randomBytes(2).readUInt32BE(0, true);
  question.random_3=crypto.randomBytes(2).readUInt32BE(0, true);
  return userApiClient.post('/addQuestion',question)
  .then(function (response) {
    return response
  })
  .catch(function (error) {
    console.log(error);
  });
}



export const questionService = {
  createQuestion,
}
