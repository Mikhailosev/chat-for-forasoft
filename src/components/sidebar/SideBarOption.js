import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import "bulma/css/bulma.css";

export default class SideBarOption extends PureComponent {
    static propTypes = {
        name: PropTypes.string.isRequired,
        lastMessage: PropTypes.string,
        active: PropTypes.bool,
        onClick: PropTypes.func
    }
    static defaultProps = {
        lastMessage: "",
        active:false,
        onClock: () => { }
    }
    render() {
        const { active, lastMessage, name, onClick } = this.props
        return (
            <button className={`user ${active ? 'active':''}button is-warning`}
                onClick={onClick}
                >
                <div className="item">
                    <div className="name">{name}</div>
                    <div className="last-message">{lastMessage}</div>
                </div>
                
            </button>
        )
    }
}