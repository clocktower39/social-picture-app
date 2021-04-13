import { LOGIN_USER, LOGOUT_USER } from './actions';
import { user, authenticated, posts } from './states'

export let reducer = (state = { user, authenticated, posts }, action) => {
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
                        'https://instagram.fphx1-1.fna.fbcdn.net/v/t51.2885-15/e35/s1080x1080/118824835_752102178682317_8673046612174740959_n.jpg?tp=1&_nc_ht=instagram.fphx1-1.fna.fbcdn.net&_nc_cat=109&_nc_ohc=BGDO5TOKrPEAX_PYAIr&edm=AABBvjUAAAAA&ccb=7-4&oh=cb17c611e0431a668ebffd22d6426c7b&oe=609B43B5&_nc_sid=83d603',
                        'https://instagram.fphx1-1.fna.fbcdn.net/v/t51.2885-15/e35/22069518_1951451185137575_6854561976698273792_n.jpg?tp=1&_nc_ht=instagram.fphx1-1.fna.fbcdn.net&_nc_cat=111&_nc_ohc=_5_iCKUYQiMAX8QQKXW&edm=AABBvjUAAAAA&ccb=7-4&oh=7b77c21bad60724f4501a3c3cf57d599&oe=609A87FC&_nc_sid=83d603',
                        'https://instagram.fphx1-1.fna.fbcdn.net/v/t51.2885-15/e35/18723523_316242025479585_967380910284472320_n.jpg?tp=1&_nc_ht=instagram.fphx1-1.fna.fbcdn.net&_nc_cat=109&_nc_ohc=IDIBFknkq7EAX--vkZc&edm=AABBvjUAAAAA&ccb=7-4&oh=132bc82c611f71d4709a38143bf154f4&oe=609A4088&_nc_sid=83d603',
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