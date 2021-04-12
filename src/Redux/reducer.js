import { LOGIN_USER, LOGOUT_USER } from './actions';
import { user, authenticated } from './states'

export let reducer = (state = { user, authenticated }, action) => {
    switch(action.type){
        case LOGIN_USER:
            return { 
                ...state,
                user: {
                    ...action.user,
                    username: action.user.username,
                    firstName: 'John',
                    lastName: 'Smith',
                    email: 'johnsmith@me.com',
                    description: 'I am a dull person',
                    posts: [
                        'https://wallpapercave.com/wp/wp3788216.jpg',
                        'https://wallpapercave.com/wp/wp3788216.jpg',
                        'https://wallpapercave.com/wp/wp3788216.jpg',
                        'https://wallpapercave.com/wp/wp3788216.jpg',
                        'https://wallpapercave.com/wp/wp3788216.jpg',
                        'https://wallpapercave.com/wp/wp3788216.jpg',
                        'https://wallpapercave.com/wp/wp3788216.jpg',
                        'https://wallpapercave.com/wp/wp3788216.jpg',
                        'https://wallpapercave.com/wp/wp3788216.jpg',
                        'https://wallpapercave.com/wp/wp3788216.jpg',
                        'https://wallpapercave.com/wp/wp3788216.jpg',
                        'https://wallpapercave.com/wp/wp3788216.jpg',
                        'https://wallpapercave.com/wp/wp3788216.jpg',
                        'https://wallpapercave.com/wp/wp3788216.jpg',
                        'https://wallpapercave.com/wp/wp3788216.jpg',
                        'https://wallpapercave.com/wp/wp3788216.jpg',
                        'https://wallpapercave.com/wp/wp3788216.jpg',
                    ],
                    followers: ['q','w','e','a','s','t','u','y','i','p','o'],
                    following: ['q','w','e','a','s','t','u','y','p','o'],
                },
                authenticated: true,
            }
        case LOGOUT_USER:
            return { 
                ...state,
                user: {
                },
                authenticated: false,
            }
        default:
            return {...state};
    }
}