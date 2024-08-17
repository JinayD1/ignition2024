import wolframalpha 
import google.generativeai as genai
  


genai.configure(api_key='AIzaSyDVYH_1-EdSYMZNoXQwptplVj3aUcHPn3A')
gemini = genai.GenerativeModel('gemini-1.5-flash')



response = gemini.generate_content(input('Chat: '))
print(response.text)

  
llm = '6U5L35-8WGRRXL2QA'
math = '6U5L35-5XPQYT4H73'
chat = '6U5L35-3LEAYAE6AJ'

client = wolframalpha.Client(chat) 
question = input('Question: ')  
res = client.query(question) 
  
answer = next(res.results).text

print(answer)