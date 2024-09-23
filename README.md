public ip : 3.38.102.2
포트번호 : 3000
기본 접속: 3.38.102.2:3000/api

insomnia등을 사용하여 실행시 api 기능 사용 Tooltip

>존재하는 기능(Ctrl +F로 검색) : 
로그인, 
회원가입, 
캐릭터 생성, 
캐릭터 상세 조회, 
캐릭터 삭제, 
아이템 생성, 
아이템 목록 조회, 
아이템 상세 조회

**로그인**
주소 : 3.38.102.2:3000/api/sign-in  (POST)
```
{
	"id": "입력할 아이디"
	"password": "입력할 비밀번호"
}
```
**회원가입**
주소 : 3.38.102.2:3000/api/sign-up  (POST)
```
{
	"id": "아이디",
	"password": "패스워드",
	"passwordCheck": "패스워드",
	"name": "이름",
}
```
**캐릭터 생성**
주소 : 3.38.102.2:3000/api/character/create  (POST) Bearer Token의 Token값이 필요합니다.
```
{
  "name": "캐릭터명"
}
```
**캐릭터 상세 조회**
주소 : 3.38.102.2:3000/api/character/create  (GET) Bearer Token의 Token값이 필요합니다.

**캐릭터 삭제**
주소 : 3.38.102.2:3000/api/character/delete/:id  (DELETE) Bearer Token의 Token값이 필요합니다.  

**아이템 생성**
주소 : 3.38.102.2:3000/api/item/create  (POST)
```
{
	"name": "아이템명"
	"health": 수치(int),
	"power" : 수치(int),
	"price" : 수치(int)
}
```
**아이템 목록 조회**
주소 : 3.38.102.2:3000/api/item/findAll (GET)

**아이템 상세 조회**
주소 : 3.38.102.2:3000/api/item/find/2 (GET)

**아이템 정보 수정**
주소 : 3.38.102.2:3000/api/item/modify/:id (PATCH)
```
{
	"name": "수정할 아이템이름",
	"health": "수정할 수치(int)", // 생략 가능 (default : 10)
  	"power": "수정할 수치(int)" // 생략 가능 (default : 1)
}
```


