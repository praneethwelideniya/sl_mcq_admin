import React, { Component } from 'react';
import './App.css';
import {Form,Button,Container,Row,Col } from 'react-bootstrap';
import { questionService } from './QuestionService'
import { fonts } from './Fonts'
const crypto = require('crypto');

export default class QuestionAdding extends Component {

  state ={
    question : "",
    incorrect_answers:["","",""],
    correct_answer:"",
    subject_id:'1303',
    font:"0",
    paper_type:"Model-Paper",
    q_num:"",
    medium:"sinhala",
    other: '',
    active:true
  }
  constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.convert = this.convert.bind(this)
      this.fontChange = this.fontChange.bind(this)
  }
  componentDidMount(){
    //this.setState({incorrect_answers:['','','']})
  }

  fontChange(value){
    this.setState({font:value})
  }
  convert(text,value){

    switch (value) {
      case "2":
        return fonts.Kaputa(text)
        break;
      case "3":
        return fonts.Thibus(text)
        break;
      case "4":
        return fonts.Manel(text)
        break;
      case "5":
        return fonts.Amalee(text)
        break;
      case "1":
        return fonts.Abhaya(text)
        break;
      default:
        return text
    }

  }
  changeIncorrectAnswers(event,index){
    var a = this.convert(event.target.value,this.state.font)
    this.setState(state =>{
      state.incorrect_answers[index] = a
      const incorrect_answers = state.incorrect_answers
      return {incorrect_answers}
    })
  }
  handleSubmit(){
    let json = this.state
    delete json["font"]
    questionService.createQuestion(json).then((response)=>{
      console.log(response)
      if(response != undefined && response.status==200){
        console.log("success")
        this.setState({
          question:"",
          correct_answer:"",
          incorrect_answers:["","",""]
        })
        if(Number(this.state.subject_id)>1200){
          this.setState({
            incorrect_answers:["","","",""]
          })
        }
      }
    })
  }
  ChangeSub(value){
    this.setState({subject_id:value})
    if(this.state.incorrect_answers.length ==3 && Number(value)>1200){
      this.setState(state =>{
        state.incorrect_answers.push('')
        const incorrect_answers = state.incorrect_answers
        return {incorrect_answers}
      })
    }
    if(this.state.incorrect_answers.length ==4 && Number(value)< 1200){
      this.setState(state =>{
        state.incorrect_answers.splice(3, 1);
        const incorrect_answers = state.incorrect_answers
        return {incorrect_answers}
      })
    }
  }
  render() {
    return (
      <div className="App">
          <Form  >
          <Container>
          <Row>
          <Col>
          <Form.Group controlId="fontsSelect" >
           <Form.Label>Font</Form.Label>
           <Form.Control as="select" onChange ={(event)=>{this.fontChange(event.target.value) }} value={this.state.font} >
             <option value="0">Unidoce</option>
             <option value="4">DL-Manel-bold. --> Unicode</option>
             <option value ="2">kaputadotcom --> Unicode</option>
             <option value ="1">FM Abhaya --> Unicode</option>
             <option value = "3">Thibus Sinhala --> Unicode</option>
             <option value = "5">Amalee --> Unicode</option>
           </Form.Control>
         </Form.Group>
          </Col>
          <Col>
          <Form.Group controlId="subjectsSelect" >
           <Form.Label>Subjects</Form.Label>
           <Form.Control as="select" onChange ={(event)=>{this.ChangeSub(event.target.value)}} value={this.state.subject_id} >
             <option value="1101">OL-Sinhala</option>
             <option value ="1102">OL-Buddhist</option>
             <option value ="1103">OL-Science</option>
             <option value = "1104">OL-History</option>
             <option value = "1301">AL-Physics</option>
             <option value = "1302">AL-Chemistry</option>
             <option value = "1303">AL-Biology</option>
             <option value = "1304">AL-Agri</option>
           </Form.Control>
         </Form.Group>
          </Col>
          </Row>
          <Row>
            <Col>
            <Form.Group controlId="mediumSelect" >
             <Form.Label>Medium</Form.Label>
             <Form.Control as="select" onChange ={(event)=>{this.setState({medium:event.target.value})}} value={this.state.medium} >
               <option value="sinhala">Sinhala</option>
               <option value ="english">English</option>
             </Form.Control>
           </Form.Group>
            </Col>
          <Col>
          <Form.Group controlId="paperSelected" >
           <Form.Label>Paper Type</Form.Label>
           <Form.Control as="select" onChange ={(event)=>{this.setState({paper_type:event.target.value})}} value={this.state.paper_type} >
             <option value="Model-Paper">Model-Paper</option>
             <option value ="Past-Paper">Past-Paper</option>
             <option value ="School-Paper">School-Paper</option>
             <option value = "Other">Other</option>
           </Form.Control>
         </Form.Group>
          </Col>
          </Row>
    <Row><Col>
    <Form.Group controlId="q_num">
      <Form.Label>Q Number</Form.Label>
      <Form.Control type="Text" placeholder="Q number" value={this.state.q_num} onChange= {(event) => this.setState({q_num:event.target.value})}/>
    </Form.Group>
    </Col>
    <Col>
      <Form.Group controlId="otherValue" >
       <Form.Label>Other</Form.Label>
         <Form.Control type="Text" placeholder="Other" value={this.state.other} onChange= {(event) => this.setState({other:event.target.value})}/>
     </Form.Group>
    </Col>
    <Col>
    <Form.Group controlId="active" >
     <Form.Label>Active</Form.Label>
     <Form.Control as="select" onChange ={(event)=>{this.setState({active:event.target.value})}} value={this.state.active} >
       <option value= {true}>Yes</option>
       <option value = {false}>No</option>
     </Form.Control>
   </Form.Group>
    </Col>
    </Row>
    <Form.Group controlId="question">
      <Form.Label>Question</Form.Label>
      <Form.Control as="textarea" rows="3" value={this.state.question} onChange= {(event) => this.setState({question:this.convert(event.target.value,this.state.font)})}/>
    </Form.Group>
    <Row><Col>
    <Form.Group controlId="correct_answer">
      <Form.Label>Correct Answer</Form.Label>
      <Form.Control type="Text" placeholder="Correct Answer" value={this.state.correct_answer} onChange= {(event) => this.setState({correct_answer:this.convert(event.target.value,this.state.font)})}/>
    </Form.Group>
    </Col>
    <Col>
    <Form.Group controlId="incorrect_ans[0]">
      <Form.Label>Incorrect Answer 1</Form.Label>
      <Form.Control type="Text" placeholder="Incorrect Answer" value={this.state.incorrect_answers[0]} onChange= {(event) => {this.changeIncorrectAnswers(event,0)}} />
    </Form.Group>
    </Col>
  </Row>
  <Row><Col>
    <Form.Group controlId="incorrect_ans[1]">
      <Form.Label>Incorrect Answer 2</Form.Label>
      <Form.Control type="Text" placeholder="Incorrect Answer" value={this.state.incorrect_answers[1]} onChange= {(event) => {this.changeIncorrectAnswers(event,1)}} />
    </Form.Group>
    </Col>
    <Col>
    <Form.Group controlId="incorrect_ans[2]">
      <Form.Label>Incorrect Answer 3</Form.Label>
      <Form.Control type="Text" placeholder="Incorrect Answer" value={this.state.incorrect_answers[2]} onChange= {(event) => {this.changeIncorrectAnswers(event,2)}} />
    </Form.Group>
    </Col></Row>
    {Number(this.state.subject_id)>1200?
    (<Form.Group controlId="incorrect_ans[3]">
      <Form.Label>Incorrect Answer 4</Form.Label>
      <Form.Control type="Text" placeholder="Incorrect Answer" value={this.state.incorrect_answers[3]} onChange= {(event) => {this.changeIncorrectAnswers(event,3)}} />
    </Form.Group>):null
  }
    <Button variant="primary" onClick={this.handleSubmit}>
      Submit
    </Button>
    </Container>
  </Form>
      </div>
    )
  }
}
