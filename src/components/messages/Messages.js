import React, { Component } from 'react';
import "bulma/css/bulma.css";

class Messages extends Component {
    constructor(props){
        super(props);
        this.scrollDown=this.scrollDown.bind(this)
    }
    scrollDown(){
        const{container}=this.refs
        container.scrollTop=container.scrollHeight
    }
    componentDidMount(){
        this.scrollDown()
    }
    componentDidUpdate(prevProps,prevState){
        this.scrollDown()
    }
    render() {
        const { messages ,user, typingUsers}=this.props
        return (
           
            <div ref='container'
            className="column is-full has has-text-centered">
            <h1> Messages</h1>
            <div >
            {
                messages.map((mes)=>{
                    return(
                        <div 
                        key={mes.id}
                        className={`${mes.sender === user.name ? 'is-primary ' : "" }`}
                        >

                        <div className="message has-text-centered">{mes.time} {mes.message} <i>{mes.sender}</i></div>
           
                        </div>
                     
                    )
                })
            }
            {
                typingUsers.map((name)=>{
                    return(
                        <div key={name} className="typing-user">
                        {`${name} is typing . . . `}
                        </div>
                    )


                })
            }
                </div>
                
            </div>
        );
    }
}

export default Messages;