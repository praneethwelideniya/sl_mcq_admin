import React, { Component } from 'react';
import './App.css';
import {Form,Button,Container,Row,Col } from 'react-bootstrap';
import { questionService } from './QuestionService'
export default class QuestionAdding extends Component {

  state ={
    question : "",
    incorrect_answers:["","","",""],
    correct_answer:null,
    subject_id:"",
    paper_type:"m-p",
    q_num:"",
    medium:"sinhala",
    other: "",
    active:true,
    subjects:[],
    images_exists:false,
    img_url:null
  }
  constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.getOptions = this.getOptions.bind(this);
  }
  async componentDidMount(){
    await questionService.getSubjects().then(async (response)=>{
      var sub = [];
      await response.res.forEach(data =>{
        sub.push({id:data.id,name:data.name})
      })
      await this.setState({subjects:sub})
    }).catch(error=>{

    })
  }

  componentDidUpdate(){
    if(!this.state.images_exists && this.state.img_url!==null){
      this.setState({img_url:null})
    }
    console.log(this.state.incorrect_answers)
  }

  changeIncorrectAnswers(event,index){
    var a = event.target.value
    this.setState( state =>{
      state.incorrect_answers[index] = a
      const incorrect_answers = state.incorrect_answers
      return {incorrect_answers}
    })
  }
   setRequest= async () => {
     return {
       question : this.state.question,
       incorrect_answers:this.state.incorrect_answers,
       correct_answer:this.state.correct_answer,
       subject_id:this.state.subject_id,
       paper_type:this.state.paper_type,
       q_num:this.state.q_num,
       medium:this.state.medium,
       other: this.state.other,
       active:this.state.active,
       images_exists:this.state.images_exists,
       img_url:this.state.img_url
     }
   }

   handleSubmit = async () => {
    let json = await this.setRequest()
    await console.log(json)
    if(await json.incorrect_answers.length > 3 ){
      console.log(json.incorrect_answers.length)
    await questionService.createQuestion(json).then(async (response)=>{
      console.log(response)
      if(response !== undefined && response.status===200){
        console.log("success")
        await this.setState({
          question:"",
          correct_answer:"",
          incorrect_answers:["","","",""]
        })
        if(Number(this.state.subject_id)>1200){
          await this.setState({
            incorrect_answers:["","","","",""]
          })
        }
      }
      else if(response !== undefined && response.status===404){
        await this.setState({
          subject_id:this.state.subject_id,
          correct_answer:this.state.correct_answer,
          incorrect_answers:this.state.incorrect_answers
        })
      }
    })
    }
    else{
      await this.setState({
        correct_answer:this.state.correct_answer,
        incorrect_answers:this.state.incorrect_answers
      })
    }
  }

  ChangeSub(value){
    this.setState({subject_id:value})
    if(this.state.incorrect_answers.length ===3 && Number(value)>1200){
      this.setState(state =>{
        state.incorrect_answers.push('')
        const incorrect_answers = state.incorrect_answers
        return {incorrect_answers}
      })
    }
    if(this.state.incorrect_answers.length ===4 && Number(value)< 1200){
      this.setState(state =>{
        state.incorrect_answers.splice(3, 1);
        const incorrect_answers = state.incorrect_answers
        return {incorrect_answers}
      })
    }
  }

getOptions(){
  let items = [];
  if(this.state.subjects!==undefined){
  this.state.subjects.forEach(sub=>{
    items.push(<option key={sub.id} value={sub.id}>{Number(sub.id)>1300?"AL-"+sub.name:""+sub.name}</option>)
  })
  }
  return items;
}

addQuestion(value){

  let str = value.replace("  "," ")
  str = str.replace("(1)","///")
  str = str.replace("(2)","///")
  str = str.replace("(3)","///")
  str = str.replace("(4)","///")
  str = str.replace("(5)","///")
  let arr = str.split("///")
  this.setState({question:arr[0]})
  if(arr.length>1){
    arr.splice(0,1)
    this.setState({incorrect_answers:arr})
  }
}
  render() {
    return (
      <div className="App">
          <Form  >
          <Container>
          <Row>
          <Col>
          <Form.Group controlId="subjectsSelect" >
           <Form.Label>Subjects</Form.Label>
           <Form.Control as="select" onChange ={(event)=>{this.ChangeSub(event.target.value)}} value={this.state.subject_id} >
           {this.getOptions()}
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
             <option value="m-p">Model-Paper</option>
             <option value ="p-p">Past-Paper</option>
             <option value ="s-p">School-Paper</option>
             <option value = "o">Other</option>
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
      <Form.Control as="textarea" rows="3" value={this.state.question} onChange= {(event) => this.addQuestion(event.target.value)}/>
    </Form.Group>
    <Row><Col>
    <Form.Group controlId="correct_answer">
      <Form.Label>Correct Answer</Form.Label>
      <Form.Control type="Text" placeholder="Correct Answer" value={this.state.correct_answer} onChange= {(event) => this.setState({correct_answer:event.target.value})}/>
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
    <Row>
    <Col>
      <Form.Group controlId="incorrect_ans[3]">
        <Form.Label>Incorrect Answer 4</Form.Label>
        <Form.Control type="Text" placeholder="Incorrect Answer" value={this.state.incorrect_answers[3]} onChange= {(event) => {this.changeIncorrectAnswers(event,3)}} />
      </Form.Group>
    </Col>
    {Number(this.state.subject_id)>1200?
    (<Col><Form.Group controlId="incorrect_ans[4]">
      <Form.Label>Incorrect Answer 4</Form.Label>
      <Form.Control type="Text" placeholder="Incorrect Answer" value={this.state.incorrect_answers[4]} onChange= {(event) => {this.changeIncorrectAnswers(event,4)}} />
    </Form.Group></Col>):null
    }
  </Row>
  <Row>
    <Col>
    <Form.Group controlId="formBasicCheckbox">
    <Form.Check type="checkbox" label="Images" checked={this.state.images_exists}
      onChange = {()=>{
        this.setState({images_exists:!this.state.images_exists})
        this.setState({img_url:this.state.other+this.state.paper_type+this.state.subject_id+this.state.q_num})
    }}/>
  </Form.Group>
  </Col>
  <Col>
  { this.state.images_exists?
  (<Form.Group controlId="img_url">
    <Form.Label>IMAGE URL</Form.Label>
    <Form.Control type="Text"  onChange = {(event) =>{ this.setState({img_url:event.target.value})}} value= {this.state.img_url}/>
  </Form.Group>):null
  }
  </Col>
  </Row>
  <Row>
    <Button variant="primary" onClick={this.handleSubmit}>
      Submit
    </Button>
  </Row>
    </Container>
  </Form>
      </div>
    )
  }
}
