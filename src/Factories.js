const uuidv4 = require('uuid/v4')

/*
*	createUser
*	Создаёт юзера
*	
*/
const createUser = ({name = "", socketId=null} = {})=>(
	{
		id:uuidv4(),
		name,
		socketId
		
	}
)

/*
*	createMessage
*	Создаёт объект сообщения
* 	
*/
const createMessage = ({message = "", sender = ""} = { })=>(
		{
			id:uuidv4(),
			time:getTime(new Date(Date.now())),
			message,
			sender	
		}

	)

/*
*	createChat
*	Создать объект чата
* 	
*/
const createChat = ({messages = [], name = "Community", users = [], isCommunity=false} = {})=>(
	{
		id:uuidv4(),
		name: isCommunity ? "Community": createChatNameFromUsers(users),
		messages,
		users,
		typingUsers:[],
		isCommunity
	}
)
// createChatNameFromUsers
const createChatNameFromUsers=(users, excludedUser="")=>{
return users.filter(u=>u !== excludedUser).join(' & ') || "Empty Users"
}
const burger =()=>{
	

		// Get all "navbar-burger" elements
		const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
	  console.log($navbarBurgers)
		// Check if there are any navbar burgers
		if ($navbarBurgers.length > 0) {
	  
		  // Add a click event on each of them
		  $navbarBurgers.forEach( el => {
			el.addEventListener('onClick', () => {
	  
			  // Get the target from the "data-target" attribute
			  const target = el.dataset.target;
			  const $target = document.getElementById(target);
	  
			  // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
			  el.classList.toggle('is-active');
			  $target.classList.toggle('is-active');
	  
			});
		  });
		}
}

/*
* Вернуть стринг с датой
*/
const getTime = (date)=>{
	return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
}

module.exports = {
	createMessage,
	createChat,
	createUser,
	createChatNameFromUsers,
	burger
}
