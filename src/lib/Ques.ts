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
