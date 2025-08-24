export const Ques_For_Prompt = `. Based on the following inputs, generate a well structured list of the High-qulaity interview questions:
Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration: {{interviewDuration}}
Interview Type: {{interviewType}}
your task:
Analyze the job description to identify the key responsibilities, required skills and expected expereince.
Generate a list of interview questions that cover these topics and are relevant to the job and also depends on interview duration.
Adjust the number and depth of questions to match the interview duration.
Ensure the questions match the tone and structure of a real-life {{interviewType}} interview.
Format your reponse in JSON format with array list of questions. without any markdown formatting, no explanation, no code blocks, no extra text.
format: interviewQuestions=[
{
question:'',
type:'Technical/Behavioral/Problem Solving/Leadership/Experience'
},
{
---
},
]
the goal is to create structured, relevant and time-otimized interview questions for a {{jobTitle}} position.`;


export const FEEDBACK_PROMPT = `{{conversation}}
Depends on this interview conversation between assiatnat and user, Give me feedback for user interview. Give me rating out of 10 for technicalSkills, communication, Problem solving and Expereince. Also give me summary of the conversation. and one single line to let me know whether is recomended for hire or not with message. Give response in JSON format
{
 feedback:{
 rating:{
 technicalSkills:5,
 communication:6,
 problemSolving:4,
 expereince:7
 },
 summery: <in 3 lines>,
 recommendation: "",
 recomendationMessage:""
 }
}`