import React from "react";
import axios from "axios";
import { withAuth } from "../providers/AuthProvider";
import { Link } from "react-router-dom";


class UserShow extends React.Component {
    state = { user: null, friends: null, currentUser: false }

    componentDidMount() {
        if(parseInt(this.props.match.params.id) !== this.props.user.id) {
            axios.get(`/api/search/users/${this.props.match.params.id}`)
            .then((res) => {
                this.setState({ user: res.data });
                return axios.get(`/api/friends/${this.state.user.id}`)
            })
            .then((res) => {
                this.setState({ friends: res.data }, console.log(this.state.friends));
            })
            .catch((err) => console.log(err));
            
        } else {
            this.setState({ user: this.props.user, currentUser: true }, () => {
                axios.get(`/api/friends/${this.state.user.id}`)
                .then((res) => {
                    this.setState({ friends: res.data },() => console.log(this.state.friends));
                })
                .catch((err) => console.log(err));
            });
        }
    }

    componentDidUpdate() {
        // console.log("here")
    }

    addFriend = () => {
        axios.post(`/api/friends/${this.state.user.id}`)
        .then((res) => {
            alert(res.data);
        })
        .catch((err) => console.log(err));
    }

    renderFriendsCards = () => {
        return this.state.friends.map((friend) => {
            return(
                <a href={`/user/${friend.id}`} key={friend.id} className="friends__card">
                    <img src={friend.image} alt="friend icon"/>
                    <p>{ friend.name }</p>
                </a>
            )
        })
    }

    render() {
        const { user, currentUser } = this.state;
        if(!user) {
            return null
        } else {
            return(
                <>
                    <div className="wallpaper" style={ user && {backgroundImage: `url(../images/${user.messaging_background}.jpg)`}} ></div>
                    <div className="user-show-container">
                        <div className="user-show__card">
                            <img 
                                src={user.image} 
                                alt="user picture" 
                                className="user-show__user-picture" 
                            />

                            <br />

                            <h2 
                                className="user-show__user-name" >
                                {!currentUser && (
                                    <button 
                                        className="btn-white" 
                                        onClick={() => this.addFriend()}
                                    >Add Friend</button>
                                )} 
                                {user.name} 
                            </h2> 

                            {this.state.friends && (
                                <div className="friends">
                                    <div className="friends__meta">
                                        <h2 className="friend-number">
                                            { this.state.friends.length } friends
                                        </h2>
                                    </div>
                                    <div className="friends__cards-container">
                                        { this.renderFriendsCards() }
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </>
    
            )
        }
    }
}



export default withAuth(UserShow);