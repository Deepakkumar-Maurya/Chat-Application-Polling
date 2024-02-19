## Chat Application

A simple chat application built with NodeJs without using Socket.io and Web Socket.

## Dependencies

Make sure you have the following dependencies installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [mysql](https://www.mysql.com/) (Database)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Git](https://git-scm.com/)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Deepak-Maurya-Zignuts/Chat-Application.git` 

2.  Change into the project directory:

    `cd chat-application` 
    
3.  Install the dependencies:
    
    `npm install` 

## Database SetUp
1. Create database in mysql name ChatApp
2. Create a table named (messages) having fields name(varchar)(not null) and messages(varchar)(not null)
3. Create a table named (users) having fields name(varchar)(primary key, not null, unique) and email(varchar)(not null, unique) and password(varchar)(not null)
4. Create a table named (OneChatMessage) having fields sendername(varchar)(not null), receivername(varchar)(not null) and message(varchar)(not null)

5. Create a file named (.env) and mention the following details in the file
		
		database = ChatApp
		password = 'your mysql password'
		user = 'db user'
		host = localhost
		secret_key_session = 'provide any session key'
		
    

## Usage


1. Open two terminals in the root directory
2.  Start the application in a terminal:
    `npm start` 
		
4.  Open your web browser and visit http://localhost:3000.
5.  Open another browser and visit http://localhost:3000 and sign up with other user credentials
    
6.  You should see the chat application up and running and both the users can chat with other in real time.
    

## Configuration

You can modify the configuration settings in the `config.js` file to customize the application behavior.

## Features

-   Group Chat (currently available service)
-   One to One Chat (Available)

## Contributing

1.  Fork the repository.
2.  Create a new branch: `git checkout -b feature/your-feature`.
3.  Commit your changes: `git commit -m 'Add some feature'`.
4.  Push to the branch: `git push origin feature/your-feature`.
5.  Submit a pull request.